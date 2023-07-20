import React, { useEffect } from "react";
import {
  selectLocalPeerID,
  selectLocalPeerName,
  selectLocalPeerRoleName,
  selectSessionId,
  useHMSStore,
} from "@100mslive/react-sdk";
import { useTheme } from "@100mslive/roomkit-react";
import { setUpZipy } from "./initUtils";
import { FeatureFlagsInit } from "../../services/FeatureFlags";

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
      // The window.innerHeight property returns integer values. When the actual height is in decimal, window.innerHeight returns a larger value than the actual value. This can cause a scrollbar to appear on some screens.
      // Hence using window.visualViewport.height which returns a decimal value.
      document.body.style.height = `${
        window.visualViewport?.height || window.innerHeight
      }px`;
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
      const peerData = {
        localPeer: {
          id: localPeerID,
          name: localPeerName,
          roleName: localPeerRole,
        },
        sessionId,
      };
      setUpZipy(peerData);
    }
    // eslint-disable-next-line
  }, [localPeerID, localPeerName, localPeerRole, sessionId]);

  return <FeatureFlagsInit />;
};

export { Init };
