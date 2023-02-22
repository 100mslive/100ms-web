import { identify } from "zipyai";

const zipyKey = process.env.REACT_APP_ZIPY_KEY;
export const setUpZipy = ({ localPeer, roomId, sessionId }) => {
  if (!zipyKey) {
    return;
  }

  let domain;
  if (typeof window !== "undefined") {
    domain = window.location.hostname;
  }

  identify(localPeer.id, {
    firstName: localPeer.name,
    customerName: domain,
    email: domain,
    role: localPeer.roleName,
    sessionId,
    roomId,
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
    const subscribedRoles =
      rolesMap[roleName].subscribeParams?.subscribeToRoles || [];

    const isNotSubscribingOrSubscribingToSelf =
      subscribedRoles.length === 0 ||
      (subscribedRoles.length === 1 && subscribedRoles[0] === roleName);
    if (!newConfig[roleName].center) {
      const publishingRoleNames = roleNames.filter(
        roleName =>
          canPublishAV(rolesMap[roleName]) && subscribedRoles.includes(roleName)
      );
      if (isNotSubscribingOrSubscribingToSelf) {
        newConfig[roleName].center = [roleName];
      } else {
        // all other publishing roles apart from local role in center by default
        newConfig[roleName].center = publishingRoleNames.filter(
          rName => rName !== roleName
        );
      }
    }
    // everyone from my role is in sidepane by default if they can publish
    if (!newConfig[roleName].sidepane) {
      if (isNotSubscribingOrSubscribingToSelf) {
        newConfig[roleName].sidepane = [];
      } else {
        newConfig[roleName].sidepane = canPublishAV(rolesMap[roleName])
          ? [roleName]
          : [];
      }
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
