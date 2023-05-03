import React, { Fragment, useState } from "react";
import { useMedia } from "react-use";
import {
  HMSPlaylistType,
  selectIsAllowedToPublish,
  useHMSStore,
  useScreenShare,
} from "@100mslive/react-sdk";
import { MusicIcon } from "@100mslive/react-icons";
import {
  config as cssConfig,
  Flex,
  Footer as AppFooter,
  Tooltip,
} from "@100mslive/react-ui";
import { Playlist } from "../../components/Playlist/Playlist";
import IconButton from "../../IconButton";
import { AudioVideoToggle } from "../AudioVideoToggle";
import { EmojiReaction } from "../EmojiReaction";
import { LeaveRoom } from "../LeaveRoom";
import MetaActions from "../MetaActions";
import { MoreSettings } from "../MoreSettings/MoreSettings";
import { PIP } from "../PIP";
import { ScreenshareToggle } from "../ScreenShare";
import { ScreenShareHintModal } from "../ScreenshareHintModal";
import { ChatToggle } from "./ChatToggle";
import { NoiseSuppression } from "../../plugins/NoiseSuppression";
import { VirtualBackground } from "../../plugins/VirtualBackground/VirtualBackground";
import { ToggleWhiteboard } from "../../plugins/whiteboard";
import { useIsFeatureEnabled } from "../hooks/useFeatures";
import { isScreenshareSupported } from "../../common/utils";
import { FeatureFlags } from "../../services/FeatureFlags";
import { FEATURE_LIST } from "../../common/constants";

const TranscriptionButton = React.lazy(() =>
  import("../../plugins/transcription")
);

const ScreenshareAudio = () => {
  const {
    amIScreenSharing,
    screenShareVideoTrackId: video,
    screenShareAudioTrackId: audio,
    toggleScreenShare,
  } = useScreenShare();
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const isAudioScreenshare = amIScreenSharing && !video && !!audio;
  const [showModal, setShowModal] = useState(false);
  const isFeatureEnabled = useIsFeatureEnabled(
    FEATURE_LIST.AUDIO_ONLY_SCREENSHARE
  );
  if (
    !isFeatureEnabled ||
    !isAllowedToPublish.screen ||
    !isScreenshareSupported()
  ) {
    return null;
  }
  return (
    <Fragment>
      <Tooltip
        title={`${!isAudioScreenshare ? "Start" : "Stop"} audio sharing`}
        key="shareAudio"
      >
        <IconButton
          active={!isAudioScreenshare}
          onClick={() => {
            if (amIScreenSharing) {
              toggleScreenShare();
            } else {
              setShowModal(true);
            }
          }}
          data-testid="screenshare_audio"
        >
          <MusicIcon />
        </IconButton>
      </Tooltip>
      {showModal && (
        <ScreenShareHintModal onClose={() => setShowModal(false)} />
      )}
    </Fragment>
  );
};

export const ConferencingFooter = () => {
  const isMobile = useMedia(cssConfig.media.md);
  return (
    <AppFooter.Root>
      <AppFooter.Left>
        <ScreenshareAudio />
        <Playlist type={HMSPlaylistType.audio} />
        <Playlist type={HMSPlaylistType.video} />
        {FeatureFlags.enableWhiteboard ? <ToggleWhiteboard /> : null}
        <VirtualBackground />
        <NoiseSuppression />
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
