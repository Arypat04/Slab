import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesPackage,
  type PurchasesOffering,
} from 'react-native-purchases';
import { Platform } from 'react-native';

export const ENTITLEMENT_ID = 'Slab Pro';

// Single test key provided by the developer — replace with platform-specific
// production keys (appl_*** / goog_***) before App Store submission
const API_KEY = 'test_LjjYWTCeacoxoBhqyuaZbsujucd';

export function isEntitled(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

export async function initPurchases(
  onCustomerInfoUpdate: (isPro: boolean) => void,
): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey: API_KEY });

    // Keep store in sync whenever entitlements change (renewal, expiry, etc.)
    Purchases.addCustomerInfoUpdateListener((info) => {
      onCustomerInfoUpdate(isEntitled(info));
    });

    // Sync entitlement status on launch
    const info = await Purchases.getCustomerInfo();
    onCustomerInfoUpdate(isEntitled(info));
  } catch (e) {
    console.warn('[purchases] init failed:', e);
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    return await Purchases.getCustomerInfo();
  } catch {
    return null;
  }
}

export async function fetchOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch {
    return null;
  }
}

export async function purchasePackage(
  pkg: PurchasesPackage,
): Promise<{ success: boolean; customerInfo: CustomerInfo | null }> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { success: isEntitled(customerInfo), customerInfo };
  } catch (e: any) {
    if (e?.userCancelled) return { success: false, customerInfo: null };
    throw e;
  }
}

export async function restorePurchases(): Promise<{
  success: boolean;
  customerInfo: CustomerInfo | null;
}> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return { success: isEntitled(customerInfo), customerInfo };
  } catch {
    return { success: false, customerInfo: null };
  }
}
