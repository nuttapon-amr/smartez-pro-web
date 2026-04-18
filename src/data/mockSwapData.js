export const SWAP_CABINETS = {
    AMR001: {
        name: 'AMR Swap Station 1 (HQ)',
        address: '731 Ratchadaphisek Rd, Bang Sue, Bangkok 10800',
        batteryModel: 'Gogoro G1 / AMR-M2',
        fullBatteries: 8,
        emptySlots: 3,
        faultSlots: 0,
        price: '45.00',
        status: 'READY'
    },
    AMR002: {
        name: 'AMR Swap Station Bang Na',
        address: '123/45 Main Rd, Bang Na, Bangkok 10260',
        batteryModel: 'AMR-M2 / AMR-M3',
        fullBatteries: 5,
        emptySlots: 4,
        faultSlots: 1,
        price: '45.00',
        status: 'READY'
    },
    AMR003: {
        name: 'AMR Swap Station Phaya Thai',
        address: 'Phaya Thai, Bangkok 10400',
        batteryModel: 'AMR-M2',
        fullBatteries: 0,
        emptySlots: 6,
        faultSlots: 2,
        price: '45.00',
        status: 'CLOSED'
    }
};

export const BILLING_OPTIONS = [
    {
        id: 'swap_5_30d',
        group: 'per_swap',
        type: 'swap_quota',
        titleKey: 'billing.swap_5_title',
        descriptionKey: 'billing.swap_5_desc',
        price: 220,
        swapQuota: 5,
        validityDays: 30,
        quotaLabelKey: 'billing.swap_5_quota',
        badgeKey: null
    },
    {
        id: 'swap_10_30d',
        group: 'per_swap',
        type: 'swap_quota',
        titleKey: 'billing.swap_10_title',
        descriptionKey: 'billing.swap_10_desc',
        price: 420,
        swapQuota: 10,
        validityDays: 30,
        quotaLabelKey: 'billing.swap_10_quota',
        badgeKey: 'billing.popular'
    },
    {
        id: 'swap_20_30d',
        group: 'per_swap',
        type: 'swap_quota',
        titleKey: 'billing.swap_20_title',
        descriptionKey: 'billing.swap_20_desc',
        price: 790,
        swapQuota: 20,
        validityDays: 30,
        quotaLabelKey: 'billing.swap_20_quota',
        badgeKey: null
    },
    {
        id: 'swap_40_30d',
        group: 'per_swap',
        type: 'swap_quota',
        titleKey: 'billing.swap_40_title',
        descriptionKey: 'billing.swap_40_desc',
        price: 1490,
        swapQuota: 40,
        validityDays: 30,
        quotaLabelKey: 'billing.swap_40_quota',
        badgeKey: 'billing.best_value'
    },
    {
        id: 'pass_1d',
        group: 'pass',
        type: 'time_pass',
        titleKey: 'billing.pass_1d_title',
        descriptionKey: 'billing.pass_1d_desc',
        price: 99,
        validityDays: 1,
        quotaLabelKey: 'billing.pass_1d_quota',
        badgeKey: null
    },
    {
        id: 'pass_7d',
        group: 'pass',
        type: 'time_pass',
        titleKey: 'billing.pass_7d_title',
        descriptionKey: 'billing.pass_7d_desc',
        price: 590,
        validityDays: 7,
        quotaLabelKey: 'billing.pass_7d_quota',
        badgeKey: 'billing.popular'
    },
    {
        id: 'pass_15d',
        group: 'pass',
        type: 'time_pass',
        titleKey: 'billing.pass_15d_title',
        descriptionKey: 'billing.pass_15d_desc',
        price: 1090,
        validityDays: 15,
        quotaLabelKey: 'billing.pass_15d_quota',
        badgeKey: null
    },
    {
        id: 'pass_30d',
        group: 'pass',
        type: 'time_pass',
        titleKey: 'billing.pass_30d_title',
        descriptionKey: 'billing.pass_30d_desc',
        price: 1990,
        validityDays: 30,
        quotaLabelKey: 'billing.pass_30d_quota',
        badgeKey: 'billing.best_value'
    }
];

export const USER_ENTITLEMENTS = {
    none: {
        profile: 'none',
        hasActivePlan: false,
        planNameKey: 'billing.no_active_plan',
        remainingQuota: 0,
        expiresAt: null,
        billingOptionId: null
    },
    daily: {
        profile: 'daily',
        hasActivePlan: true,
        planNameKey: 'billing.pass_1d_title',
        remainingQuota: 4,
        expiresAt: '2026-04-18T23:59:00',
        billingOptionId: 'pass_1d'
    },
    monthly: {
        profile: 'monthly',
        hasActivePlan: true,
        planNameKey: 'billing.pass_30d_title',
        remainingQuota: 42,
        expiresAt: '2026-04-30T23:59:00',
        billingOptionId: 'pass_30d'
    },
    quota: {
        profile: 'quota',
        hasActivePlan: true,
        planNameKey: 'billing.swap_20_title',
        remainingQuota: 20,
        expiresAt: '2026-05-18T23:59:00',
        billingOptionId: 'swap_20_30d'
    }
};

export const getMockUserEntitlement = () => {
    const profile = localStorage.getItem('mockBillingProfile') || 'none';
    return USER_ENTITLEMENTS[profile] || USER_ENTITLEMENTS.none;
};

export const setMockUserEntitlement = (profile) => {
    localStorage.setItem('mockBillingProfile', profile);
    return USER_ENTITLEMENTS[profile] || USER_ENTITLEMENTS.none;
};

export const getBillingOption = (id) => BILLING_OPTIONS.find(option => option.id === id) || BILLING_OPTIONS[0];

export const SWAP_SUMMARY = {
    stationNameKey: 'mock_station.name',
    stationAddressKey: 'mock_station.address',
    cabinetCode: 'SWAP-BN-004',
    batteryModel: 'AMR-M2 72V',
    pickupSlot: '04',
    returnedBatteryId: 'BAT-OLD-9182',
    pickupBatteryId: 'BAT-FULL-2048',
    pickupBatterySoc: 96,
    totalCost: 45.00,
    unitPrice: 45.00,
    serviceTime: '00:02:40',
    startedAt: '2026-01-21T09:20:00',
    completedAt: '2026-01-21T09:23:00'
};

export const SWAP_RECEIPT = {
    receiptNo: 'REC-2026-000142',
    date: '2026-01-21',
    time: '09:20 - 09:23',
    stationName: 'AMR Swap Station Bang Na',
    cabinetCode: 'SWAP-BN-004',
    batteryModel: 'AMR-M2 72V',
    pickupSlot: '04',
    returnedBatteryId: 'BAT-OLD-9182',
    pickupBatteryId: 'BAT-FULL-2048',
    pickupBatterySoc: '96',
    serviceTime: '00:02:40',
    unitPrice: '45.00',
    totalAmount: '45.00',
    discount: '0.00',
    netAmount: '45.00',
    vatAmount: '2.94',
    paymentMethod: 'PromptPay'
};

export const SWAP_HISTORY_PREVIOUS = [
    { id: 'prev-1', stationName: 'AMR Swap Station Siam', cabinetName: 'SWAP-SM-003 - AMR-M2', pickupSlot: '05', startTime: '20 Jan 2026 - 18:30', endTime: '20 Jan 2026 - 18:33', energy: '95', cost: '45.00', duration: '00:03:10', isFeedbackDone: true },
    { id: 'prev-2', stationName: 'AMR Swap Station Asok', cabinetName: 'SWAP-AS-002 - AMR-M2', pickupSlot: '04', startTime: '19 Jan 2026 - 10:00', endTime: '19 Jan 2026 - 10:02', energy: '97', cost: '45.00', duration: '00:02:20', isFeedbackDone: false },
];

export const SWAP_HISTORY_TODAY = [
    { id: 'today-1', stationName: 'AMR Swap Station Bang Na', cabinetName: 'SWAP-BN-004 - AMR-M2', pickupSlot: '04', startTime: '21 Jan 2026 - 09:20', endTime: '21 Jan 2026 - 09:23', energy: '96', cost: '45.00', duration: '00:02:40', isFeedbackDone: false },
    { id: 'today-2', stationName: 'AMR Swap Station Hua Mak', cabinetName: 'SWAP-HM-001 - AMR-M3', pickupSlot: '02', startTime: '21 Jan 2026 - 14:15', endTime: '21 Jan 2026 - 14:18', energy: '94', cost: '45.00', duration: '00:03:00', isFeedbackDone: false },
];

export const getMoreSwapHistory = (loadCount) => [
    { id: `load-${loadCount}-1`, stationName: 'AMR Swap Station Khlong San', cabinetName: `SWAP-KS-00${5 + loadCount * 2} - AMR-M2`, pickupSlot: '03', startTime: '18 Jan 2026 - 09:00', endTime: '18 Jan 2026 - 09:03', energy: '95', cost: '45.00', duration: '00:03:00', isFeedbackDone: false },
    { id: `load-${loadCount}-2`, stationName: 'AMR Swap Station Rangsit', cabinetName: `SWAP-RS-00${6 + loadCount * 2} - AMR-M2`, pickupSlot: '06', startTime: '17 Jan 2026 - 13:45', endTime: '17 Jan 2026 - 13:48', energy: '98', cost: '45.00', duration: '00:02:50', isFeedbackDone: false },
];
