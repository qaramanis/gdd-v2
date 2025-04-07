export const STORAGE_KEYS = {
  TEMPLATE: "gdd-template",
  SECTIONS: "gdd-sections",
  INFO: "gdd-info",
  STRUCTURE: "gdd-structure",
  THEME: "gdd-theme",
};

export function saveToStorage(key: string, data: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window !== "undefined") {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      return defaultValue;
    }
  }
  return defaultValue;
}

export function clearFormData() {
  if (typeof window !== "undefined") {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  }
}
