import LogRocket from "logrocket";

export const convertLoginInfoToJoinConfig = loginInfo => {
  let initEndpoint = process.env.REACT_APP_INIT_ENDPOINT;
  if (!initEndpoint) {
    initEndpoint = loginInfo.env
      ? `https://${loginInfo.env.split("-")[0]}-init.100ms.live/init`
      : "https://prod-init.100ms.live/init";
  }
  const joinConfig = {
    userName: loginInfo.username,
    authToken: loginInfo.token,
    metaData: loginInfo.role,
    initEndpoint,
    settings: {
      isAudioMuted: loginInfo.audioMuted,
      isVideoMuted: loginInfo.videoMuted,
      audioInputDeviceId: loginInfo.selectedAudioInput,
      audioOutputDeviceId: loginInfo.selectedAudioOutput,
      videoDeviceId: loginInfo.selectedVideoInput,
    },
    rememberDeviceSelection: true,
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
