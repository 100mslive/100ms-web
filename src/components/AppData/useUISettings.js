import { APP_DATA } from "../../common/constants";
import {
  selectAppData,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { useCallback } from "react";

/**
 * fields saved related to UI settings in store's app data can be
 * accessed using this hook. key is optional if not passed
 * the whole UI settings object is returned. Usage -
 * 1. val = useUiSettings("isAudioOnly");
 *    console.log(val); // false
 * 2. val = useUISettings();
 *    console.log(val); // {isAudioOnly: false}
 * @param {string | undefined} uiSettingKey
 */
export const useUISettings = uiSettingKey => {
  let value = useHMSStore(selectAppData(APP_DATA.uiSettings));
  if (value) {
    return uiSettingKey ? value[uiSettingKey] : value;
  }
};

/**
 * fields saved related to UI settings in store's app data can be
 * accessed using this hook. key is optional if not passed
 * the whole UI settings object is returned. Usage -
 * [val, setVal] = useUiSettings("isAudioOnly");
 * console.log(val); // false
 * setVal(true);
 * @param {string} uiSettingKey
 */
export const useSetUiSettings = uiSettingKey => {
  const actions = useHMSActions();
  let value = useUISettings(uiSettingKey);
  const setValue = useCallback(
    newValue => {
      actions.setAppData(
        APP_DATA.uiSettings,
        { [uiSettingKey]: newValue },
        true
      );
    },
    [actions, uiSettingKey]
  );
  return [value, setValue];
};
