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

// interface RoleConfig {
//   center?: HMSRoleName[];
//   sidepane?: HMSRoleName[];
//   selfRoleChangeTo?: HMSRoleName[];
//   remoteRoleChangeFor?: HMSRoleName[];
// }

// interface PolicyConfig {
//   [role: string]: RoleConfig;
// }

export const normalizeAppPolicyConfig = (roleNames, appPolicyConfig = {}) => {
  const newConfig = Object.assign({}, appPolicyConfig);
  roleNames.forEach(roleName => {
    if (!newConfig[roleName]) {
      newConfig[roleName] = {};
    }
    if (!newConfig[roleName].center) {
      newConfig[roleName].center = roleNames.filter(
        rName => rName !== roleName
      );
    }
    if (!newConfig[roleName].sidepane) {
      newConfig[roleName].sidepane = [roleName];
    }
    if (!newConfig[roleName].selfRoleChangeTo) {
      newConfig[roleName].selfRoleChangeTo = roleNames;
    }
    if (!newConfig[roleName].remoteRoleChangeFor) {
      newConfig[roleName].remoteRoleChangeFor = roleNames;
    }
  });

  return newConfig;
};
