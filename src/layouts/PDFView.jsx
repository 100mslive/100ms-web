import { useCallback, useEffect, useRef, useState } from "react";
import { throwErrorHandler, useScreenShare } from "@100mslive/react-sdk";
import { Box, ThemeTypes, useTheme } from "@100mslive/react-ui";
import { EmbedScreenShareView } from "./EmbedView";
import { useSetAppDataByKey } from "../components/AppData/useUISettings";
import { APP_DATA, isChrome } from "../common/constants";

/**
 * PDFView component is responsible for rendering the PDFEmbedComponent within an EmbedScreenShareView.
 * It manages the PDF configuration state and passes it to the PDFEmbedComponent as props.
 */
export const PDFView = () => {
  const [pdfConfig, setPDFConfig] = useSetAppDataByKey(APP_DATA.pdfConfig);
  return (
    <EmbedScreenShareView>
      <PDFEmbedComponent pdfConfig={pdfConfig} setPDFConfig={setPDFConfig} />
    </EmbedScreenShareView>
  );
};

/**
 * PDFEmbedComponent is responsible for rendering the PDF iframe and managing the screen sharing functionality.
 * It receives the pdfConfig and setPDFConfig as props for accessing and updating the PDF configuration state.
 */
export const PDFEmbedComponent = ({ pdfConfig, setPDFConfig }) => {
  let pdfIframeURL = process.env.REACT_APP_PDFJS_IFRAME_URL;

  const pdfIframeRef = useRef(); // Create a ref to access the iframe element
  const themeType = useTheme().themeType; // Get the current theme type from the theme context

  const [isPDFLoaded, setIsPDFLoaded] = useState(false);
  const { amIScreenSharing, toggleScreenShare } =
    useScreenShare(throwErrorHandler);
  const [wasScreenShared, setWasScreenShared] = useState(false);

  // If a PDF URL is provided instead of a file, update the PDF iFrame URL with the URL parameter
  if (pdfConfig.url && !pdfConfig.file) {
    pdfIframeURL = pdfIframeURL + "?file=" + encodeURIComponent(pdfConfig.url);
  }

  // to handle - https://github.com/facebook/react/issues/24502
  const screenShareAttemptInProgress = useRef(false);

  const resetPDFEmbedConfig = useCallback(() => {
    setPDFConfig({ isPDFBeingShared: false });
  }, [setPDFConfig]);

  const sendDataToPDFIframe = (themeType, file = null) => {
    if (pdfIframeRef.current) {
      pdfIframeRef.current.contentWindow.postMessage(
        {
          theme: themeType,
          file: file,
        },
        "*"
      );
    }
  };

  // Send theme and file information to the PDF iframe when the PDF is loaded
  useEffect(() => {
    if (isPDFLoaded && pdfIframeRef.current) {
      sendDataToPDFIframe(themeType === ThemeTypes.dark ? 2 : 1);
    }
  }, [isPDFLoaded, themeType]);

  useEffect(() => {
    // Start screen sharing when the component is mounted and not already screen sharing
    if (
      !amIScreenSharing &&
      !wasScreenShared &&
      !screenShareAttemptInProgress.current
    ) {
      screenShareAttemptInProgress.current = true;
      toggleScreenShare({
        forceCurrentTab: isChrome,
        cropElement: pdfIframeRef.current,
        preferCurrentTab: isChrome,
      })
        .then(() => {
          setWasScreenShared(true); // Set the state to indicate screen sharing has started
        })
        .catch(resetPDFEmbedConfig) // Handle the screen sharing error and reset the PDF configuration
        .finally(() => {
          screenShareAttemptInProgress.current = false;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Reset embed configuration when screen sharing is stopped from anywhere
    if (wasScreenShared && !amIScreenSharing) {
      resetPDFEmbedConfig();
    }
    return () => {
      // Stop screen sharing when the component is unmounted
      if (wasScreenShared && amIScreenSharing) {
        resetPDFEmbedConfig();
        toggleScreenShare(); // Stop screen sharing
      }
    };
  }, [
    wasScreenShared,
    amIScreenSharing,
    resetPDFEmbedConfig,
    toggleScreenShare,
  ]);

  return (
    <Box
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
        src={pdfIframeURL}
        title="PDF Annotator"
        ref={pdfIframeRef}
        style={{
          width: "100%",
          height: "100%",
          border: 0,
          borderRadius: "0.75rem",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture fullscreen"
        referrerPolicy="no-referrer"
        onLoad={() => {
          if (pdfIframeRef.current && pdfConfig.file) {
            // Set PDF theme on config change. Dark -> 2 and Light -> 1
            requestAnimationFrame(() => {
              sendDataToPDFIframe(
                themeType === ThemeTypes.dark ? 2 : 1,
                pdfConfig.file
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
