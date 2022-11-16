import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  selectHMSStats,
  selectLocalPeerID,
  selectPeersMap,
  selectTracksMap,
  useHMSStatsStore,
  useHMSStore,
} from "@100mslive/react-sdk";
import {
  Box,
  Dialog,
  Dropdown,
  Flex,
  HorizontalDivider,
  Label,
  Switch,
  Text,
} from "@100mslive/react-ui";
import { DialogDropdownTrigger } from "../primitives/DropdownTrigger";
import { useSetUiSettings } from "./AppData/useUISettings";
import { useDropdownSelection } from "./hooks/useDropdownSelection";
import { UI_SETTINGS } from "../common/constants";

export const StatsForNerds = ({ onOpenChange }) => {
  const tracksWithLabels = useTracksWithLabel();
  const statsOptions = useMemo(
    () => [
      { id: "local-peer", label: "Local Peer Stats" },
      ...tracksWithLabels,
    ],
    [tracksWithLabels]
  );
  const [selectedStat, setSelectedStat] = useState(statsOptions[0]);
  const [showStatsOnTiles, setShowStatsOnTiles] = useSetUiSettings(
    UI_SETTINGS.showStatsOnTiles
  );
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const selectionBg = useDropdownSelection();

  useEffect(() => {
    if (
      selectedStat.id !== "local-peer" &&
      !tracksWithLabels.find(track => track.id === selectedStat.id)
    ) {
      setSelectedStat("local-peer");
    }
  }, [tracksWithLabels, selectedStat]);

  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          css={{
            width: "min(500px, 95%)",
          }}
        >
          {/* Title */}
          <Dialog.Title css={{ p: "$4 0" }}>
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
          <Flex
            direction="column"
            css={{
              mb: "$12",
              position: "relative",
              minWidth: 0,
            }}
          >
            <Label variant="body2">Stats For</Label>
            <Dropdown.Root
              data-testid="dialog_select_Stats For"
              open={open}
              onOpenChange={setOpen}
            >
              <DialogDropdownTrigger
                title={selectedStat.label || "Select Stats"}
                css={{ mt: "$4" }}
                titleCSS={{ mx: 0 }}
                open={open}
                ref={ref}
              />
              <Dropdown.Portal>
                <Dropdown.Content
                  align="start"
                  sideOffset={8}
                  css={{ w: ref.current?.clientWidth, zIndex: 1000 }}
                >
                  {statsOptions.map(option => {
                    const isSelected =
                      option.id === selectedStat.id &&
                      option.layer === selectedStat.layer;
                    return (
                      <Dropdown.Item
                        key={option.label}
                        onClick={() => {
                          setSelectedStat(option);
                        }}
                        css={{
                          px: "$9",
                          bg: isSelected ? selectionBg : undefined,
                          c: isSelected ? "$white" : "$textPrimary",
                        }}
                      >
                        {option.label}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Content>
              </Dropdown.Portal>
            </Dropdown.Root>
          </Flex>
          {/* Stats */}
          {selectedStat.id === "local-peer" ? (
            <LocalPeerStats />
          ) : (
            <TrackStats
              trackID={selectedStat.id}
              layer={selectedStat.layer}
              local={selectedStat.local}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const useTracksWithLabel = () => {
  const tracksMap = useHMSStore(selectTracksMap);
  const peersMap = useHMSStore(selectPeersMap);
  const localPeerID = useHMSStore(selectLocalPeerID);
  const tracksWithLabels = useMemo(
    () =>
      Object.values(tracksMap).reduce((res, track) => {
        const peerName = peersMap[track.peerId]?.name;
        const isLocalTrack = track.peerId === localPeerID;
        if (isLocalTrack && track.layerDefinitions?.length) {
          res = res.concat(
            track.layerDefinitions.map(({ layer }) => {
              return {
                id: track.id,
                layer,
                local: true,
                label: `${peerName} ${track.source} ${track.type} - ${layer}`,
              };
            })
          );
          return res;
        }
        res.push({
          id: track.id,
          local: isLocalTrack,
          label: `${peerName} ${track.source} ${track.type}`,
        });
        return res;
      }, []),
    [tracksMap, peersMap, localPeerID]
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
      <StatsRow
        label="Packets Lost"
        value={stats.subscribe?.packetsLost || "-"}
      />
      <StatsRow label="Jitter" value={stats.subscribe?.jitter || "-"} />
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

const TrackStats = ({ trackID, layer, local }) => {
  const selector = layer
    ? selectHMSStats.localVideoTrackStatsByLayer(layer)(trackID)
    : local
    ? selectHMSStats.localAudioTrackStatsByID(trackID)
    : selectHMSStats.trackStatsByID(trackID);
  const stats = useHMSStatsStore(selector);
  if (!stats) {
    return null;
  }
  const inbound = stats.type.includes("inbound");

  return (
    <Flex css={{ flexWrap: "wrap", gap: "$10" }}>
      <StatsRow label="Type" value={stats.type + " " + stats.kind} />
      <StatsRow label="Bitrate" value={formatBytes(stats.bitrate, "b/s")} />
      <StatsRow label="Packets Lost" value={stats.packetsLost || "-"} />
      <StatsRow label="Jitter" value={stats.jitter?.toFixed(3) || "-"} />
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
          {stats.rid && <StatsRow label="Rid" value={stats.rid} />}
        </>
      )}
    </Flex>
  );
};

const StatsRow = React.memo(({ label, value }) => (
  <Box css={{ bg: "$surfaceLight", w: "calc(50% - $6)", p: "$8", r: "$3" }}>
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
));

const formatBytes = (bytes, unit = "B", decimals = 2) => {
  if (bytes === undefined) return "-";
  if (bytes === 0) return "0 " + unit;

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"].map(
    size => size + unit
  );

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
