// @ts-check
import React, { useRef, useState } from "react";
import { StyledVideoTile, Video, VideoTileStats } from "@100mslive/react-ui";
import {
  useHMSStore,
  selectPeerByID,
  selectScreenShareAudioByPeerID,
  selectScreenShareByPeerID,
} from "@100mslive/react-sdk";
import { ExpandIcon, ShrinkIcon } from "@100mslive/react-icons";
import { useFullscreen } from "react-use";
import screenfull from "screenfull";

const Tile = ({
  peerId,
  showStatsOnTiles,
  width = "100%",
  height = "100%",
}) => {
  const track = useHMSStore(selectScreenShareByPeerID(peerId));
  const peer = useHMSStore(selectPeerByID(peerId));
  const fullscreenRef = useRef(null);
  // fullscreen is for desired state
  const [fullscreen, setFullscreen] = useState(false);
  // isFullscreen is for true state
  const isFullscreen = useFullscreen(fullscreenRef, fullscreen, {
    onClose: () => setFullscreen(false),
  });
  const isFullScreenSupported = screenfull.isEnabled;
  const audioTrack = useHMSStore(selectScreenShareAudioByPeerID(peer?.id));
  return (
    <StyledVideoTile.Root css={{ width, height }}>
      {peer ? (
        <StyledVideoTile.Container transparentBg ref={fullscreenRef}>
          {showStatsOnTiles ? (
            <VideoTileStats
              audioTrackID={audioTrack?.id}
              videoTrackID={track?.id}
            />
          ) : null}
          {isFullScreenSupported ? (
            <StyledVideoTile.FullScreenButton
              onClick={() => setFullscreen(!fullscreen)}
            >
              {isFullscreen ? <ShrinkIcon /> : <ExpandIcon />}
            </StyledVideoTile.FullScreenButton>
          ) : null}
          {track ? (
            <Video
              screenShare={true}
              mirror={peer.isLocal && track?.source === "regular"}
              trackId={track.id}
            />
          ) : null}
        </StyledVideoTile.Container>
      ) : null}
    </StyledVideoTile.Root>
  );
};

const ScreenshareTile = React.memo(Tile);

export default ScreenshareTile;
