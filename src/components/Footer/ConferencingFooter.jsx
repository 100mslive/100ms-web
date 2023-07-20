import React from "react";
import { useMedia } from "react-use";
import { HMSPlaylistType } from "@100mslive/react-sdk";
import {
  config as cssConfig,
  Flex,
  Footer as AppFooter,
} from "@100mslive/roomkit-react";
import { Playlist } from "../../components/Playlist/Playlist";
import { AudioVideoToggle } from "../AudioVideoToggle";
import { EmojiReaction } from "../EmojiReaction";
import { LeaveRoom } from "../LeaveRoom";
import MetaActions from "../MetaActions";
import { MoreSettings } from "../MoreSettings/MoreSettings";
import { PIP } from "../PIP";
import { ScreenshareToggle } from "../ScreenShare";
import { ChatToggle } from "./ChatToggle";
import { ToggleWidgets } from "./ToggleWidgets";
import { VirtualBackground } from "../../plugins/VirtualBackground/VirtualBackground";
import { FeatureFlags } from "../../services/FeatureFlags";

const TranscriptionButton = React.lazy(() =>
  import("../../plugins/transcription")
);

export const ConferencingFooter = () => {
  const isMobile = useMedia(cssConfig.media.md);
  return (
    <AppFooter.Root>
      <AppFooter.Left>
        <ToggleWidgets />
        <Playlist type={HMSPlaylistType.audio} />
        <Playlist type={HMSPlaylistType.video} />
        <VirtualBackground />
        {FeatureFlags.enableTranscription ? <TranscriptionButton /> : null}
        <Flex
          align="center"
          css={{
            display: "none",
            "@md": {
              display: "flex",
              gap: "$8",
            },
          }}
        >
          {isMobile && <EmojiReaction />}
          <MetaActions isMobile />
        </Flex>
      </AppFooter.Left>
      <AppFooter.Center>
        <AudioVideoToggle />
        <ScreenshareToggle />
        <PIP />
        <MoreSettings />
        <Flex
          align="center"
          css={{ display: "none", "@md": { display: "flex" } }}
        >
          <ChatToggle />
        </Flex>
        <LeaveRoom />
      </AppFooter.Center>
      <AppFooter.Right>
        {!isMobile && <EmojiReaction />}
        <MetaActions />
        <ChatToggle />
      </AppFooter.Right>
    </AppFooter.Root>
  );
};
