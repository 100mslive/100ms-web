import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  selectIsLocalVideoEnabled,
  selectLocalPeer,
  selectVideoTrackByID,
  useAVToggle,
  useHMSStore,
  usePreviewJoin,
} from "@100mslive/react-sdk";
import { SettingsIcon } from "@100mslive/react-icons";
import {
  Avatar,
  Flex,
  flexCenter,
  Loading,
  styled,
  StyledVideoTile,
  Text,
  textEllipsis,
  useBorderAudioLevel,
  useTheme,
  Video,
} from "@100mslive/react-ui";
import IconButton from "../../IconButton";
import { AudioVideoToggle } from "../AudioVideoToggle";
import TileConnection from "../Connection/TileConnection";
import SettingsModal from "../Settings/SettingsModal";
import PreviewName from "./PreviewName";
import { VirtualBackground } from "../../plugins/VirtualBackground/VirtualBackground";
import { useUISettings } from "../AppData/useUISettings";
import {
  defaultPreviewPreference,
  UserPreferencesKeys,
  useUserPreferences,
} from "../hooks/useUserPreferences";
import { UI_SETTINGS } from "../../common/constants";

const PreviewJoin = ({
  token,
  onJoin,
  env,
  skipPreview,
  initialName,
  asRole,
}) => {
  const [previewPreference, setPreviewPreference] = useUserPreferences(
    UserPreferencesKeys.PREVIEW,
    defaultPreviewPreference
  );
  const [name, setName] = useState(initialName || previewPreference.name);
  const { isLocalAudioEnabled, isLocalVideoEnabled } = useAVToggle();
  const [previewError, setPreviewError] = useState(false);
  const { enableJoin, preview, join } = usePreviewJoin({
    name,
    token,
    initEndpoint: env ? `https://${env}-init.100ms.live/init` : undefined,
    initialSettings: {
      isAudioMuted: skipPreview || previewPreference.isAudioMuted,
      isVideoMuted: skipPreview || previewPreference.isVideoMuted,
      speakerAutoSelectionBlacklist: ["Yeti Stereo Microphone"],
    },
    captureNetworkQualityInPreview: true,
    handleError: (_, method) => {
      if (method === "preview") {
        setPreviewError(true);
      }
    },
    asRole,
  });
  const savePreferenceAndJoin = useCallback(() => {
    setPreviewPreference({
      name,
      isAudioMuted: !isLocalAudioEnabled,
      isVideoMuted: !isLocalVideoEnabled,
    });
    join();
    onJoin && onJoin();
  }, [
    join,
    isLocalAudioEnabled,
    isLocalVideoEnabled,
    name,
    setPreviewPreference,
    onJoin,
  ]);
  useEffect(() => {
    if (token) {
      if (skipPreview) {
        savePreferenceAndJoin();
      } else {
        preview();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, skipPreview]);
  return (
    <Container>
      <Text variant="h4" css={{ wordBreak: "break-word", textAlign: "center" }}>
        Get Started
      </Text>
      <Text
        css={{ c: "$textMedEmp", my: "$6", textAlign: "center" }}
        variant="body1"
      >
        Setup your audio and video before joining
      </Text>
      <Flex
        align="center"
        justify="center"
        css={{
          "@sm": { width: "100%" },
          flexDirection: "column",
        }}
      >
        <PreviewTile name={name} error={previewError} />
        <PreviewControls
          enableJoin={enableJoin}
          savePreferenceAndJoin={savePreferenceAndJoin}
        />
        <PreviewName
          name={name}
          onChange={setName}
          enableJoin={enableJoin}
          onJoin={savePreferenceAndJoin}
        />
      </Flex>
    </Container>
  );
};

const Container = styled("div", {
  width: "100%",
  ...flexCenter,
  flexDirection: "column",
  px: "$10",
});

const PreviewTile = ({ name, error }) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const borderAudioRef = useBorderAudioLevel(localPeer?.audioTrack);
  const isVideoOn = useHMSStore(selectIsLocalVideoEnabled);
  const mirrorLocalVideo = useUISettings(UI_SETTINGS.mirrorLocalVideo);
  const trackSelector = selectVideoTrackByID(localPeer?.videoTrack);
  const track = useHMSStore(trackSelector);

  const {
    aspectRatio: { width, height },
  } = useTheme();
  return (
    <StyledVideoTile.Container
      css={{
        bg: "$surfaceDefault",
        aspectRatio: width / height,
        width: "unset",
        height: "min(360px, 60vh)",
        mt: "$12",
        "@sm": {
          height: "unset",
          width: "min(360px, 100%)",
          maxWidth: "100%",
        },
      }}
      ref={borderAudioRef}
    >
      {localPeer ? (
        <>
          <TileConnection name={name} peerId={localPeer.id} hideLabel={true} />
          <Video
            mirror={track?.facingMode !== "environment" && mirrorLocalVideo}
            trackId={localPeer.videoTrack}
            data-testid="preview_tile"
          />
          {!isVideoOn ? (
            <StyledVideoTile.AvatarContainer>
              <Avatar name={name} data-testid="preview_avatar_tile" />
              <Text css={{ ...textEllipsis("75%") }} variant="body2">
                {name}
              </Text>
            </StyledVideoTile.AvatarContainer>
          ) : null}
        </>
      ) : !error ? (
        <Loading size={100} />
      ) : null}
    </StyledVideoTile.Container>
  );
};

const PreviewControls = () => {
  return (
    <Flex
      justify="between"
      css={{
        width: "100%",
        mt: "$8",
      }}
    >
      <Flex css={{ gap: "$4" }}>
        <AudioVideoToggle compact />
        <VirtualBackground />
      </Flex>
      <PreviewSettings />
    </Flex>
  );
};

const PreviewSettings = React.memo(() => {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <IconButton
        data-testid="preview_setting_btn"
        onClick={() => setOpen(value => !value)}
      >
        <SettingsIcon />
      </IconButton>
      {open && <SettingsModal open={open} onOpenChange={setOpen} />}
    </Fragment>
  );
});

export default PreviewJoin;
