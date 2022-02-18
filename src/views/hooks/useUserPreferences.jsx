import { useLocalStorage } from "react-use";

export const UserPreferencesKeys = {
  PREVIEW: "preview",
  NOTIFICATIONS: "notifications",
  UI_SETTINGS: "uiSettings",
};

export const useUserPreferences = (key, defaultValue) => {
  const [value, setValue] = useLocalStorage(key, defaultValue);
  return [value, setValue];
};
