import {
  selectAppData,
  useHMSActions,
  useHMSStore,
  useHMSVanillaStore,
} from "@100mslive/react-sdk";
import { useCallback } from "react";
import { APP_DATA } from "../../common/constants";

export const useSidepaneState = sidepaneType => {
  const sidepane = useHMSStore(selectAppData(APP_DATA.sidePane));
  return sidepaneType && sidepane === sidepaneType;
};

export const useSidepaneToggle = sidepaneType => {
  const hmsActions = useHMSActions();
  const vanillaStore = useHMSVanillaStore();
  const toggleSidepane = useCallback(() => {
    const isOpen =
      vanillaStore.getState(selectAppData(APP_DATA.sidePane)) === sidepaneType;
    hmsActions.setAppData(APP_DATA.sidePane, !isOpen ? sidepaneType : "");
  }, [vanillaStore, hmsActions, sidepaneType]);
  return toggleSidepane;
};
