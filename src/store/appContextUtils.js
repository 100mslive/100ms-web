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

/**
 * check if a role is allowed to publish audio/video
 */
function canPublishAV(role) {
  const params = role?.publishParams;
  if (params?.allowed) {
    return params.allowed.includes("video") || params.allowed.includes("audio");
  }
  return false;
}

export const normalizeAppPolicyConfig = (
  roleNames,
  rolesMap,
  appPolicyConfig = {}
) => {
  const newConfig = Object.assign({}, appPolicyConfig);
  roleNames.forEach(roleName => {
    if (!newConfig[roleName]) {
      newConfig[roleName] = {};
    }
    // all other roles apart from in center by default
    if (!newConfig[roleName].center) {
      const publishingRoleNames = roleNames.filter(roleName =>
        canPublishAV(rolesMap[roleName])
      );
      newConfig[roleName].center = publishingRoleNames.filter(
        rName => rName !== roleName
      );
    }
    // everyone from my role is in sidepane by default if they can publish
    if (!newConfig[roleName].sidepane && canPublishAV(rolesMap[roleName])) {
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
