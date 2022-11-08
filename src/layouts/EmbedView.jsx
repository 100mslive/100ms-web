import { useCallback, useEffect, useRef, useState } from "react";
import {
  selectPeers,
  throwErrorHandler,
  useHMSStore,
  useScreenShare,
} from "@100mslive/react-sdk";
import { Box, Flex } from "@100mslive/react-ui";
import { GridSidePaneView } from "../components/gridView";
import { useSetAppDataByKey } from "../components/AppData/useUISettings";
import { APP_DATA } from "../common/constants";

export const EmbedView = ({ showStats }) => {
  const peers = useHMSStore(selectPeers);

  return (
    <Flex css={{ size: "100%", "@lg": { flexDirection: "column" } }}>
      <EmbedComponent />
      <GridSidePaneView peers={peers} showStatsOnTiles={showStats} />
    </Flex>
  );
};

const EmbedComponent = () => {
  const { amIScreenSharing, toggleScreenShare } =
    useScreenShare(throwErrorHandler);
  const [embedConfig, setEmbedConfig] = useSetAppDataByKey(
    APP_DATA.embedConfig
  );
  const [wasScreenShared, setWasScreenShared] = useState(false);
  const screenShareAttemptInProgress = useRef(false);
  const src = embedConfig.url;
  const iframeRef = useRef();
  console.log("embed component render - ", embedConfig);

  const resetEmbedConfig = useCallback(() => {
    if (src) {
      console.log("resetting embed config");
      setEmbedConfig({ url: "" });
    }
  }, [src, setEmbedConfig]);

  useEffect(() => {
    console.log("starting screenshare", {
      amIScreenSharing,
      wasScreenShared,
      embedConfig,
      screenShareAttemptInProgress,
    });
    if (
      embedConfig.shareScreen &&
      !amIScreenSharing &&
      !wasScreenShared &&
      !screenShareAttemptInProgress.current
    ) {
      screenShareAttemptInProgress.current = true;
      // start screenshare on load for others in the room to see
      toggleScreenShare({
        forceCurrentTab: true,
        cropElement: iframeRef.current,
      })
        .then(() => {
          setWasScreenShared(true);
        })
        .catch(resetEmbedConfig)
        .finally(() => {
          screenShareAttemptInProgress.current = false;
        });
    }
    return () => {
      console.log("embed cleanup running", {
        amIScreenSharing,
        wasScreenShared,
      });
      if (wasScreenShared && amIScreenSharing) {
        toggleScreenShare(); // stop
        resetEmbedConfig();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // close embed when screenshare is closed
  useEffect(() => {
    if (wasScreenShared && !amIScreenSharing) {
      resetEmbedConfig();
    }
  }, [wasScreenShared, amIScreenSharing, resetEmbedConfig]);

  return (
    <Box
      ref={iframeRef}
      css={{
        mx: "$8",
        flex: "3 1 0",
        "@lg": {
          flex: "2 1 0",
          display: "flex",
          alignItems: "center",
        },
      }}
    >
      <iframe
        src={src}
        title={src}
        style={{ width: "100%", height: "100%", border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture fullscreen"
        referrerPolicy="no-referrer"
      />
    </Box>
  );
};

export default EmbedView;
