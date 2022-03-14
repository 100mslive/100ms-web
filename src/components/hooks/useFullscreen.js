import { useCallback, useEffect, useState } from "react";
import screenfull from "screenfull";
import { ToastManager } from "../Toast/ToastManager";

export const useFullscreen = () => {
  const [isFullScreenEnabled, setIsFullScreenEnabled] = useState(
    screenfull.isFullscreen
  );

  const toggle = useCallback(async () => {
    if (!screenfull.isEnabled) {
      ToastManager.addToast({ title: "Fullscreen feature not supported" });
      return;
    }
    try {
      if (isFullScreenEnabled) {
        await screenfull.exit();
      } else {
        await screenfull.request();
      }
    } catch (err) {
      ToastManager.addToast({ title: err.message });
    }
  }, [isFullScreenEnabled]);

  useEffect(() => {
    const onChange = () => {
      setIsFullScreenEnabled(screenfull.isFullscreen);
    };
    if (screenfull.isEnabled) {
      screenfull.on("change", onChange);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", onChange);
      }
    };
  }, []);

  return {
    allowed: screenfull.isEnabled,
    isFullscreen: isFullScreenEnabled,
    toggleFullscreen: toggle,
  };
};
