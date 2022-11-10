import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  DeviceType,
  selectIsLocalVideoEnabled,
  selectLocalVideoTrackID,
  selectVideoTrackByID,
  useDevices,
  useHMSStore,
} from "@100mslive/react-sdk";
import { MicOnIcon, SpeakerIcon, VideoOnIcon } from "@100mslive/react-icons";
import {
  Box,
  Button,
  Dropdown,
  Flex,
  StyledVideoTile,
  Text,
  Video,
} from "@100mslive/react-ui";
import { DialogDropdownTrigger } from "../../primitives/DropdownTrigger";
import { useUISettings } from "../AppData/useUISettings";
import { useDropdownSelection } from "../hooks/useDropdownSelection";
import { settingOverflow } from "./common.js";
import { UI_SETTINGS } from "../../common/constants";

/**
 * wrap the button on click of whom settings should open, this component will take care of the rest,
 * it'll give the user options to change input/output device as well as check speaker.
 * There is also another controlled way of using this by passing in open and onOpenChange.
 */
const Settings = () => {
  const { allDevices, selectedDeviceIDs, updateDevice } = useDevices();
  const { videoInput, audioInput, audioOutput } = allDevices;
  const videoTrackId = useHMSStore(selectLocalVideoTrackID);
  const isVideoOn = useHMSStore(selectIsLocalVideoEnabled);
  // don't show speaker selector where the API is not supported, and use
  // a generic word("Audio") for Mic. In some cases(Chrome Android for e.g.) this changes both mic and speaker keeping them in sync.
  const shouldShowAudioOutput = "setSinkId" in HTMLMediaElement.prototype;
  const mirrorLocalVideo = useUISettings(UI_SETTINGS.mirrorLocalVideo);
  const trackSelector = selectVideoTrackByID(videoTrackId);
  const track = useHMSStore(trackSelector);

  return (
    <Box className={settingOverflow()}>
      {videoInput?.length ? (
        <Fragment>
          {isVideoOn && (
            <StyledVideoTile.Container
              css={{
                w: "90%",
                px: "$10",
                height: "$48",
                bg: "transparent",
                m: "$10 auto",
              }}
            >
              <Video
                trackId={videoTrackId}
                mirror={track?.facingMode !== "environment" && mirrorLocalVideo}
              />
            </StyledVideoTile.Container>
          )}
          <DeviceSelector
            title="Video"
            devices={videoInput}
            icon={<VideoOnIcon />}
            selection={selectedDeviceIDs.videoInput}
            onChange={deviceId =>
              updateDevice({
                deviceId,
                deviceType: DeviceType.videoInput,
              })
            }
          />
        </Fragment>
      ) : null}
      {audioInput?.length ? (
        <DeviceSelector
          title={shouldShowAudioOutput ? "Microphone" : "Audio"}
          icon={<MicOnIcon />}
          devices={audioInput}
          selection={selectedDeviceIDs.audioInput}
          onChange={deviceId =>
            updateDevice({
              deviceId,
              deviceType: DeviceType.audioInput,
            })
          }
        />
      ) : null}
      {audioOutput?.length && shouldShowAudioOutput ? (
        <DeviceSelector
          title="Speaker"
          icon={<SpeakerIcon />}
          devices={audioOutput}
          selection={selectedDeviceIDs.audioOutput}
          onChange={deviceId =>
            updateDevice({
              deviceId,
              deviceType: DeviceType.audioOutput,
            })
          }
        >
          <TestAudio id={selectedDeviceIDs.audioOutput} />
        </DeviceSelector>
      ) : null}
    </Box>
  );
};

const DeviceSelector = ({
  title,
  devices,
  selection,
  onChange,
  icon,
  children = null,
}) => {
  const [open, setOpen] = useState(false);
  const selectionBg = useDropdownSelection();
  const ref = useRef(null);

  return (
    <Box css={{ mb: "$10" }}>
      <Text css={{ mb: "$4" }}>{title}</Text>
      <Flex
        align="center"
        css={{
          gap: "$4",
          "@md": {
            flexDirection: children ? "column" : "row",
            alignItems: children ? "start" : "center",
          },
        }}
      >
        <Box
          css={{
            position: "relative",
            flex: "1 1 0",
            w: "100%",
            minWidth: 0,
            "@md": {
              mb: children ? "$8" : 0,
            },
          }}
        >
          <Dropdown.Root open={open} onOpenChange={setOpen}>
            <DialogDropdownTrigger
              ref={ref}
              css={{
                ...(children
                  ? {
                      flex: "1 1 0",
                      minWidth: 0,
                    }
                  : {}),
              }}
              icon={icon}
              title={
                devices.find(({ deviceId }) => deviceId === selection)?.label ||
                "Select device from list"
              }
              open={open}
            />
            <Dropdown.Portal>
              <Dropdown.Content
                align="start"
                sideOffset={8}
                css={{ w: ref.current?.clientWidth, zIndex: 1000 }}
              >
                {devices.map(device => {
                  return (
                    <Dropdown.Item
                      key={device.label}
                      onSelect={() => onChange(device.deviceId)}
                      css={{
                        px: "$9",
                        bg:
                          device.deviceId === selection
                            ? selectionBg
                            : undefined,
                      }}
                    >
                      {device.label}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Content>
            </Dropdown.Portal>
          </Dropdown.Root>
        </Box>
        {children}
      </Flex>
    </Box>
  );
};

const TEST_AUDIO_URL = "https://100ms.live/test-audio.wav";

const TestAudio = ({ id }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (audioRef.current && id) {
      try {
        if (typeof audioRef.current.setSinkId !== "undefined") {
          audioRef.current.setSinkId(id);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [id]);
  return (
    <>
      <Button
        variant="standard"
        css={{
          flexShrink: 0,
          p: "$6 $9",
          "@md": {
            w: "100%",
          },
        }}
        onClick={() => audioRef.current?.play()}
        disabled={playing}
      >
        <SpeakerIcon />
        &nbsp;Test{" "}
        <Text as="span" css={{ display: "none", "@md": { display: "inline" } }}>
          &nbsp; speaker
        </Text>
      </Button>
      <audio
        ref={audioRef}
        src={TEST_AUDIO_URL}
        onEnded={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </>
  );
};

export default Settings;
