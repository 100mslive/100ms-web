import { selectAppData, useHMSStore } from "@100mslive/react-sdk";
import { APP_DATA } from "../../common/constants";

export const useAppConfig = () => {
  const value = useHMSStore(selectAppData(APP_DATA.appConfig));
  return value;
};
