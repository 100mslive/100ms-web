import {
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
} from "@100mslive/react-sdk";

let isEvenListenersAttached = false;
/**
 * 'navigator.useAgentData.platform' is the recommended way to
 * 'platform sniff'. Although, it's still not implemented in
 * Firefox and Safari. So when not available, the deprecated
 * 'navigator.platform' is used for backward compatibility.
 */
let isMacOS = /mac/i.test(
  navigator.userAgentData
    ? navigator.userAgentData.platform
    : navigator.platform
);

export class KeyboardInputManager {
  #actions;
  #store;
  constructor(hmsReactiveStore) {
    this.#actions = hmsReactiveStore.getActions();
    this.#store = hmsReactiveStore.getStore();
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
