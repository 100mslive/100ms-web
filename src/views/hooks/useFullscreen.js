import { useCallback, useEffect, useState } from "react";
import screenfull from "screenfull";

export const useFullscreen = () => {
  const [isFullScreenEnabled, setIsFullScreenEnabled] = useState(
    screenfull.isFullscreen
  );

  const toggle = useCallback(() => {
    setIsFullScreenEnabled(value => !value);
  }, []);

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
