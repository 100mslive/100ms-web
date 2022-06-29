import React, { useEffect, useCallback } from "react";
import {
  usePreviewJoin,
  selectLocalPeer,
  useHMSStore,
  selectIsLocalVideoEnabled,
  useAVToggle,
} from "@100mslive/react-sdk";
import {
  styled,
  flexCenter,
  Text,
  StyledVideoTile,
  Loading,
  Video,
  useBorderAudioLevel,
  useTheme,
  Avatar,
  Flex,
  Button,
  Box,
  textEllipsis,
} from "@100mslive/react-ui";
import { SettingIcon, ArrowRightIcon } from "@100mslive/react-icons";
import {
  useUserPreferences,
  UserPreferencesKeys,
  defaultPreviewPreference,
} from "../hooks/useUserPreferences";
import { AudioVideoToggle } from "../AudioVideoToggle";
import Settings from "../Settings";
import { VirtualBackground } from "../../plugins/VirtualBackground/VirtualBackground";
import TileConnection from "../Connection/TileConnection";
import IconButton from "../../IconButton";

const PreviewJoin = ({ token, onJoin, env, skipPreview, initialName }) => {
  const [previewPreference, setPreviewPreference] = useUserPreferences(
    UserPreferencesKeys.PREVIEW,
    defaultPreviewPreference
  );
  const name = initialName || previewPreference.name;
  const { isLocalAudioEnabled, isLocalVideoEnabled } = useAVToggle();
  const { enableJoin, preview, join } = usePreviewJoin({
    name,
    token,
    initEndpoint: env ? `https://${env}-init.100ms.live/init` : undefined,
    initialSettings: {
      isAudioMuted: skipPreview || previewPreference.isAudioMuted,
      isVideoMuted: skipPreview || previewPreference.isVideoMuted,
    },
    captureNetworkQualityInPreview: true,
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
      <Text variant="h4" css={{ wordBreak: "break-all" }}>
        Let's get you started, {name}!
      </Text>
      <Text css={{ c: "$textMedEmp", my: "$6" }} variant="body1">
        Let's get your studio setup ready in less than 5 minutes!
      </Text>
      <Box
        css={{
          "@sm": { width: "100%" },
          ...flexCenter,
          flexDirection: "column",
        }}
      >
        <PreviewTile name={name} />
        <PreviewControls
          enableJoin={enableJoin}
          savePreferenceAndJoin={savePreferenceAndJoin}
        />
      </Box>
    </Container>
  );
};

const Container = styled("div", {
  width: "100%",
  ...flexCenter,
  textAlign: "center",
  flexDirection: "column",
});

const PreviewTile = ({ name }) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const borderAudioRef = useBorderAudioLevel(localPeer?.audioTrack);
  const isVideoOn = useHMSStore(selectIsLocalVideoEnabled);
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
          width: "min(360px, 90%)",
          maxWidth: "90%",
        },
      }}
      ref={borderAudioRef}
    >
      {localPeer ? (
        <>
          <TileConnection name={name} peerId={localPeer.id} />
          <Video
            mirror={true}
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
      ) : (
        <Loading size={100} />
      )}
    </StyledVideoTile.Container>
  );
};

const PreviewControls = ({ enableJoin, savePreferenceAndJoin }) => {
  return (
    <ControlContainer>
      <Flex align="start">
        <AudioVideoToggle compact />
        <VirtualBackground />
      </Flex>
      <Flex align="start">
        <Settings>
          <IconButton data-testid="preview_setting_btn">
            <SettingIcon />
          </IconButton>
        </Settings>
        <Button
          onClick={savePreferenceAndJoin}
          disabled={!enableJoin}
          css={{ h: "$13", ml: "$4" }}
          icon
        >
          <Text variant="button">Join</Text> <ArrowRightIcon />
        </Button>
      </Flex>
    </ControlContainer>
  );
};

const ControlContainer = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  marginTop: "$8",
  "@sm": {
    width: "min(360px, 90%)",
    maxWidth: "90%",
  },
});

export default PreviewJoin;
