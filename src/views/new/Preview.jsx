import React, { useState } from "react";
import {
  usePreviewJoin,
  selectLocalPeer,
  useHMSStore,
  selectIsLocalVideoEnabled,
  useAVToggle,
} from "@100mslive/react-sdk";
import {
  Loading,
  Preview as StyledPreview,
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
} from "@100mslive/react-ui";
import { AudioVideoToggle } from "../components/AudioVideoToggle";
import { SettingIcon } from "@100mslive/react-icons";
import Settings from "./Settings";
import {
  UserPreferencesKeys,
  useUserPreferences,
} from "../hooks/useUserPreferences";

const defaultPreviewPreference = {
  name: "",
  isAudioMuted: false,
  isVideoMuted: false,
};

const Preview = ({ token, onJoin, env, skipPreview, initialName }) => {
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
  React.useEffect(() => {
    if (token) {
      if (skipPreview) {
        savePreferenceAndJoin();
      } else {
        preview();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  const savePreferenceAndJoin = React.useCallback(() => {
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
  return (
    <StyledPreview.Container css={{ padding: "2rem 6rem" }}>
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
            required
            maxLength={20}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Button type="submit" disabled={!name || !enableJoin}>
            Join
          </Button>
        </Flex>
      </Flex>
    </StyledPreview.Container>
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
      }}
      ref={borderAudioRef}
    >
      {localPeer ? (
        <>
          <Video mirror={true} trackId={localPeer.videoTrack} />
          {!isVideoOn ? <Avatar name={name} /> : null}
          <StyledPreview.Controls>
            <AudioVideoToggle compact />
          </StyledPreview.Controls>
          <Settings>
            <StyledPreview.Setting>
              <IconButton>
                <SettingIcon />
              </IconButton>
            </StyledPreview.Setting>
          </Settings>
        </>
      ) : (
        <Loading size={100} />
      )}
    </StyledVideoTile.Container>
  );
};

export default Preview;
