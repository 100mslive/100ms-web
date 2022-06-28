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
  IconButton,
  Button,
} from "@100mslive/react-ui";
import { SettingIcon, ArrowRightIcon } from "@100mslive/react-icons";
import {
  useUserPreferences,
  UserPreferencesKeys,
  defaultPreviewPreference,
} from "../hooks/useUserPreferences";
import { AudioVideoToggle } from "../AudioVideoToggle";
import Settings from "../Settings";

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
      isAudioMuted: skipPreview ? true : previewPreference.isAudioMuted,
      isVideoMuted: skipPreview ? true : previewPreference.isVideoMuted,
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
      <Text variant="h4">Let's get you started, {name}!</Text>
      <Text css={{ c: "$textMedEmp" }} variant="body1">
        Let's get your studio setup ready in less than 5 minutes!
      </Text>
      <PreviewTile name={name} />
      <PreviewControls enableJoin={enableJoin} />
    </Container>
  );
};

const Container = styled("div", {
  width: "100%",
  ...flexCenter,
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
          <Video
            mirror={true}
            trackId={localPeer.videoTrack}
            data-testid="preview_tile"
          />
          {!isVideoOn ? (
            <Avatar name={name} data-testid="preview_avatar_tile" />
          ) : null}
        </>
      ) : (
        <Loading size={100} />
      )}
    </StyledVideoTile.Container>
  );
};

const PreviewControls = ({ enableJoin }) => {
  return (
    <ControlContainer>
      <Flex align="start">
        <AudioVideoToggle compact />
      </Flex>
      <Flex align="start">
        <Settings>
          <IconButton data-testid="preview_setting_btn">
            <SettingIcon />
          </IconButton>
        </Settings>
        <Button disabled={!enableJoin} css={{ h: "32" }} icon>
          Join <ArrowRightIcon />
        </Button>
      </Flex>
    </ControlContainer>
  );
};

const ControlContainer = styled("div", {
  width: "min(360px, 90%)",
  maxWidth: "90%",
  display: "flex",
  justifyContent: "space-between",
  marginTop: "$8",
});

export default PreviewJoin;
