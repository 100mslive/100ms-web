import React, { useRef, useState, useEffect, Fragment } from "react";
import {
  useDevices,
  DeviceType,
  useHMSStore,
  selectLocalVideoTrackID,
  selectIsLocalVideoEnabled,
} from "@100mslive/react-sdk";
import { MicOnIcon, SpeakerIcon, VideoOnIcon } from "@100mslive/react-icons";
import {
  Button,
  Text,
  Flex,
  Dropdown,
  Box,
  StyledVideoTile,
  Video,
} from "@100mslive/react-ui";
import { DialogDropdownTrigger } from "../../primitives/DropdownTrigger";
import { useDropdownSelection } from "../hooks/useDropdownSelection";

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

  return (
    <Fragment>
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
                "@md": {
                  display: "none",
                },
              }}
            >
              <Video trackId={videoTrackId} />
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
          title="Microphone"
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
      {audioOutput?.length ? (
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
    </Fragment>
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
            "[data-radix-popper-content-wrapper]": {
              w: "100%",
              minWidth: "0 !important",
              transform: "translateY($space$17) !important",
              zIndex: 11,
            },
            "@md": {
              mb: children ? "$8" : 0,
            },
          }}
        >
          <Dropdown.Root open={open} onOpenChange={setOpen}>
            <DialogDropdownTrigger
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
                devices.find(({ deviceId }) => deviceId === selection)?.label
              }
              open={open}
            />
            <Dropdown.Content
              align="start"
              sideOffset={8}
              css={{ w: "100%" }}
              portalled={false}
            >
              {devices.map(device => {
                return (
                  <Dropdown.Item
                    key={device.label}
                    onSelect={() => onChange(device.deviceId)}
                    css={{
                      px: "$9",
                      bg:
                        device.deviceId === selection ? selectionBg : undefined,
                    }}
                  >
                    {device.label}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Content>
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
