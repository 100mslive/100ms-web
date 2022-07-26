import { selectAppDataByPath, useHMSStore } from "@100mslive/react-sdk";
import { APP_DATA } from "../../common/constants";

export const useAppPolicyConfig = path => {
  return useHMSStore(selectAppDataByPath(APP_DATA.appPolicyConfig, path));
};
