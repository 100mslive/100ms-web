import { useEffect } from "react";
import { selectAppData, useHMSStore, usePDFShare } from "@100mslive/react-sdk";
import { ToastManager } from "../components/Toast/ToastManager";
import { EmbedScreenShareView } from "./EmbedView";
import { useResetPDFConfig } from "../components/AppData/useUISettings";
import { APP_DATA } from "../common/constants";

/**
 * PDFView is responsible for rendering the PDF iframe and managing the screen sharing functionality.
 */
export const PDFView = () => {
  const pdfConfig = useHMSStore(selectAppData(APP_DATA.pdfConfig));
  const resetConfig = useResetPDFConfig();

  // need to send resetConfig to clear configuration, if stop screenshare occurs.
  const { iframeRef, startPDFShare, isPDFShareInProgress } =
    usePDFShare(resetConfig);

  useEffect(() => {
    (async () => {
      try {
        if (!isPDFShareInProgress && pdfConfig) {
          await startPDFShare(pdfConfig);
        }
      } catch (err) {
        resetConfig();
        ToastManager.addToast({
          title: `Error while sharing annotator ${err.message || ""}`,
          variant: "error",
        });
      }
    })();
  }, [isPDFShareInProgress, pdfConfig, resetConfig, startPDFShare]);
  return <EmbedScreenShareView ref={iframeRef} />;
};

export default PDFView;
