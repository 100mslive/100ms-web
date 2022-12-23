import React, { memo } from "react";
import { CloseIcon } from "@100mslive/react-icons";
import { Flex, IconButton, Text } from "@100mslive/react-ui";

export function HlsStatsOverlay({ hlsStatsState, onClose }) {
  return (
    <Flex
      css={{
        position: "absolute",
        width: "$80",
        marginLeft: "$8",
        padding: "$8 $8 $10",
        zIndex: 100,
        backgroundColor: "rgba(55,59,66, 0.84)",

        borderRadius: "$1",
      }}
      direction="column"
    >
      <IconButton
        css={{ position: "absolute", top: "$2", right: "$2" }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      <HlsStatsRow label="URL">
        <Flex align="center">
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
      <HlsStatsRow label="Dropped frames">
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
    <Flex gap={4} justify="center" css={{ width: "100%" }}>
      <Text
        css={{
          width: "50%",
          "@md": { fontSize: "$md" },
          "@sm": { fontSize: "$sm" },
          // textAlign: "right",
        }}
      >
        {label}
      </Text>
      <Text
        css={{
          "@md": { fontSize: "$md" },
          "@sm": { fontSize: "$sm" },
          width: "50%",
          overflowWrap: "break-word",
          // textAlign: "left",
        }}
      >
        {children}
      </Text>
    </Flex>
  );
});
