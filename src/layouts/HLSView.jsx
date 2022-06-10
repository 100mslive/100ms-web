import React, {
  useEffect,
  useRef,
  Fragment,
  useState,
  useCallback,
} from "react";
import Hls from "hls.js";
import { useHMSStore, selectHLSState } from "@100mslive/react-sdk";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SettingIcon,
} from "@100mslive/react-icons";
import {
  Box,
  Dropdown,
  Flex,
  styled,
  Text,
  Tooltip,
} from "@100mslive/react-ui";
import { ChatView } from "../components/chatView";
import { FeatureFlags } from "../services/FeatureFlags";
import { useIsChatOpen } from "../components/AppData/useChatState";

const HLSVideo = styled("video", {
  h: "100%",
  margin: "0 auto",
});

let hls = null;
const HLSView = () => {
  const videoRef = useRef(null);
  const hlsState = useHMSStore(selectHLSState);
  const isChatOpen = useIsChatOpen();
  const hlsUrl = hlsState.variants[0]?.url;
  const [availableLevels, setAvailableLevels] = useState([]);
  const [currentSelectedQualityText, setCurrentSelectedQualityText] =
    useState("");
  const [qualityDropDownOpen, setQualityDropDownOpen] = useState(false);

  useEffect(() => {
    if (videoRef.current && hlsUrl && !hls) {
      if (Hls.isSupported()) {
        hls = new Hls(getHLSConfig());
        hls.loadSource(hlsUrl);
        hls.attachMedia(videoRef.current);

        hls.once(Hls.Events.MANIFEST_LOADED, (event, data) => {
          setAvailableLevels(data.levels);
          setCurrentSelectedQualityText("Auto");
        });
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = hlsUrl;
      }
    }
  }, [hlsUrl]);

  useEffect(() => {
    return () => {
      if (hls && hls.media) {
        hls.detachMedia();
        hls = null;
      }
    };
  }, []);

  const qualitySelectorHandler = useCallback(
    qualityLevel => {
      if (hls) {
        hls.currentLevel = getCurrentLevel(qualityLevel);
        const levelText =
          qualityLevel.height === "auto" ? "Auto" : `${qualityLevel.height}p`;
        setCurrentSelectedQualityText(levelText);
      }
    },
    [availableLevels] //eslint-disable-line
  );

  /**
   *
   * @param {the current quality level clicked by the user. It is the level object } qualityLevel
   * @returns an integer ranging from 0 to (availableLevels.length - 1).
   * (e.g) if 4 levels are available, 0 is the lowest quality and 3 is the highest.
   *
   * This function is used rather than just using availableLevels.findIndex(quality) because, HLS gives the
   * levels in reverse.
   * (e.g) if available levels in the m3u8 are 360p,480p,720p,1080p,
   *
   * hls.levels gives us an array of level objects in the order [1080p,720p,480p,360p];
   *
   * so setting hls.currentLevel = availableLevels.getIndexOf(1080p) will set the stream to 360p instead of 1080p
   * because availableLevels.getIndexOf(1080p) will give 0 but level 0 is 360p.
   */
  const getCurrentLevel = qualityLevel => {
    if (qualityLevel.height === "auto") {
      return -1;
    }
    const index = availableLevels.findIndex(
      ({ url }) => url === qualityLevel.url
    );

    return availableLevels.length - 1 - index;
  };

  return (
    <Fragment>
      {hlsUrl ? (
        <>
          <Flex align="center" css={{ position: "absolute", right: "$4" }}>
            <Dropdown.Root
              open={qualityDropDownOpen}
              onOpenChange={value => setQualityDropDownOpen(value)}
            >
              <Dropdown.Trigger asChild data-testid="quality_selector">
                <Flex
                  css={{
                    color: "$textPrimary",
                    borderRadius: "$1",
                    cursor: "pointer",
                    zIndex: 40,
                    border: "1px solid $textDisabled",
                    padding: "$2 $4",
                  }}
                >
                  <Tooltip title="Select Quality">
                    <Flex>
                      <SettingIcon />
                      <Text variant="md">{currentSelectedQualityText}</Text>
                    </Flex>
                  </Tooltip>

                  <Box
                    css={{ "@lg": { display: "none" }, color: "$textDisabled" }}
                  >
                    {qualityDropDownOpen ? (
                      <ChevronUpIcon />
                    ) : (
                      <ChevronDownIcon />
                    )}
                  </Box>
                </Flex>
              </Dropdown.Trigger>
              {availableLevels.length > 0 && (
                <Dropdown.Content
                  sideOffset={5}
                  align="end"
                  css={{ height: "auto", maxHeight: "$96" }}
                >
                  <Dropdown.Item
                    onClick={event =>
                      qualitySelectorHandler({ height: "auto" })
                    }
                    css={{
                      h: "auto",
                      flexDirection: "column",
                      flexWrap: "wrap",
                      cursor: "pointer",
                      alignItems: "flex-start",
                    }}
                    key="auto"
                  >
                    <Text>Automatic</Text>
                  </Dropdown.Item>
                  {availableLevels.map(level => {
                    return (
                      <Dropdown.Item
                        onClick={() => qualitySelectorHandler(level)}
                        css={{
                          h: "auto",
                          flexDirection: "column",
                          flexWrap: "wrap",
                          cursor: "pointer",
                          alignItems: "flex-start",
                        }}
                        key={level.url}
                      >
                        <Text>{`${level.height}p (${(
                          Number(level.bitrate / 1024) / 1024
                        ).toFixed(2)} Mbps)`}</Text>
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Content>
              )}
            </Dropdown.Root>
          </Flex>

          <HLSVideo ref={videoRef} autoPlay controls playsInline />
        </>
      ) : (
        <Flex align="center" justify="center" css={{ size: "100%" }}>
          <Text variant="md" css={{ textAlign: "center" }}>
            Waiting for the Streaming to start...
          </Text>
        </Flex>
      )}
      {isChatOpen && (
        <Box
          css={{
            height: "50%",
            position: "absolute",
            zIndex: 40,
            bottom: "$20",
            right: 0,
            width: "20%",
            "@sm": {
              width: "75%",
            },
          }}
        >
          <ChatView />
        </Box>
      )}
    </Fragment>
  );
};

function getHLSConfig() {
  if (FeatureFlags.optimiseHLSLatency()) {
    // should reduce the latency by around 2-3 more seconds. Won't work well without good internet.
    return {
      enableWorker: true,
      liveSyncDuration: 1,
      liveMaxLatencyDuration: 5,
      liveDurationInfinity: true,
      highBufferWatchdogPeriod: 1,
    };
  }
  return {};
}

export default HLSView;
