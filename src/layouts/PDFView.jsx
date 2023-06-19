import { useCallback, useEffect, useRef, useState } from "react";
import {
  selectPeers,
  throwErrorHandler,
  useHMSStore,
  useScreenShare,
} from "@100mslive/react-sdk";
import { Box, Flex, ThemeTypes, useTheme } from "@100mslive/react-ui";
import { GridSidePaneView } from "../components/gridView";
import { useSetAppDataByKey } from "../components/AppData/useUISettings";
import { APP_DATA, isChrome } from "../common/constants";

export const PDFView = ({ showStats }) => {
  const peers = useHMSStore(selectPeers);

  return (
    <Flex css={{ size: "100%", "@lg": { flexDirection: "column" } }}>
      <PDFEmbedComponent />
      <GridSidePaneView peers={peers} showStatsOnTiles={showStats} />
    </Flex>
  );
};

const PDFEmbedComponent = () => {
  const ref = useRef();
  const themeType = useTheme().themeType;
  const [isPDFLoaded, setIsPDFLoaded] = useState(false);
  let pdfJSURL = process.env.REACT_APP_PDFJS_IFRAME_URL;
  const { amIScreenSharing, toggleScreenShare } =
    useScreenShare(throwErrorHandler);
  const [pdfConfig, setPDFConfig] = useSetAppDataByKey(APP_DATA.pdfConfig);
  if (pdfConfig.url && !pdfConfig.file) {
    pdfJSURL = pdfJSURL + "?file=" + encodeURIComponent(pdfConfig.url);
  }
  const [wasScreenShared, setWasScreenShared] = useState(false);
  // to handle - https://github.com/facebook/react/issues/24502
  const screenShareAttemptInProgress = useRef(false);
  const iframeRef = useRef();

  const resetEmbedConfig = useCallback(() => {
    setPDFConfig({ state: false });
  }, [setPDFConfig]);
  useEffect(() => {
    if (isPDFLoaded && ref.current) {
      ref.current.contentWindow.postMessage(
        {
          theme: themeType === ThemeTypes.dark ? 2 : 1,
        },
        "*"
      );
    }
  }, [isPDFLoaded, themeType]);
  useEffect(() => {
    if (
      !amIScreenSharing &&
      !wasScreenShared &&
      !screenShareAttemptInProgress.current
    ) {
      screenShareAttemptInProgress.current = true;
      // start screenshare on load for others in the room to see
      toggleScreenShare({
        forceCurrentTab: isChrome,
        cropElement: iframeRef.current,
        preferCurrentTab: isChrome,
      })
        .then(() => {
          setWasScreenShared(true);
        })
        .catch(resetEmbedConfig)
        .finally(() => {
          screenShareAttemptInProgress.current = false;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // reset embed when screenshare is closed from anywhere
    if (wasScreenShared && !amIScreenSharing) {
      resetEmbedConfig();
    }
    return () => {
      // close screenshare when this component is being unmounted
      if (wasScreenShared && amIScreenSharing) {
        resetEmbedConfig();
        toggleScreenShare(); // stop
      }
    };
  }, [wasScreenShared, amIScreenSharing, resetEmbedConfig, toggleScreenShare]);

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
        src={pdfJSURL}
        title="PDF Annotator"
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
          border: 0,
          borderRadius: "0.75rem",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture fullscreen"
        referrerPolicy="no-referrer"
        onLoad={() => {
          if (ref.current && pdfConfig.file) {
            // setting theme dark -> 2 and light -> 1
            requestAnimationFrame(() => {
              ref.current.contentWindow.postMessage(
                {
                  file: pdfConfig.file,
                  theme: themeType === ThemeTypes.dark ? 2 : 1,
                },
                "*"
              );
              setIsPDFLoaded(true);
            }, 1000);
          }
        }}
      />
    </Box>
  );
};

export default PDFView;
