import { mkdir, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..');
const baseUrl = process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:5173';
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outRoot = join(rootDir, 'output', 'playwright');
const presentationDir = join(outRoot, 'presentation-flow');
const actionsDir = join(outRoot, 'actions');
const categorizedDir = join(outRoot, 'categorized-flows');
const userDataDir = `/tmp/smartez-capture-${Date.now()}`;
const debugPort = 9333;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const launchChrome = () => {
    const chrome = spawn(chromePath, [
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-dev-shm-usage',
        `--user-data-dir=${userDataDir}`,
        `--remote-debugging-port=${debugPort}`,
        '--window-size=390,844',
        'about:blank'
    ], {
        stdio: ['ignore', 'ignore', 'pipe']
    });

    chrome.stderr.on('data', () => {});
    return chrome;
};

const getBrowserWsUrl = async () => {
    const versionUrl = `http://127.0.0.1:${debugPort}/json/version`;
    for (let attempt = 0; attempt < 80; attempt += 1) {
        try {
            const response = await fetch(versionUrl);
            if (response.ok) {
                const version = await response.json();
                if (version.webSocketDebuggerUrl) return version.webSocketDebuggerUrl;
            }
        } catch {
            // Chrome is still starting.
        }
        await sleep(100);
    }
    throw new Error('Chrome DevTools endpoint did not become ready.');
};

const createCdpClient = async (wsUrl) => {
    const ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
        ws.addEventListener('open', resolve, { once: true });
        ws.addEventListener('error', reject, { once: true });
    });

    let id = 0;
    const callbacks = new Map();
    const eventWaiters = new Map();

    ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (message.id && callbacks.has(message.id)) {
            const { resolve, reject } = callbacks.get(message.id);
            callbacks.delete(message.id);
            if (message.error) reject(new Error(message.error.message));
            else resolve(message.result);
            return;
        }

        const key = `${message.sessionId || 'browser'}:${message.method}`;
        const waiters = eventWaiters.get(key) || [];
        eventWaiters.set(key, waiters.filter((waiter) => {
            if (!waiter.predicate(message.params)) return true;
            waiter.resolve(message.params);
            return false;
        }));
    });

    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
        const messageId = id += 1;
        callbacks.set(messageId, { resolve, reject });
        ws.send(JSON.stringify({ id: messageId, method, params, sessionId }));
    });

    const waitForEvent = (method, sessionId, predicate = () => true, timeoutMs = 5000) => {
        const key = `${sessionId || 'browser'}:${method}`;
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                const waiters = eventWaiters.get(key) || [];
                eventWaiters.set(key, waiters.filter((waiter) => waiter.resolve !== wrappedResolve));
                reject(new Error(`Timed out waiting for ${method}`));
            }, timeoutMs);

            const wrappedResolve = (params) => {
                clearTimeout(timer);
                resolve(params);
            };

            const waiters = eventWaiters.get(key) || [];
            waiters.push({ predicate, resolve: wrappedResolve });
            eventWaiters.set(key, waiters);
        });
    };

    return { send, waitForEvent, close: () => ws.close() };
};

const setupPage = async (client) => {
    const target = await client.send('Target.createTarget', { url: 'about:blank' });
    const attached = await client.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await client.send('Page.enable', {}, sessionId);
    await client.send('Runtime.enable', {}, sessionId);
    await client.send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true,
        screenWidth: 390,
        screenHeight: 844
    }, sessionId);
    await client.send('Emulation.setTouchEmulationEnabled', { enabled: true }, sessionId);
    return sessionId;
};

const navigate = async (client, sessionId, url, waitMs = 900) => {
    const loadEvent = client.waitForEvent('Page.loadEventFired', sessionId, () => true, 6000).catch(() => null);
    await client.send('Page.navigate', { url }, sessionId);
    await loadEvent;
    await sleep(waitMs);
};

const evaluate = (client, sessionId, expression) => client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
}, sessionId);

const prepareState = async (client, sessionId, { phone = '', loggedIn = true, activeSwap = false } = {}) => {
    await navigate(client, sessionId, baseUrl, 300);
    await evaluate(client, sessionId, `
        (() => {
            localStorage.clear();
            localStorage.setItem('i18nextLng', 'th');
            localStorage.setItem('currentCabinetId', 'AMR001');
            ${loggedIn ? "localStorage.setItem('isLoggedIn', 'true');" : ''}
            ${phone ? `localStorage.setItem('userPhone', '${phone}'); localStorage.setItem('lastLoginPhone', '${phone}');` : ''}
            ${activeSwap ? "localStorage.setItem('activeSwapSession', 'true'); localStorage.setItem('activeBillingOptionId', 'pass_30d'); localStorage.setItem('activeBillingMode', 'monthly');" : ''}
            return true;
        })()
    `);
};

const screenshot = async (client, sessionId, filePath) => {
    await mkdir(dirname(filePath), { recursive: true });
    const shot = await client.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: true
    }, sessionId);
    await writeFile(filePath, Buffer.from(shot.data, 'base64'));
    console.log(filePath);
};

const clickText = async (client, sessionId, text) => {
    await evaluate(client, sessionId, `
        (() => {
            const target = [...document.querySelectorAll('button, a, [role="button"]')]
                .find((element) => (element.innerText || element.textContent || '').includes(${JSON.stringify(text)}));
            if (!target) return false;
            target.click();
            return true;
        })()
    `);
};

const clickAnyText = async (client, sessionId, text) => {
    await evaluate(client, sessionId, `
        (() => {
            const candidates = [...document.querySelectorAll('button, a, [role="button"], div, span')]
                .filter((element) => (element.innerText || element.textContent || '').includes(${JSON.stringify(text)}));
            const target = candidates.find((element) => {
                let current = element;
                while (current && current !== document.body) {
                    if (window.getComputedStyle(current).cursor === 'pointer') return true;
                    current = current.parentElement;
                }
                return false;
            }) || candidates[0];
            if (!target) return false;
            let clickable = target;
            while (clickable && clickable !== document.body && window.getComputedStyle(clickable).cursor !== 'pointer') {
                clickable = clickable.parentElement;
            }
            (clickable || target).click();
            return true;
        })()
    `);
};

const scrollToTop = async (client, sessionId) => {
    await evaluate(client, sessionId, 'window.scrollTo(0, 0)');
    await sleep(250);
};

const scrollToText = async (client, sessionId, text) => {
    await evaluate(client, sessionId, `
        (() => {
            const target = [...document.querySelectorAll('body *')]
                .find((element) => (element.innerText || element.textContent || '').includes(${JSON.stringify(text)}));
            if (target) target.scrollIntoView({ block: 'center' });
            return Boolean(target);
        })()
    `);
    await sleep(350);
};

const dismissModal = async (client, sessionId) => {
    await clickText(client, sessionId, 'ภายหลัง');
    await sleep(250);
};

const capturePurchaseFlow = async (client, sessionId, {
    typeDir,
    packageTitle,
    existingPlanPhone,
    myPackageFile,
    selectedFile,
    paymentFile,
    cabinetFile,
    swapFile,
    scrollTarget
}) => {
    const targetDir = join(categorizedDir, typeDir);

    await prepareState(client, sessionId, { phone: '0833333333' });
    await navigate(client, sessionId, `${baseUrl}/#/screen11?cabinetId=AMR001`, 1200);
    if (scrollTarget) await scrollToText(client, sessionId, scrollTarget);
    await clickAnyText(client, sessionId, packageTitle);
    await sleep(350);
    await screenshot(client, sessionId, join(targetDir, selectedFile));

    await clickText(client, sessionId, 'ชำระเงิน');
    await sleep(900);
    await screenshot(client, sessionId, join(targetDir, paymentFile));

    await captureScreen(client, sessionId, {
        filePath: join(targetDir, cabinetFile),
        route: '/screen4?cabinetId=AMR001',
        phone: existingPlanPhone,
        afterLoad: async () => {
            await dismissModal(client, sessionId);
            await scrollToTop(client, sessionId);
        }
    });

    await captureScreen(client, sessionId, {
        filePath: join(targetDir, myPackageFile),
        route: '/screen8',
        phone: existingPlanPhone
    });

    await prepareState(client, sessionId, { phone: existingPlanPhone, activeSwap: true });
    await navigate(client, sessionId, `${baseUrl}/#/screen6`, 650);
    await screenshot(client, sessionId, join(targetDir, swapFile));
};

const captureScreen = async (client, sessionId, {
    filePath,
    route,
    phone = '0811111111',
    loggedIn = true,
    activeSwap = false,
    afterLoad
}) => {
    await prepareState(client, sessionId, { phone, loggedIn, activeSwap });
    await navigate(client, sessionId, `${baseUrl}/#${route}`, 1200);
    if (afterLoad) await afterLoad();
    await screenshot(client, sessionId, filePath);
};

const main = async () => {
    await mkdir(presentationDir, { recursive: true });
    await mkdir(actionsDir, { recursive: true });
    await mkdir(categorizedDir, { recursive: true });

    const chrome = launchChrome();
    const wsUrl = await getBrowserWsUrl();
    const client = await createCdpClient(wsUrl);
    const sessionId = await setupPage(client);

    try {
        await captureScreen(client, sessionId, {
            filePath: join(presentationDir, '01-login.png'),
            route: '/screen1',
            loggedIn: false,
            phone: ''
        });

        await captureScreen(client, sessionId, {
            filePath: join(presentationDir, '02-cabinet-no-package-popup.png'),
            route: '/screen4?cabinetId=AMR001',
            phone: '0833333333'
        });

        await captureScreen(client, sessionId, {
            filePath: join(presentationDir, '03-package-selection.png'),
            route: '/screen11?cabinetId=AMR001',
            phone: '0833333333'
        });

        await captureScreen(client, sessionId, {
            filePath: join(presentationDir, '04-payment-package.png'),
            route: '/screen5',
            phone: '0833333333'
        });

        await captureScreen(client, sessionId, {
            filePath: join(presentationDir, '05-cabinet-with-package.png'),
            route: '/screen4?cabinetId=AMR001',
            phone: '0811111111'
        });

        await captureScreen(client, sessionId, {
            filePath: join(presentationDir, '06-my-packages.png'),
            route: '/screen8',
            phone: '0811111111'
        });

        await captureScreen(client, sessionId, {
            filePath: join(actionsDir, '01-cabinet-no-package-popup.png'),
            route: '/screen4?cabinetId=AMR001',
            phone: '0833333333'
        });

        await captureScreen(client, sessionId, {
            filePath: join(actionsDir, '02-cabinet-quota-package.png'),
            route: '/screen4?cabinetId=AMR001',
            phone: '0822222222',
            afterLoad: () => dismissModal(client, sessionId)
        });

        await captureScreen(client, sessionId, {
            filePath: join(actionsDir, '03-cabinet-pass-package.png'),
            route: '/screen4?cabinetId=AMR001',
            phone: '0811111111',
            afterLoad: () => dismissModal(client, sessionId)
        });

        await captureScreen(client, sessionId, {
            filePath: join(actionsDir, '04-package-selection-groups.png'),
            route: '/screen11?cabinetId=AMR001',
            phone: '0833333333'
        });

        await captureScreen(client, sessionId, {
            filePath: join(actionsDir, '05-my-packages-pass.png'),
            route: '/screen8',
            phone: '0811111111'
        });

        await captureScreen(client, sessionId, {
            filePath: join(actionsDir, '06-my-packages-quota.png'),
            route: '/screen8',
            phone: '0822222222'
        });

        await prepareState(client, sessionId, { phone: '0811111111', activeSwap: true });
        await navigate(client, sessionId, `${baseUrl}/#/screen6`, 350);
        await screenshot(client, sessionId, join(presentationDir, '07-swap-connecting.png'));
        await screenshot(client, sessionId, join(actionsDir, '07-swap-connecting.png'));

        await sleep(1500);
        await screenshot(client, sessionId, join(presentationDir, '08-swap-return-battery.png'));
        await screenshot(client, sessionId, join(actionsDir, '08-swap-return-battery.png'));

        await clickText(client, sessionId, 'ฉันใส่แบตเก่าแล้ว');
        await sleep(250);
        await screenshot(client, sessionId, join(actionsDir, '09-swap-verifying-return.png'));

        await sleep(1800);
        await screenshot(client, sessionId, join(presentationDir, '09-swap-pickup-battery.png'));
        await screenshot(client, sessionId, join(actionsDir, '10-swap-pickup-battery.png'));

        await clickText(client, sessionId, 'ยืนยันรับแบตเตอรี่');
        await sleep(350);
        await screenshot(client, sessionId, join(actionsDir, '11-swap-complete-confirm.png'));

        await captureScreen(client, sessionId, {
            filePath: join(categorizedDir, 'no-package', '01-cabinet-no-package-popup.png'),
            route: '/screen4?cabinetId=AMR001',
            phone: '0833333333'
        });

        await captureScreen(client, sessionId, {
            filePath: join(categorizedDir, 'no-package', '02-package-store-before-purchase.png'),
            route: '/screen11?cabinetId=AMR001',
            phone: '0833333333'
        });

        await capturePurchaseFlow(client, sessionId, {
            typeDir: 'per-swap',
            packageTitle: 'แพ็ก 20 ครั้ง',
            existingPlanPhone: '0822222222',
            selectedFile: '01-select-per-swap-package.png',
            paymentFile: '02-payment-per-swap-package.png',
            cabinetFile: '03-cabinet-after-per-swap-package.png',
            myPackageFile: '04-my-packages-per-swap.png',
            swapFile: '05-start-swap-with-per-swap-package.png',
            scrollTarget: 'แบบรายครั้ง'
        });

        await capturePurchaseFlow(client, sessionId, {
            typeDir: 'time-pass',
            packageTitle: 'เหมารายเดือน',
            existingPlanPhone: '0811111111',
            selectedFile: '01-select-time-pass-package.png',
            paymentFile: '02-payment-time-pass-package.png',
            cabinetFile: '03-cabinet-after-time-pass-package.png',
            myPackageFile: '04-my-packages-time-pass.png',
            swapFile: '05-start-swap-with-time-pass-package.png',
            scrollTarget: 'แบบเหมา'
        });
    } finally {
        client.close();
        chrome.kill('SIGTERM');
        await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
    }
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
