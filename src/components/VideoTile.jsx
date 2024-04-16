import React, { Fragment, useCallback, useMemo, useState } from "react";
import {
  selectAudioTrackByPeerID,
  selectIsPeerAudioEnabled,
  selectLocalPeerID,
  selectPeerMetadata,
  selectPeerNameByID,
  selectVideoTrackByID,
  selectVideoTrackByPeerID,
  useHMSStore,
  selectLocalPeerRoleName,
  selectPeerByID
} from "@100mslive/react-sdk";
import {
  BrbIcon,
  HandRaiseFilledIcon,
  MicOffIcon,
} from "@100mslive/react-icons";
import {
  Avatar,
  StyledVideoTile,
  useBorderAudioLevel,
  Video,
  VideoTileStats,
} from "@100mslive/roomkit-react";
import TileConnection from "./Connection/TileConnection";
import { getVideoTileLabel } from "./peerTileUtils";
import TileMenu from "./TileMenu";
import { useAppConfig } from "./AppData/useAppConfig";
import { useIsHeadless, useUISettings } from "./AppData/useUISettings";
import { UI_SETTINGS } from "../common/constants";

const Tile = ({
  peerId,
  trackId,
  width,
  height,
  objectFit = "cover",
  rootCSS = {},
  containerCSS = {},
  onChangeRole,
  kickUser
}) => {
  const trackSelector = trackId
    ? selectVideoTrackByID(trackId)
    : selectVideoTrackByPeerID(peerId);
  const track = useHMSStore(trackSelector);
  const peerName = useHMSStore(selectPeerNameByID(peerId));
  const audioTrack = useHMSStore(selectAudioTrackByPeerID(peerId));
  const localPeerID = useHMSStore(selectLocalPeerID);
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const peer = useHMSStore(selectPeerByID(peerId));
  const peerRole = peer?.roleName || ""; // Get peer's role name
  const isAudioOnly = useUISettings(UI_SETTINGS.isAudioOnly);
  const mirrorLocalVideo = useUISettings(UI_SETTINGS.mirrorLocalVideo);
  const showStatsOnTiles = useUISettings(UI_SETTINGS.showStatsOnTiles);
  const isHeadless = useIsHeadless();
  const isAudioMuted = !useHMSStore(selectIsPeerAudioEnabled(peerId));
  const isVideoMuted = !track?.enabled;
  const [isMouseHovered, setIsMouseHovered] = useState(false);
  const borderAudioRef = useBorderAudioLevel(audioTrack?.id);
  const isVideoDegraded = track?.degraded;
  const isLocal = localPeerID === peerId;
  const [isKickingUser, setIsKickingUser] = useState(false);
  const label = getVideoTileLabel({
    peerName,
    track,
    isLocal,
  });
  const onHoverHandler = useCallback(event => {
    setIsMouseHovered(event.type === "mouseenter");
  }, []);
  const headlessConfig = useAppConfig("headlessConfig");
  const hideLabel = isHeadless && headlessConfig?.hideTileName;
  const isTileBigEnoughToShowStats = height >= 180 && width >= 180;
  const avatarSize = useMemo(() => {
    if (!width || !height) {
      return undefined;
    }
    if (width <= 150 || height <= 150) {
      return "small";
    } else if (width <= 300 || height <= 300) {
      return "medium";
    }
    return "large";
  }, [width, height]);

  const isModerator = peerRole === "moderator";
  const isInterviewee = peerRole === "interviewee";
  const isCandidate = peerRole === "candidate";
  // Adjust video size based on local peer role
  let videoWidth, videoHeight, videoCSS;
  if (isModerator) {
    videoWidth = "50vw"; // Occupies the full width
    videoHeight = "50vh";
    videoCSS = { backgroundColor: "blue" }; // Example style for host
  } else if (isInterviewee) {
    videoWidth = "50vw"; // Occupies the full width
    videoHeight = "50vh";
    videoCSS = { backgroundColor: "green" };

  } else if (isCandidate) {
    videoWidth = "20vw"; // Occupies the full width
    videoHeight = "20vh";
    videoCSS = { backgroundColor: "green" };
  } else {
    videoWidth = 200;
    videoHeight = 150;
    videoCSS = {}; // Default style
  }


  return (
    <StyledVideoTile.Root
      css={{
        width: videoWidth, // Use adjusted video width
        height: videoHeight, // Use adjusted video height
        padding: getPadding({
          isHeadless,
          tileOffset: headlessConfig?.tileOffset,
          hideAudioLevel: headlessConfig?.hideAudioLevel,
        }),
        ...rootCSS,
      }}
      data-testid={`participant_tile_${peerName}`}

    >
       {localPeerRole === "moderator" && peerRole === "moderator" && 
       <div style={{ textAlign: "center", marginBottom: "5px" }}>
       <span style={{ fontSize: "14px", fontWeight: "bold", color:"white" }}>MODERATOR</span>
     </div>
       }
    

    <div style={{ textAlign: "center", marginBottom: "5px" }}>
    {/* Buttons for kicking user and changing role */}
    {localPeerRole === "moderator" && peerRole === "interviewee" && (
      <button
        style={{
          padding: '5px 8px', // Adjusted padding
          border: 'none',
          borderRadius: '3px', // Adjusted border radius
          backgroundColor: 'red', // Red color for kick button
          color: 'white',
          textDecoration: 'none',
          display: 'inline-block',
          fontSize: '12px', // Adjusted font size
          cursor: 'pointer',
        }}
        disabled={isKickingUser} // Disable button while kicking user
        onClick={() => {
          setIsKickingUser(true); // Set loading state
          kickUser()
        }}
      >
        {isKickingUser ? 'Removing...' : 'Remove'}
      </button>
    )}

    {localPeerRole === "moderator" && peerRole === "candidate" && (
      <button
        style={{
          padding: '5px 8px', // Adjusted padding
          border: 'none',
          borderRadius: '3px', // Adjusted border radius
          backgroundColor: 'green', // Green color for change role button
          color: 'white',
          textDecoration: 'none',
          display: 'inline-block',
          fontSize: '12px', // Adjusted font size
          cursor: 'pointer',
        }}
        onClick={() => {
          onChangeRole(); // Call the onChangeRole function
        }}
      >
        Change Role
      </button>
    )}
  </div>




      {peerName !== undefined ? (
        <StyledVideoTile.Container
          onMouseEnter={onHoverHandler}
          onMouseLeave={onHoverHandler}
          ref={
            isHeadless && headlessConfig?.hideAudioLevel
              ? undefined
              : borderAudioRef
          }
          noRadius={isHeadless && Number(headlessConfig?.tileOffset) === 0}
          css={containerCSS}
        >
          {showStatsOnTiles && isTileBigEnoughToShowStats ? (
            <VideoTileStats
              audioTrackID={audioTrack?.id}
              videoTrackID={track?.id}
              peerID={peerId}
              isLocal={isLocal}
            />
          ) : null}

          {track ? (
            <>


              <Video
                trackId={track?.id}
                attach={isLocal ? undefined : !isAudioOnly}
                mirror={
                  mirrorLocalVideo &&
                  peerId === localPeerID &&
                  track?.source === "regular" &&
                  track?.facingMode !== "environment"
                }
                degraded={isVideoDegraded}
                noRadius={isHeadless && Number(headlessConfig?.tileOffset) === 0}
                data-testid="participant_video_tile"
                css={{
                  objectFit,
                }}
              />
            </>
          ) : null}
          {isVideoMuted || isVideoDegraded || (!isLocal && isAudioOnly) ? (
            <StyledVideoTile.AvatarContainer>
              <Avatar
                name={peerName || ""}
                data-testid="participant_avatar_icon"
                size={avatarSize}
              />
            </StyledVideoTile.AvatarContainer>
          ) : null}

          {showAudioMuted({
            hideTileAudioMute: headlessConfig?.hideTileAudioMute,
            isHeadless,
            isAudioMuted,
          }) ? (
            <StyledVideoTile.AudioIndicator
              data-testid="participant_audio_mute_icon"
              size={
                width && height && (width < 180 || height < 180)
                  ? "small"
                  : "medium"
              }
            >
              <MicOffIcon />
            </StyledVideoTile.AudioIndicator>
          ) : null}
          {isMouseHovered && !isHeadless ? (
            <TileMenu
              peerID={peerId}
              audioTrackID={audioTrack?.id}
              videoTrackID={track?.id}
              kickUser={kickUser}
              onChangeRole={onChangeRole}
              localPeerRole={localPeerRole}
              peerRole={peerRole}
            />
          ) : null}
          <PeerMetadata peerId={peerId} />
          <TileConnection
            hideLabel={hideLabel}
            name={label}
            isTile
            peerId={peerId}
            width={width}
          />
        </StyledVideoTile.Container>
      ) : null}
    </StyledVideoTile.Root>
  );
};

const metaStyles = { top: "$4", left: "$4" };

const PeerMetadata = ({ peerId }) => {
  const metaData = useHMSStore(selectPeerMetadata(peerId));
  const isHandRaised = metaData?.isHandRaised || false;
  const isBRB = metaData?.isBRBOn || false;

  return (
    <Fragment>
      {isHandRaised ? (
        <StyledVideoTile.AttributeBox
          css={metaStyles}
          data-testid="raiseHand_icon_onTile"
        >
          <HandRaiseFilledIcon width={40} height={40} />
        </StyledVideoTile.AttributeBox>
      ) : null}
      {isBRB ? (
        <StyledVideoTile.AttributeBox
          css={metaStyles}
          data-testid="brb_icon_onTile"
        >
          <BrbIcon width={40} height={40} />
        </StyledVideoTile.AttributeBox>
      ) : null}
    </Fragment>
  );
};

const VideoTile = React.memo(Tile);

const showAudioMuted = ({ hideTileAudioMute, isHeadless, isAudioMuted }) => {
  if (!isHeadless) {
    return isAudioMuted;
  }
  return isAudioMuted && !hideTileAudioMute;
};

const getPadding = ({ isHeadless, tileOffset, hideAudioLevel }) => {
  if (!isHeadless || isNaN(Number(tileOffset))) {
    return undefined;
  }
  // Adding extra padding of 3px to ensure that the audio border is visible properly between tiles when tileOffset is 0.
  return Number(tileOffset) === 0 ? (hideAudioLevel ? 0 : 3) : undefined;
};

export default VideoTile;
