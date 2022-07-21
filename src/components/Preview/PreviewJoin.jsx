import React, { useEffect, useCallback, useState, Fragment } from "react";
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
  textEllipsis,
} from "@100mslive/react-ui";
import { SettingsIcon, ArrowRightIcon } from "@100mslive/react-icons";
import { AudioVideoToggle } from "../AudioVideoToggle";
import SettingsModal from "../Settings/SettingsModal";
import TileConnection from "../Connection/TileConnection";
import { VirtualBackground } from "../../plugins/VirtualBackground/VirtualBackground";
import IconButton from "../../IconButton";
import {
  useUserPreferences,
  UserPreferencesKeys,
  defaultPreviewPreference,
} from "../hooks/useUserPreferences";

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
      <Text variant="h4" css={{ wordBreak: "break-word", textAlign: "center" }}>
        Let's get you started, {name}!
      </Text>
      <Text
        css={{ c: "$textMedEmp", my: "$6", textAlign: "center" }}
        variant="body1"
      >
        Let's get your studio setup ready in less than 5 minutes!
      </Text>
      <Flex
        align="center"
        justify="center"
        css={{
          "@sm": { width: "100%" },
          flexDirection: "column",
        }}
      >
        <PreviewTile name={name} />
        <PreviewControls
          enableJoin={enableJoin}
          savePreferenceAndJoin={savePreferenceAndJoin}
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
          width: "min(360px, 100%)",
          maxWidth: "100%",
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
    <Flex
      justify="between"
      css={{
        width: "100%",
        mt: "$8",
      }}
    >
      <Flex>
        <AudioVideoToggle compact />
        <VirtualBackground />
      </Flex>
      <Flex>
        <PreviewSettings />
        <Button
          onClick={savePreferenceAndJoin}
          disabled={!enableJoin}
          css={{ ml: "$4" }}
          icon
        >
          Join <ArrowRightIcon />
        </Button>
      </Flex>
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
