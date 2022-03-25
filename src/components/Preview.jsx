import React, { useState, useEffect, useCallback } from "react";
import {
  usePreviewJoin,
  selectLocalPeer,
  useHMSStore,
  selectIsLocalVideoEnabled,
  useAVToggle,
  selectLocalPeerID,
  selectRoomState,
  HMSRoomState,
} from "@100mslive/react-sdk";
import {
  Loading,
  Button,
  StyledVideoTile,
  Video,
  Text,
  Input,
  Flex,
  Avatar,
  IconButton,
  useTheme,
  useBorderAudioLevel,
  styled,
} from "@100mslive/react-ui";
import { SettingIcon } from "@100mslive/react-icons";
import { AudioVideoToggle } from "./AudioVideoToggle";
import Settings from "./Settings";
import {
  UserPreferencesKeys,
  useUserPreferences,
} from "./hooks/useUserPreferences";
import { ConnectionIndicator } from "./Connection/ConnectionIndicator";

const defaultPreviewPreference = {
  name: "",
  isAudioMuted: false,
  isVideoMuted: false,
};

const Preview = ({ token, onJoin, env, skipPreview, initialName }) => {
  const localPeer = useHMSStore(selectLocalPeerID);
  const roomState = useHMSStore(selectRoomState);
  const [previewPreference, setPreviewPreference] = useUserPreferences(
    UserPreferencesKeys.PREVIEW,
    defaultPreviewPreference
  );
  const [name, setName] = useState(initialName || previewPreference.name);
  const { isLocalAudioEnabled, isLocalVideoEnabled } = useAVToggle();
  const { enableJoin, preview, join } = usePreviewJoin({
    name,
    token,
    initEndpoint: env ? `https://${env}-init.100ms.live/init` : undefined,
    initialSettings: {
      isAudioMuted: skipPreview ? true : previewPreference.isAudioMuted,
      isVideoMuted: skipPreview ? true : previewPreference.isVideoMuted,
    },
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
    if (token && roomState === HMSRoomState.Disconnected) {
      if (skipPreview) {
        savePreferenceAndJoin();
      } else if (!localPeer) {
        preview();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, localPeer, roomState, skipPreview]);

  return (
    <Container>
      <PreviewTile name={name} />
      <Flex direction="column" align="center">
        <Text css={{ my: "1rem" }} variant="h5">
          Hi There!
        </Text>
        <Text css={{ mb: "1rem" }}>What's your name?</Text>
        <Flex
          as="form"
          direction="column"
          align="center"
          onSubmit={e => {
            e.preventDefault();
            savePreferenceAndJoin();
          }}
        >
          <Input
            css={{ mb: "1rem" }}
            autoComplete="name"
            type="text"
            required
            autoFocus
            maxLength={20}
            value={name}
            onChange={e => setName(e.target.value)}
            data-testid="preview_name_field"
          />
          <Button
            type="submit"
            disabled={!name || !enableJoin}
            data-testid="preview_join_btn"
          >
            Join
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

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
        aspectRatio: width / height,
        width: "unset",
        height: "min(360px, 60vh)",
        "@sm": {
          height: "unset",
          width: "min(360px, 90%)",
        },
      }}
      ref={borderAudioRef}
    >
      {localPeer ? (
        <>
          <ConnectionIndicator isTile peerId={localPeer.id} />
          <Video
            mirror={true}
            trackId={localPeer.videoTrack}
            data-testid="preview_tile"
          />
          {!isVideoOn ? (
            <Avatar name={name} data-testid="preview_avatar_tile" />
          ) : null}
          <StyledVideoTile.AttributeBox css={controlStyles}>
            <AudioVideoToggle compact />
          </StyledVideoTile.AttributeBox>
          <Settings>
            <StyledVideoTile.AttributeBox css={settingStyles}>
              <IconButton data-testid="preview_setting_btn">
                <SettingIcon />
              </IconButton>
            </StyledVideoTile.AttributeBox>
          </Settings>
        </>
      ) : (
        <Loading size={100} />
      )}
    </StyledVideoTile.Container>
  );
};

const Container = styled("div", {
  borderRadius: "$2",
  backgroundColor: "$previewBg",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem 6rem",
  "@md": {
    borderRadius: "0",
    padding: "0",
    width: "100%",
    height: "100%",
  },
});

const controlStyles = {
  bottom: "10px",
  left: "50%",
  transform: "translate(-50%, 0)",
  display: "flex",
  "& > * + *": {
    marginRight: "0",
    marginLeft: "0.5rem",
  },
};

const settingStyles = {
  bottom: "10px",
  right: "20px",
};

export default Preview;
