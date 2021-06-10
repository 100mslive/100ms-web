import LogRocket from "logrocket";

export const convertLoginInfoToJoinConfig = loginInfo => {
  const joinConfig = {
    userName: loginInfo.username,
    authToken: loginInfo.token,
    metaData: loginInfo.role,
    initEndpoint: loginInfo.env
      ? `https://${loginInfo.env.split("-")[0]}-init.100ms.live/init`
      : "https://prod-init.100ms.live/init",
    settings: {
      isAudioMuted: loginInfo.audioMuted,
      isVideoMuted: loginInfo.videoMuted,
      audioInputDeviceId: loginInfo.selectedAudioInput,
      audioOutputDeviceId: loginInfo.selectedAudioOutput,
      videoDeviceId: loginInfo.selectedVideoInput,
    },
  };
  console.debug("app: Config is", joinConfig);
  return joinConfig;
};

export const setUpLogRocket = (loginInfo, localPeer) => {
  LogRocket.identify(localPeer.id, {
    name: loginInfo.username,
    role: loginInfo.role,
    token: loginInfo.token,
  });
};
