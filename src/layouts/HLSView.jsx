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
  SettingsIcon,
  RecordIcon,
} from "@100mslive/react-icons";
import {
  Box,
  Button,
  Dropdown,
  Flex,
  styled,
  Text,
  Tooltip,
} from "@100mslive/react-ui";
import { ToastManager } from "../components/Toast/ToastManager";
import {
  HLSController,
  HLS_STREAM_NO_LONGER_LIVE,
  HLS_TIMED_METADATA_LOADED,
} from "../controllers/hls/HLSController";

const HLSVideo = styled("video", {
  h: "100%",
  margin: "0 auto",
  px: "$10",
});

let hlsController;
const HLSView = () => {
  const videoRef = useRef(null);
  const hlsState = useHMSStore(selectHLSState);
  const hlsUrl = hlsState.variants[0]?.url;
  // console.log("HLS URL", hlsUrl);
  const [availableLevels, setAvailableLevels] = useState([]);
  const [isVideoLive, setIsVideoLive] = useState(true);
  const [currentSelectedQualityText, setCurrentSelectedQualityText] =
    useState("");
  const [qualityDropDownOpen, setQualityDropDownOpen] = useState(false);

  useEffect(() => {
    if (videoRef.current && hlsUrl) {
      if (Hls.isSupported()) {
        hlsController = new HLSController(hlsUrl, videoRef);

        hlsController.on(HLS_STREAM_NO_LONGER_LIVE, () => {
          setIsVideoLive(false);
        });
        hlsController.on(HLS_TIMED_METADATA_LOADED, payload => {
          console.log(
            `%c Payload: ${payload}`,
            "color:#2b2d42; background:#d80032"
          );
          ToastManager.addToast({
            title: `Payload from timed Metadata ${payload}`,
          });
        });

        hlsController.on(Hls.Events.MANIFEST_LOADED, (_, { levels }) => {
          setAvailableLevels(levels);
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
    if (hlsController) {
      return () => hlsController.reset();
    }
  }, []);

  const qualitySelectorHandler = useCallback(
    qualityLevel => {
      if (hlsController) {
        hlsController.setCurrentLevel(getCurrentLevel(qualityLevel));
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
          <Flex
            align="center"
            justify="center"
            css={{ position: "absolute", right: "$10", zIndex: "10" }}
          >
            {hlsController ? (
              <Button
                variant="standard"
                css={{ marginRight: "0.3rem" }}
                onClick={() => {
                  hlsController.jumpToLive();
                  setIsVideoLive(true);
                }}
                key="LeaveRoom"
                data-testid="leave_room_btn"
              >
                <Tooltip title="Jump to Live">
                  <Flex>
                    <RecordIcon
                      color={isVideoLive ? "#CC525F" : "FAFAFA"}
                      key="jumpToLive"
                    />
                    Live
                  </Flex>
                </Tooltip>
              </Button>
            ) : null}
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
                    zIndex: 4,
                    border: "$space$px solid $textDisabled",
                    padding: "$4",
                  }}
                >
                  <Tooltip title="Select Quality">
                    <Flex>
                      <SettingsIcon />
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
        <Flex align="center" justify="center" css={{ size: "100%", px: "$10" }}>
          <Text variant="md" css={{ textAlign: "center" }}>
            Waiting for the Streaming to start...
          </Text>
        </Flex>
      )}
    </Fragment>
  );
};

export default HLSView;
