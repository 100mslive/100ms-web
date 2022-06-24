import {
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
} from "@100mslive/react-sdk";

/**
 * Media Session API allows for handling control actions on top of pip
 * https://web.dev/media-session/#video-conferencing-actions
 */
class SetupMediaSession {
  setup = (actions, store) => {
    this.actions = actions;
    this.store = store;
    this.initState();
    this.setUpHandlers();
  };

  initState = () => {
    const isMicActive = this.store.getState(selectIsLocalAudioEnabled);
    const isCamActive = this.store.getState(selectIsLocalVideoEnabled);
    navigator.mediaSession?.setMicrophoneActive?.(isMicActive);
    navigator.mediaSession?.setCameraActive?.(isCamActive);

    this.store.subscribe(isMicActive => {
      navigator.mediaSession?.setMicrophoneActive?.(isMicActive);
    }, selectIsLocalAudioEnabled);

    this.store.subscribe(isCamActive => {
      navigator.mediaSession?.setCameraActive?.(isCamActive);
    }, selectIsLocalVideoEnabled);
  };

  toggleMic = async () => {
    console.log("toggle mic clicked in pip");
    const current = this.store.getState(selectIsLocalAudioEnabled);
    await this.actions.setLocalAudioEnabled(!current);
  };

  toggleCam = async () => {
    console.log("toggle cam clicked in pip");
    const current = this.store.getState(selectIsLocalVideoEnabled);
    await this.actions.setLocalVideoEnabled(!current);
  };

  leave = () => {
    console.log("leave called from pip");
    this.actions.leave();
  };

  setUpHandlers = () => {
    if (navigator.mediaSession) {
      try {
        navigator.mediaSession.setActionHandler(
          "togglemicrophone",
          this.toggleMic
        );
        navigator.mediaSession.setActionHandler("togglecamera", this.toggleCam);
        navigator.mediaSession.setActionHandler("hangup", this.leave);
      } catch (err) {
        console.error("error in setting media session handlers", err);
      }
    }
  };
}

export const MediaSession = new SetupMediaSession();
