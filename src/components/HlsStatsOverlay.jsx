import React, { memo } from "react";
import { CloseIcon, LinkIcon } from "@100mslive/react-icons";
import { Flex, IconButton, Text } from "@100mslive/react-ui";

export function HlsStatsOverlay({ hlsStatsState, onClose }) {
  return (
    <Flex
      css={{
        position: "absolute",
        minWidth: "60%",
        margin: "$8 0  0 $20",
        "@md": {
          minWidth: "60%",
          margin: "$8 0  0 $8",
        },
        "@sm": {
          minWidth: "100%",
          margin: "$0",
        },
        padding: "$2 $4 $2 $4",
        zIndex: 100,
        backgroundColor: "rgba(55,59,66, 0.84)",

        borderRadius: "$1",
      }}
      direction="column"
    >
      <Flex justify="end">
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Flex>
      <HlsStatsRow label="URL">
        <Flex align="center">
          <LinkIcon />
          <a
            style={{ cursor: "pointer", textDecoration: "underline" }}
            href={hlsStatsState?.url}
            target="_blank"
            rel="noreferrer"
          >
            Stream url
          </a>
        </Flex>
      </HlsStatsRow>
      <HlsStatsRow label="Video size">
        {` ${hlsStatsState?.videoSize?.width}x${hlsStatsState?.videoSize?.height}`}
      </HlsStatsRow>
      <HlsStatsRow label="Buffer duration">
        {hlsStatsState?.bufferedDuration?.toFixed(2)}{" "}
      </HlsStatsRow>
      <HlsStatsRow label="Connection speed">
        {`${(hlsStatsState?.bandwidthEstimate / (1000 * 1000)).toFixed(2)}Mbps`}
      </HlsStatsRow>
      <HlsStatsRow label="Bitrate">
        {`${(hlsStatsState?.bitrate / (1000 * 1000)).toFixed(2)}Mbps`}
      </HlsStatsRow>
      <HlsStatsRow label="distance from live">
        {getDurationFromSeconds(hlsStatsState.distanceFromLive / 1000)}
      </HlsStatsRow>
      <HlsStatsRow label="Total frames dropped">
        {`${hlsStatsState?.droppedFrames}`}
      </HlsStatsRow>
    </Flex>
  );
}

/**
 * Extracted from HLS new Player PR.
 * TODO: remove this and use HMSVideoUtils.js
 * when that code is merged
 */
export function getDurationFromSeconds(timeInSeconds) {
  let time = Math.floor(timeInSeconds);
  const hours = Math.floor(time / 3600);
  time = time - hours * 3600;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);

  const prefixedMinutes = `${minutes < 10 ? "0" + minutes : minutes}`;
  const prefixedSeconds = `${seconds < 10 ? "0" + seconds : seconds}`;

  let videoTimeStr = `${prefixedMinutes}:${prefixedSeconds}`;
  if (hours) {
    const prefixedHours = `${hours < 10 ? "0" + hours : hours}`;
    videoTimeStr = `${prefixedHours}:${prefixedMinutes}:${prefixedSeconds}`;
  }
  return videoTimeStr;
}

const HlsStatsRow = memo(({ label, children }) => {
  return (
    <Flex gap={4} justify="between" css={{ width: "100%" }}>
      <Text
        css={{
          width: "30%",
          "@md": { fontSize: "$md" },
          "@sm": { fontSize: "$sm" },
        }}
      >
        {label}
      </Text>
      <Text
        css={{
          "@md": { fontSize: "$md" },
          "@sm": { fontSize: "$sm" },
          maxWidth: "70%",
          minWidth: "50%",
          overflowWrap: "break-word",
        }}
      >
        {children}
      </Text>
    </Flex>
  );
});
