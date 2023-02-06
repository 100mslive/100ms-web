import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFullscreen, useToggle } from "react-use";
import { HlsStats } from "@100mslive/hls-stats";
import Hls from "hls.js";
import screenfull from "screenfull";
import {
  selectAppData,
  selectHLSState,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { ExpandIcon, ShrinkIcon } from "@100mslive/react-icons";
import {
  Box,
  Flex,
  IconButton,
  Text,
  Tooltip,
  useTheme,
} from "@100mslive/react-ui";
import { HlsStatsOverlay } from "../components/HlsStatsOverlay";
import { HMSVideoPlayer } from "../components/HMSVideo";
import { FullScreenButton } from "../components/HMSVideo/FullscreenButton";
import { HLSAutoplayBlockedPrompt } from "../components/HMSVideo/HLSAutoplayBlockedPrompt";
import { HLSQualitySelector } from "../components/HMSVideo/HLSQualitySelector";
import { ToastManager } from "../components/Toast/ToastManager";
import {
  HLS_STREAM_NO_LONGER_LIVE,
  HLS_TIMED_METADATA_LOADED,
  HLSController,
} from "../controllers/hls/HLSController";
import { metadataPayloadParser } from "../common/utils";
import { APP_DATA } from "../common/constants";

let hlsController;
let hlsStats;

const HLSView = () => {
  const videoRef = useRef(null);
  const hlsViewRef = useRef(null);
  const hlsState = useHMSStore(selectHLSState);
  const enablHlsStats = useHMSStore(selectAppData(APP_DATA.hlsStats));
  const hmsActions = useHMSActions();
  const { themeType } = useTheme();
  let [hlsStatsState, setHlsStatsState] = useState(null);
  const hlsUrl = hlsState.variants[0]?.url;
  const [availableLevels, setAvailableLevels] = useState([]);
  const [isVideoLive, setIsVideoLive] = useState(true);
  const [isUserSelectedAuto, setIsUserSelectedAuto] = useState(true);
  const [currentSelectedQuality, setCurrentSelectedQuality] = useState(null);
  const [isHlsAutoplayBlocked, setIsHlsAutoplayBlocked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMSENotSupported, setIsMSENotSupported] = useState(false);
  const isFullScreenSupported = screenfull.isEnabled;
  const [show, toggle] = useToggle(false);
  const isFullScreen = useFullscreen(hlsViewRef, show, {
    onClose: () => toggle(false),
  });

  const handleNoLongerLive = () => {
    setIsVideoLive(false);
  };

  useEffect(() => {
    const manifestLoadedHandler = (_, { levels }) => {
      const onlyVideoLevels = removeAudioLevels(levels);
      setAvailableLevels(onlyVideoLevels);
    };
    const levelUpdatedHandler = (_, { level }) => {
      const qualityLevel = hlsController.getHlsJsInstance().levels[level];
      setCurrentSelectedQuality(qualityLevel);
    };
    let videoEl = videoRef.current;
    const metadataLoadedHandler = ({ payload, ...rest }) => {
      // parse payload and extract start_time and payload
      const data = metadataPayloadParser(payload);
      const duration = rest.duration * 1000;
      const toast = {
        title: `Payload from timed Metadata ${data.payload}`,
        duration: duration || 3000,
      };
      console.debug("Added toast ", JSON.stringify(toast));
      ToastManager.addToast(toast);
    };
    const handleHLSError = error => {
      console.error(error);
    };
    const handleTimeUpdateListener = _ => {
      const textTrackListCount = videoEl.textTracks.length;
      let metaTextTrack;
      for (let trackIndex = 0; trackIndex < textTrackListCount; trackIndex++) {
        const textTrack = videoEl.textTracks[trackIndex];
        if (textTrack.kind !== "metadata") {
          continue;
        }
        textTrack.mode = "showing";
        metaTextTrack = textTrack;
        break;
      }
      if (!metaTextTrack) {
        return;
      }
      const cuesLength = metaTextTrack.cues.length;
      let cueIndex = 0;
      while (cueIndex < cuesLength) {
        const cue = metaTextTrack.cues[cueIndex];
        if (cue.fired) {
          cueIndex++;
          continue;
        }
        const data = metadataPayloadParser(cue.value.data);
        const programData = videoEl.getStartDate();
        const startDate = data.start_date;
        const endDate = data.end_date;
        const startTime =
          new Date(startDate) -
          new Date(programData) -
          videoEl.currentTime * 1000;
        const duration = new Date(endDate) - new Date(startDate);
        setTimeout(() => {
          const toast = {
            title: `Payload from timed Metadata ${data.payload}`,
            duration: duration,
          };
          console.debug("Added toast ", JSON.stringify(toast));
          ToastManager.addToast(toast);
        }, startTime);
        cue.fired = true;
        cueIndex++;
      }
    };
    if (!videoEl || !hlsUrl) {
      console.debug("video element or hlsurl is not defined");
      return;
    }
    if (Hls.isSupported()) {
      /**
       * initialize HLSController and add event listeners.
       */
      hlsController = new HLSController(hlsUrl, videoRef);
      hlsStats = new HlsStats(hlsController.getHlsJsInstance(), videoEl);

      hlsController.on(HLS_STREAM_NO_LONGER_LIVE, handleNoLongerLive);
      hlsController.on(HLS_TIMED_METADATA_LOADED, metadataLoadedHandler);

      hlsController.on(Hls.Events.MANIFEST_LOADED, manifestLoadedHandler);
      hlsController.on(Hls.Events.LEVEL_UPDATED, levelUpdatedHandler);
      hlsController.on(Hls.Events.ERROR, handleHLSError);
    } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
      console.log("PLAYING HLS NATIVELY");
      videoEl.src = hlsUrl;
      videoEl.addEventListener("timeupdate", handleTimeUpdateListener);
      setIsMSENotSupported(true);
    }
    return () => {
      hlsController?.off(Hls.Events.MANIFEST_LOADED, manifestLoadedHandler);
      hlsController?.off(Hls.Events.LEVEL_UPDATED, levelUpdatedHandler);
      hlsController?.off(HLS_TIMED_METADATA_LOADED, metadataLoadedHandler);
      hlsController?.off(HLS_STREAM_NO_LONGER_LIVE, handleNoLongerLive);
      hlsController?.off(Hls.Events.ERROR, handleHLSError);
      videoEl.removeEventListener("timeupdate", handleTimeUpdateListener);
      hlsController?.reset();
      hlsStats = null;
      hlsController = null;
    };
  }, [hlsUrl]);

  /**
   * initialize and subscribe to hlsState
   */
  useEffect(() => {
    if (!hlsStats) {
      return;
    }
    let unsubscribe;
    if (enablHlsStats) {
      unsubscribe = hlsStats.subscribe(state => {
        setHlsStatsState(state);
      });
    } else {
      unsubscribe?.();
    }
    return () => {
      unsubscribe?.();
    };
  }, [enablHlsStats]);

  const unblockAutoPlay = async () => {
    try {
      await videoRef.current?.play();
      console.debug("Successfully started playing the stream.");
      setIsHlsAutoplayBlocked(false);
    } catch (error) {
      console.error("Tried to unblock Autoplay failed with", error.toString());
    }
  };

  /**
   * On mount. Add listeners for Video play/pause
   */
  useEffect(() => {
    const playEventHandler = () => setIsPaused(false);
    const pauseEventHandler = () => setIsPaused(true);
    const videoEl = videoRef.current;
    /**
     * we are doing all the modifications
     * to the video element after hlsUrl is loaded,
     * this is because, <HMSVideo/> is conditionally
     * rendered based on hlsUrl, so if we try to do
     * things before that, the videoRef.current will be
     * null.
     */
    if (!hlsUrl || !videoEl) {
      return;
    }

    const playVideo = async () => {
      try {
        if (videoEl.paused) {
          await videoEl.play();
        }
      } catch (error) {
        console.debug("Browser blocked autoplay with error", error.toString());
        console.debug("asking user to play the video manually...");
        if (error.name === "NotAllowedError") {
          setIsHlsAutoplayBlocked(true);
        }
      }
    };
    playVideo();

    videoEl.addEventListener("play", playEventHandler);
    videoEl.addEventListener("pause", pauseEventHandler);
    return () => {
      videoEl.removeEventListener("play", playEventHandler);
      videoEl.removeEventListener("pause", pauseEventHandler);
    };
  }, [hlsUrl]);

  const handleQuality = useCallback(
    qualityLevel => {
      if (hlsController) {
        setIsUserSelectedAuto(
          qualityLevel.height.toString().toLowerCase() === "auto"
        );
        hlsController.setCurrentLevel(qualityLevel);
      }
    },
    [availableLevels] //eslint-disable-line
  );

  const sfnOverlayClose = () => {
    hmsActions.setAppData(APP_DATA.hlsStats, !enablHlsStats);
  };

  return (
    <Flex
      key="hls-viewer"
      id={`hls-viewer-${themeType}`}
      ref={hlsViewRef}
      css={{
        verticalAlign: "middle",
        width: "100%",
        height: "100%",
      }}
    >
      {hlsStatsState?.url && enablHlsStats ? (
        <HlsStatsOverlay
          hlsStatsState={hlsStatsState}
          onClose={sfnOverlayClose}
        />
      ) : null}
      {hlsUrl ? (
        <Flex
          id="hls-player-container"
          align="center"
          justify="center"
          css={{
            width: "100%",
            margin: "auto",
            height: "90%",
            "@md": { height: "90%" },
            "@lg": { height: "80%" },
          }}
        >
          <HLSAutoplayBlockedPrompt
            open={isHlsAutoplayBlocked}
            unblockAutoPlay={unblockAutoPlay}
          />
          <HMSVideoPlayer.Root ref={videoRef}>
            {!isMSENotSupported && (
              <HMSVideoPlayer.Progress videoRef={videoRef} />
            )}

            <HMSVideoPlayer.Controls.Root css={{ p: "$4 $8" }}>
              <HMSVideoPlayer.Controls.Left>
                <HMSVideoPlayer.PlayButton
                  onClick={() => {
                    isPaused
                      ? videoRef.current?.play()
                      : videoRef.current?.pause();
                  }}
                  isPaused={isPaused}
                />
                <HMSVideoPlayer.Duration videoRef={videoRef} />
                <HMSVideoPlayer.Volume videoRef={videoRef} />
              </HMSVideoPlayer.Controls.Left>

              <HMSVideoPlayer.Controls.Right>
                {!isMSENotSupported && hlsController ? (
                  <>
                    <IconButton
                      variant="standard"
                      css={{ px: "$2" }}
                      onClick={() => {
                        hlsController.jumpToLive();
                        setIsVideoLive(true);
                      }}
                      key="jump-to-live_btn"
                      data-testid="jump-to-live_btn"
                    >
                      <Tooltip title="Go to Live" side="top">
                        <Flex justify="center" gap={2} align="center">
                          <Box
                            css={{
                              height: "$4",
                              width: "$4",
                              background: isVideoLive ? "$error" : "$white",
                              r: "$1",
                            }}
                          />
                          <Text
                            variant={{
                              "@sm": "xs",
                            }}
                          >
                            {isVideoLive ? "LIVE" : "GO LIVE"}
                          </Text>
                        </Flex>
                      </Tooltip>
                    </IconButton>
                    <HLSQualitySelector
                      levels={availableLevels}
                      selection={currentSelectedQuality}
                      onQualityChange={handleQuality}
                      isAuto={isUserSelectedAuto}
                    />
                  </>
                ) : null}
                {isFullScreenSupported ? (
                  <FullScreenButton
                    onToggle={toggle}
                    icon={isFullScreen ? <ShrinkIcon /> : <ExpandIcon />}
                  />
                ) : null}
              </HMSVideoPlayer.Controls.Right>
            </HMSVideoPlayer.Controls.Root>
          </HMSVideoPlayer.Root>
        </Flex>
      ) : (
        <Flex align="center" justify="center" css={{ size: "100%", px: "$10" }}>
          <Text variant="md" css={{ textAlign: "center" }}>
            Waiting for the stream to start...
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

/**
 *
 * This function is needed because HLSJS currently doesn't
 * support switching to audio rendition from a video rendition.
 * more on this here
 * https://github.com/video-dev/hls.js/issues/4881
 * https://github.com/video-dev/hls.js/issues/3480#issuecomment-778799541
 * https://github.com/video-dev/hls.js/issues/163#issuecomment-169773788
 *
 * @param {Array} levels array from hlsJS
 * @returns a new array with only video levels.
 */
function removeAudioLevels(levels) {
  return levels.filter(
    ({ videoCodec, width, height }) => !!videoCodec || !!(width && height)
  );
}

export default HLSView;
