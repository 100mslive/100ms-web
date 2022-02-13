import React, { useState } from "react";
import {
  usePreview,
  selectLocalPeer,
  useHMSStore,
  selectIsLocalVideoEnabled,
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
} from "@100mslive/react-ui";
import { AudioVideoToggle } from "../components/AudioVideoToggle";
import { USERNAME_KEY } from "../../common/constants";

const Preview = ({ token, join, env }) => {
  const [name, setName] = useState(localStorage.getItem(USERNAME_KEY) || "");
  const localPeer = useHMSStore(selectLocalPeer);
  const { enableJoin } = usePreview({
    name,
    token,
    initEndpoint: env
      ? `https://${env.split("-")[0]}-init.100ms.live/init`
      : "https://prod-init.100ms.live/init",
    metadata: {},
  });
  return (
    <StyledPreview.Container>
      {localPeer ? (
        <PreviewTile name={name} trackId={localPeer.videoTrack} />
      ) : (
        <>
          <StyledVideoTile.Container css={{ width: 360, height: 360 }}>
            <Loading size={100} />
          </StyledVideoTile.Container>
        </>
      )}
      <Flex direction="column" align="center">
        <Text css={{ my: "1rem" }} variant="heading-lg">
          Hi There
        </Text>
        <Text css={{ mb: "1rem" }}>What's your name?</Text>
        <Flex
          as="form"
          direction="column"
          align="center"
          onSubmit={e => {
            e.preventDefault();
            join(name);
          }}
        >
          <Input
            variant="compact"
            required
            maxLength={20}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Button type="submit" disabled={!enableJoin}>
            Join
          </Button>
        </Flex>
      </Flex>
    </StyledPreview.Container>
  );
};

const PreviewTile = ({ trackId, name }) => {
  const isVideoOn = useHMSStore(selectIsLocalVideoEnabled);
  return (
    <StyledVideoTile.Container css={{ width: 360, height: 360 }}>
      <Video mirror={true} trackId={trackId} />
      {!isVideoOn ? <Avatar size="sm" name={name} /> : null}
      <StyledPreview.BottomOverlay />
      <StyledPreview.Controls>
        <AudioVideoToggle />
      </StyledPreview.Controls>
    </StyledVideoTile.Container>
  );
};

export default Preview;
