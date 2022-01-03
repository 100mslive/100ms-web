import LogRocket from "logrocket";
import { FeatureFlags } from "./FeatureFlags";

export const convertLoginInfoToJoinConfig = loginInfo => {
  const joinConfig = {
    userName: loginInfo.username,
    authToken: loginInfo.token,
    metaData: "",
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
    alwaysRequestPermissions: FeatureFlags.alwaysRequestPermissions(),
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
 * check if a role is allowed to publish either of audio or video
 */
function canPublishAV(role) {
  const params = role?.publishParams;
  if (params?.allowed) {
    return params.allowed.includes("video") || params.allowed.includes("audio");
  }
  return false;
}

/**
 * Figure out the layout for each role. There is some extra work being done
 * here currently to figure out the layout for roles other than local peer too
 * which can be avoided.
 */
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
    if (!newConfig[roleName].center) {
      const publishingRoleNames = roleNames.filter(roleName =>
        canPublishAV(rolesMap[roleName])
      );
      // all other publishing roles apart from local role in center by default
      newConfig[roleName].center = publishingRoleNames.filter(
        rName => rName !== roleName
      );
    }
    // everyone from my role is in sidepane by default if they can publish
    if (!newConfig[roleName].sidepane) {
      newConfig[roleName].sidepane = canPublishAV(rolesMap[roleName])
        ? [roleName]
        : [];
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
