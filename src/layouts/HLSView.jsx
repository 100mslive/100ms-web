import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFullscreen, useToggle } from "react-use";
import { HlsStats } from "@100mslive/hls-stats";
import Hls from "hls.js";
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
import { HLSQualitySelector } from "../components/HMSVideo/HLSQualitySelector";
import { ToastManager } from "../components/Toast/ToastManager";
import {
  HLS_STREAM_NO_LONGER_LIVE,
  HLS_TIMED_METADATA_LOADED,
  HLSController,
} from "../controllers/hls/HLSController";
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
  const [currentSelectedQuality, setisCurrentSelectedQuality] = useState(null);

  const [currentSelectedQualityText, setCurrentSelectedQualityText] =
    useState("");

  const [isPaused, setIsPaused] = useState(false);

  const [show, toggle] = useToggle(false);
  const isFullScreen = useFullscreen(hlsViewRef, show, {
    onClose: () => toggle(false),
  });

  /**
   * initialize HLSController and add event listeners.
   */
  useEffect(() => {
    let videoEl = videoRef.current;
    const manifestLoadedHandler = (_, { levels }) => {
      const onlyVideoLevels = removeAudioLevels(levels);
      setAvailableLevels(onlyVideoLevels);
      setCurrentSelectedQualityText("Auto");
    };
    const levelUpdatedHandler = (_, { details, level }) => {
      const qualityLevel = hlsController.getHlsJsInstance().levels[level];
      setisCurrentSelectedQuality(qualityLevel);
    };

    if (videoEl && hlsUrl) {
      if (Hls.isSupported()) {
        hlsController = new HLSController(hlsUrl, videoRef);
        hlsStats = new HlsStats(hlsController.getHlsJsInstance(), videoEl);
        const metadataLoadedHandler = ({ payload, ...rest }) => {
          console.log(
            `%c Payload: ${payload}`,
            "color:#2b2d42; background:#d80032"
          );
          console.log(rest);
          ToastManager.addToast({
            title: `Payload from timed Metadata ${payload}`,
          });
        };
        hlsController.on(HLS_STREAM_NO_LONGER_LIVE, () => {
          setIsVideoLive(false);
        });
        hlsController.on(HLS_TIMED_METADATA_LOADED, metadataLoadedHandler);

        hlsController.on(Hls.Events.MANIFEST_LOADED, manifestLoadedHandler);
        hlsController.on(Hls.Events.LEVEL_UPDATED, levelUpdatedHandler);
      } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
        videoEl.src = hlsUrl;
      }
    }
    return () => {
      hlsStats = null;
      hlsController?.off(Hls.Events.MANIFEST_LOADED, manifestLoadedHandler);
      hlsController?.off(Hls.Events.LEVEL_UPDATED, levelUpdatedHandler);
    };
  }, [hlsUrl]);

  /**
   * update quality level text whenever a level is changed
   */
  useEffect(() => {
    if (currentSelectedQuality) {
      const levelText = isUserSelectedAuto
        ? `Auto(${currentSelectedQuality.height}p)`
        : `${currentSelectedQuality.height}p`;
      setCurrentSelectedQualityText(levelText);
    }
  }, [currentSelectedQuality]);

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

  /**
   * On mount. Add listeners for Video play/pause
   */
  useEffect(() => {
    videoRef.current?.addEventListener("play", event => {
      setIsPaused(false);
    });
    videoRef.current?.addEventListener("pause", event => {
      setIsPaused(true);
    });
    return () => hlsController?.reset();
  }, []);

  const qualitySelectorHandler = useCallback(
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
          <HMSVideoPlayer.Root ref={videoRef}>
            <HMSVideoPlayer.Progress videoRef={videoRef} />
            <HMSVideoPlayer.Controls.Root
              css={{ paddingLeft: "$8", paddingRight: "$8" }}
            >
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
                {hlsController ? (
                  <IconButton
                    variant="standard"
                    onClick={() => {
                      hlsController.jumpToLive();
                      setIsVideoLive(true);
                    }}
                    key="jump-to-live_btn"
                    data-testid="jump-to-live_btn"
                  >
                    <Tooltip title="Go to Live">
                      <Flex justify="center" gap={2} align="center">
                        <Box
                          css={{
                            height: "$4",
                            width: "$4",
                            background: isVideoLive ? "$error" : "$white",
                            borderRadius: "50%",
                          }}
                        />
                        <Text
                          variant={{
                            "@sm": "xs",
                          }}
                        >
                          {isVideoLive ? "Live" : "Go to Live"}{" "}
                        </Text>
                      </Flex>
                    </Tooltip>
                  </IconButton>
                ) : null}
                <HLSQualitySelector
                  availableLevels={availableLevels}
                  currentSelectedQualityText={currentSelectedQualityText}
                  qualitySelectorHandler={qualitySelectorHandler}
                />
                <FullScreenButton
                  onToggle={toggle}
                  icon={isFullScreen ? <ShrinkIcon /> : <ExpandIcon />}
                />
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
