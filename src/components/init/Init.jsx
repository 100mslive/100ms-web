import React, { useEffect } from "react";
import {
  useHMSStore,
  selectSessionId,
  selectLocalPeerID,
  selectLocalPeerName,
  selectLocalPeerRoleName,
} from "@100mslive/react-sdk";
import { useTheme } from "@100mslive/react-ui";
import { FeatureFlagsInit } from "../../services/FeatureFlags";
import { setUpLogRocket } from "./initUtils";

const Init = () => {
  const localPeerID = useHMSStore(selectLocalPeerID);
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const localPeerName = useHMSStore(selectLocalPeerName);
  const sessionId = useHMSStore(selectSessionId);
  const { toggleTheme } = useTheme();

  useEffect(() => {
    window.toggleUiTheme = toggleTheme;
  }, [toggleTheme]);

  useEffect(() => {
    function resetHeight() {
      // reset the body height to that of the inner browser
      document.body.style.height = `${window.innerHeight}px`;
    }
    // reset the height whenever the window's resized
    window.addEventListener("resize", resetHeight);
    // called to initially set the height.
    resetHeight();
    return () => {
      window.removeEventListener("resize", resetHeight);
    };
  }, []);

  useEffect(() => {
    if (localPeerID && localPeerRole && localPeerName) {
      setUpLogRocket({
        localPeer: {
          id: localPeerID,
          name: localPeerName,
          roleName: localPeerRole,
        },
        sessionId,
      });
    }
    // eslint-disable-next-line
  }, [localPeerID, localPeerName, localPeerRole, sessionId]);

  return <FeatureFlagsInit />;
};

export { Init };
