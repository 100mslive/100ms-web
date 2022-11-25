import { useEffect } from "react";
import {
  parsedUserAgent,
  selectAppData,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  useHMSActions,
  useHMSVanillaStore,
} from "@100mslive/react-sdk";
import { APP_DATA } from "../../common/constants";

let isEvenListenersAttached = false;
let isMacOS = parsedUserAgent.getOS().name.toLowerCase() === "mac os";
export class KeyboardInputManager {
  #actions;
  #store;
  constructor(store, actions) {
    this.#actions = actions;
    this.#store = store;
  }
  #toggleAudio = async () => {
    const enabled = this.#store.getState(selectIsLocalAudioEnabled);
    await this.#actions.setLocalAudioEnabled(!enabled);
  };

  #toggleVideo = async () => {
    const enabled = this.#store.getState(selectIsLocalVideoEnabled);
    await this.#actions.setLocalVideoEnabled(!enabled);
  };

  #hideSidepane = () => {
    if (this.#store.getState(selectAppData(APP_DATA.sidePane))) {
      this.#actions.setAppData(APP_DATA.sidePane, "");
    }
  };

  #toggleHlsStats = () => {
    this.#actions.setAppData(
      APP_DATA.hlsStats,
      !this.#store.getState(selectAppData(APP_DATA.hlsStats))
    );
  };

  #keyDownHandler = async e => {
    const CONTROL_KEY = isMacOS ? e.metaKey : e.ctrlKey;
    const D_KEY = e.key === "d" || e.key === "D";
    const E_KEY = e.key === "e" || e.key === "E";
    const SNF_KEY = e.key === "]" || e.key === "}";

    const SHORTCUT_TOGGLE_AUDIO = CONTROL_KEY && D_KEY;
    const SHORTCUT_TOGGLE_VIDEO = CONTROL_KEY && E_KEY;
    const SHORTCUT_SIDEPANE_CLOSE = e.key === "Escape";
    const SHORTCUT_STATS_FOR_NERDS = CONTROL_KEY && SNF_KEY;

    if (SHORTCUT_TOGGLE_AUDIO) {
      e.preventDefault();
      await this.#toggleAudio();
    } else if (SHORTCUT_TOGGLE_VIDEO) {
      e.preventDefault();
      await this.#toggleVideo();
    } else if (SHORTCUT_SIDEPANE_CLOSE) {
      this.#hideSidepane();
    } else if (SHORTCUT_STATS_FOR_NERDS) {
      this.#toggleHlsStats();
    }
  };

  #bind = () => {
    document.addEventListener("keydown", this.#keyDownHandler, false);
  };

  #unbind = () => {
    document.removeEventListener("keydown", this.#keyDownHandler, false);
  };

  bindAllShortcuts = () => {
    if (!isEvenListenersAttached) {
      this.#bind();
      isEvenListenersAttached = true;
    }
  };

  unbindAllShortcuts = () => {
    if (isEvenListenersAttached) {
      this.#unbind();
      isEvenListenersAttached = false;
    }
  };
}

export const KeyboardHandler = () => {
  const store = useHMSVanillaStore();
  const actions = useHMSActions();

  useEffect(() => {
    const keyboardManager = new KeyboardInputManager(store, actions);
    keyboardManager.bindAllShortcuts();
    return keyboardManager.unbindAllShortcuts;
  }, [actions, store]);
  return null;
};
