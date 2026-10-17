import AsyncStorage from "@react-native-async-storage/async-storage";

import { VintageAppraisal } from "../types";

const INVENTORY_KEY = "thriftscan.inventory.v1";

export async function loadInventory(): Promise<VintageAppraisal[] | undefined> {
  const raw = await AsyncStorage.getItem(INVENTORY_KEY);
  if (!raw) {
    return undefined;
  }

  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    return undefined;
  }

  return parsed as VintageAppraisal[];
}

export async function saveInventory(items: VintageAppraisal[]): Promise<void> {
  await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
}
