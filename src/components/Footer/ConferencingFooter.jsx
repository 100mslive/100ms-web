import React, { Fragment, useState } from "react";
import { MusicIcon } from "@100mslive/react-icons";
import {
  HMSPlaylistType,
  selectIsAllowedToPublish,
  useHMSStore,
  useScreenShare,
} from "@100mslive/react-sdk";
import { Flex, Tooltip, Footer as AppFooter } from "@100mslive/react-ui";
import { AudioVideoToggle } from "../AudioVideoToggle";
import { LeaveRoom } from "../LeaveRoom";
import { MoreSettings } from "../MoreSettings/MoreSettings";
import { ScreenshareToggle } from "../ScreenShare";
import { ScreenShareHintModal } from "../ScreenshareHintModal";
import IconButton from "../../IconButton";
import PIPComponent from "../PIP/PIPComponent";
import MetaActions from "../MetaActions";
import { ChatToggle } from "./ChatToggle";
import { Playlist } from "../../components/Playlist/Playlist";
import { NoiseSuppression } from "../../plugins/NoiseSuppression";
import { ToggleWhiteboard } from "../../plugins/whiteboard";
import { VirtualBackground } from "../../plugins/VirtualBackground/VirtualBackground";
import { FeatureFlags } from "../../services/FeatureFlags";
import { isScreenshareSupported } from "../../common/utils";

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
  if (!isAllowedToPublish.screen || !isScreenshareSupported()) {
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
              toggleScreenShare(true);
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
  return (
    <AppFooter.Root>
      <AppFooter.Left>
        <ScreenshareAudio />
        <Playlist type={HMSPlaylistType.audio} />
        <Playlist type={HMSPlaylistType.video} />
        {FeatureFlags.enableWhiteboard ? <ToggleWhiteboard /> : null}
        <VirtualBackground />
        <NoiseSuppression />
        {FeatureFlags.enableTranscription && <TranscriptionButton />}
        <Flex
          align="center"
          css={{
            display: "none",
            "@md": {
              display: "flex",
            },
          }}
        >
          <MetaActions isMobile />
        </Flex>
      </AppFooter.Left>
      <AppFooter.Center>
        <AudioVideoToggle />
        <ScreenshareToggle />
        <PIPComponent />
        <MoreSettings />
        <LeaveRoom />
        <Flex
          align="center"
          css={{ display: "none", "@md": { display: "flex" } }}
        >
          <ChatToggle />
        </Flex>
      </AppFooter.Center>
      <AppFooter.Right>
        <MetaActions />
        <ChatToggle />
      </AppFooter.Right>
    </AppFooter.Root>
  );
};
