import { useCallback } from "react";
import {
  selectAppData,
  useHMSActions,
  useHMSStore,
  useHMSVanillaStore,
} from "@100mslive/react-sdk";
import { useWidgetState } from "./useUISettings";
import { APP_DATA, WIDGET_STATE, WIDGET_VIEWS } from "../../common/constants";

/**
 * Gives a boolean value if the sidepaneType matches current sidepane value in store
 * @param {string} sidepaneType
 * @returns {boolean} - if the sidepaneType is passed returns boolean else the current value
 */
export const useIsSidepaneTypeOpen = sidepaneType => {
  if (!sidepaneType) {
    throw Error("Pass one of the side pane options");
  }
  return useHMSStore(selectAppData(APP_DATA.sidePane)) === sidepaneType;
};

/**
 * Gives the current value of sidepane in store
 * @returns {string} - if the sidepaneType is passed returns boolean else the current value
 */
export const useSidepaneState = () => {
  const sidePane = useHMSStore(selectAppData(APP_DATA.sidePane));
  return sidePane;
};

/**
 * Toggle the sidepane value between passed sidePaneType and '';
 * @param {string} sidepaneType
 */
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

export const useWidgetToggle = () => {
  const { widgetView, setWidgetState } = useWidgetState();

  const toggleWidget = useCallback(
    id => {
      id = typeof id === "string" ? id : undefined;
      let viewToShow;
      if (id) {
        viewToShow = WIDGET_VIEWS.VOTE;
      } else if (widgetView) {
        viewToShow = null;
      } else {
        viewToShow = WIDGET_VIEWS.LANDING;
      }

      setWidgetState({
        [WIDGET_STATE.pollInView]: id,
        [WIDGET_STATE.view]: viewToShow,
      });
    },
    [widgetView, setWidgetState]
  );

  return toggleWidget;
};

/**
 * reset's the sidepane value
 */
export const useSidepaneReset = () => {
  const hmsActions = useHMSActions();
  const resetSidepane = useCallback(() => {
    hmsActions.setAppData(APP_DATA.sidePane, "");
    hmsActions.setAppData(APP_DATA.widgetState, {
      [WIDGET_STATE.pollInView]: "",
      [WIDGET_STATE.view]: "",
    });
  }, [hmsActions]);
  return resetSidepane;
};
