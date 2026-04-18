import { getMockUserEntitlement } from '../data/mockSwapData';

export const hasActiveSwapSession = () => (
    localStorage.getItem('activeSwapSession') === 'true'
    || localStorage.getItem('isCharging') === 'true'
);

export const activateSwapFromEntitlement = (entitlement = getMockUserEntitlement()) => {
    if (!entitlement?.hasActivePlan || !entitlement.billingOptionId) return false;

    localStorage.setItem('activeSwapSession', 'true');
    localStorage.setItem('activeBillingOptionId', entitlement.billingOptionId);
    localStorage.setItem('activeBillingMode', entitlement.profile);
    return true;
};

export const getPostAuthSwapTarget = (cabinetId) => {
    if (hasActiveSwapSession()) return { path: '/screen6' };

    const savedCabinetId = cabinetId || localStorage.getItem('currentCabinetId') || localStorage.getItem('currentChargerId');
    return {
        path: savedCabinetId ? `/screen4?cabinetId=${savedCabinetId}` : '/screen4',
        state: savedCabinetId ? { cabinetId: savedCabinetId } : undefined,
    };
};
