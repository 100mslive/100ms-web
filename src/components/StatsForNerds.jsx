import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  selectHMSStats,
  selectPeersMap,
  selectTracksMap,
  useHMSStatsStore,
  useHMSStore,
} from "@100mslive/react-sdk";
import {
  Dialog,
  Text,
  Box,
  Flex,
  Switch,
  Select,
  Label,
  HorizontalDivider,
} from "@100mslive/react-ui";
import { AppContext } from "./context/AppContext";

export const StatsForNerds = ({ onOpenChange }) => {
  const tracksWithLabels = useTracksWithLabel();
  const statsOptions = useMemo(
    () => [
      { id: "local-peer", label: "Local Peer Stats" },
      ...tracksWithLabels,
    ],
    [tracksWithLabels]
  );
  const [selectedStat, setSelectedStat] = useState("local-peer");
  const { showStatsOnTiles, setShowStatsOnTiles } = useContext(AppContext);

  useEffect(() => {
    if (
      selectedStat !== "local-peer" &&
      !tracksWithLabels.find(track => track.id === selectedStat)
    ) {
      setSelectedStat("local-peer");
    }
  }, [tracksWithLabels, selectedStat]);

  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <Dialog.Content
        css={{ width: "min(500px, 100%)", bg: "$surfaceDefault" }}
      >
        {/* Title */}
        <Dialog.Title>
          <Flex justify="between">
            <Flex align="center" css={{ mb: "$1" }}>
              <Text variant="h6" inline>
                Stats For Nerds
              </Text>
            </Flex>
            <Dialog.DefaultClose data-testid="stats_dialog_close_icon" />
          </Flex>
        </Dialog.Title>
        <HorizontalDivider css={{ mt: "0.8rem" }} />
        {/* Switch */}
        <Flex justify="start" gap={4} css={{ m: "$10 0" }}>
          <Switch
            checked={showStatsOnTiles}
            onCheckedChange={setShowStatsOnTiles}
          />
          <Text variant="body2" css={{ fontWeight: "$semiBold" }}>
            Show Stats on Tiles
          </Text>
        </Flex>
        {/* Select */}
        <Flex direction="column" css={{ gap: "$4", mb: "$12" }}>
          <Label variant="body2">Stats For</Label>
          <Select.Root data-testid="dialog_select_Stats For">
            <Select.DefaultDownIcon />
            <Select.Select
              onChange={e => setSelectedStat(e.target.value)}
              value={selectedStat}
              css={{ width: "100%" }}
            >
              {statsOptions.map(option => (
                <option value={option["id"]} key={option["id"]}>
                  {option["label"]}
                </option>
              ))}
            </Select.Select>
          </Select.Root>
        </Flex>
        {/* Stats */}
        {selectedStat === "local-peer" ? (
          <LocalPeerStats />
        ) : (
          <TrackStats trackID={selectedStat} />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

const useTracksWithLabel = () => {
  const tracksMap = useHMSStore(selectTracksMap);
  const peersMap = useHMSStore(selectPeersMap);
  const tracksWithLabels = useMemo(
    () =>
      Object.values(tracksMap).map(track => {
        const peerName = peersMap[track.peerId]?.name;
        return {
          id: track.id,
          label: `${peerName} ${track.source} ${track.type}`,
        };
      }),
    [tracksMap, peersMap]
  );
  return tracksWithLabels;
};

const LocalPeerStats = () => {
  const stats = useHMSStatsStore(selectHMSStats.localPeerStats);

  if (!stats) {
    return null;
  }

  return (
    <Flex css={{ flexWrap: "wrap", gap: "$10" }}>
      <StatsRow label="Packets Lost" value={stats.subscribe?.packetsLost} />
      <StatsRow label="Jitter" value={stats.subscribe?.jitter} />
      <StatsRow
        label="Publish Bitrate"
        value={formatBytes(stats.publish?.bitrate, "b/s")}
      />
      <StatsRow
        label="Subscribe Bitrate"
        value={formatBytes(stats.subscribe?.bitrate, "b/s")}
      />
      <StatsRow
        label="Total Bytes Sent"
        value={formatBytes(stats.publish?.bytesSent)}
      />
      <StatsRow
        label="Total Bytes Received"
        value={formatBytes(stats.subscribe?.bytesReceived)}
      />
    </Flex>
  );
};

const TrackStats = ({ trackID }) => {
  const stats = useHMSStatsStore(selectHMSStats.trackStatsByID(trackID));
  if (!stats) {
    return null;
  }
  const inbound = stats.type.includes("inbound");

  return (
    <Flex css={{ flexWrap: "wrap", gap: "$10" }}>
      <StatsRow label="Type" value={stats.type + " " + stats.kind} />
      <StatsRow label="Bitrate" value={formatBytes(stats.bitrate, "b/s")} />
      <StatsRow label="Packets Lost" value={stats.packetsLost || "-"} />
      <StatsRow label="Jitter" value={stats.jitter || "-"} />
      <StatsRow
        label={inbound ? "Bytes Received" : "Bytes Sent"}
        value={formatBytes(inbound ? stats.bytesReceived : stats.bytesSent)}
      />
      {stats.kind === "video" && (
        <>
          <StatsRow label="Framerate" value={stats.framesPerSecond} />
          {!inbound && (
            <StatsRow
              label="Quality Limitation Reason"
              value={stats.qualityLimitationReason || "-"}
            />
          )}
        </>
      )}
    </Flex>
  );
};

const StatsRow = ({ label, value }) => (
  <Box css={{ bg: "$surfaceLight", w: "47%", p: "$8", r: "$3" }}>
    <Text
      variant="overline"
      css={{
        fontWeight: "$semiBold",
        color: "$textMedEmp",
        textTransform: "uppercase",
      }}
    >
      {label}{" "}
    </Text>
    <Text
      variant="sub1"
      css={{ fontWeight: "$semiBold", color: "$textHighEmp" }}
    >
      {value}
    </Text>
  </Box>
);

const formatBytes = (bytes, unit = "B", decimals = 2) => {
  if (bytes === 0) return "0 " + unit;

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"].map(
    size => size + unit
  );

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
