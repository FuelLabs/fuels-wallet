/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TargetObject {
  on?: (event: string, callback: (data: any) => void) => void;
  emit?: (event: string, data: any) => void;
  addEventListener?: (event: string, callback: (event: any) => void) => void;
  removeEventListener?: (event: string, callback: (event: any) => void) => void;
  postMessage?: (message: string) => void;
}

export interface FuelStorage {
  setItem: (key: string, value: string) => void;
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
}
