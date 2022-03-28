import {
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  parsedUserAgent,
  useHMSVanillaStore,
  useHMSActions,
} from "@100mslive/react-sdk";
import { useEffect } from "react";

let isEvenListenersAttached = false;
let isMacOS = parsedUserAgent.getOS().name.toLowerCase() === "mac os";
export class KeyboardInputManager {
  #actions;
  #store;
  constructor(store, actions) {
    this.#actions = actions;
    this.#store = store;
  }
  async #toggleAudio() {
    const enabled = this.#store.getState(selectIsLocalAudioEnabled);
    await this.#actions.setLocalAudioEnabled(!enabled);
  }

  async #toggleVideo() {
    const enabled = this.#store.getState(selectIsLocalVideoEnabled);
    await this.#actions.setLocalVideoEnabled(!enabled);
  }

  #keyDownHandler = async e => {
    const CONTROL_KEY = isMacOS ? e.metaKey : e.ctrlKey;
    const D_KEY = e.key === "d" || e.key === "D";
    const E_KEY = e.key === "e" || e.key === "E";

    const SHORTCUT_TOGGLE_AUDIO = CONTROL_KEY && D_KEY;
    const SHORTCUT_TOGGLE_VIDEO = CONTROL_KEY && E_KEY;

    if (SHORTCUT_TOGGLE_AUDIO) {
      e.preventDefault();
      await this.#toggleAudio();
    } else if (SHORTCUT_TOGGLE_VIDEO) {
      e.preventDefault();
      await this.#toggleVideo();
    }
  };

  #bind() {
    document.addEventListener("keydown", this.#keyDownHandler, false);
  }

  #unbind() {
    document.removeEventListener("keydown", this.#keyDownHandler, false);
  }

  bindAllShortcuts() {
    if (!isEvenListenersAttached) {
      this.#bind();
      isEvenListenersAttached = true;
    }
  }

  unbindAllShortcuts() {
    if (isEvenListenersAttached) {
      this.#unbind();
      isEvenListenersAttached = false;
    }
  }
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
