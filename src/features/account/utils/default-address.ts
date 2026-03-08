const DEFAULT_ADDRESS_KEY = "default-address-id";

export function getDefaultAddressId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(DEFAULT_ADDRESS_KEY);
}

export function setDefaultAddressId(addressId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEFAULT_ADDRESS_KEY, addressId);
  window.dispatchEvent(new Event("default-address-changed"));
}

export function clearDefaultAddressId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEFAULT_ADDRESS_KEY);
  window.dispatchEvent(new Event("default-address-changed"));
}