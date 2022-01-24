import React, {
  useState,
  useMemo,
  Fragment,
  useContext,
  useEffect,
} from "react";
import { Button, MessageModal, Text } from "@100mslive/hms-video-react";
import {
  useHMSActions,
  useHMSStatsStore,
  useHMSStore,
  selectHMSStats,
  selectTracksMap,
  selectPeerNameByID,
} from "@100mslive/react-sdk";
import { Switch } from "@100mslive/react-ui";
import { hmsToast } from "./notifications/hms-toast";
import { USERNAME_KEY } from "../../common/constants";
import { AppContext } from "../../store/AppContext";

const defaultClasses = {
  formInner: "w-full flex flex-col md:flex-row my-1.5",
  selectLabel: "w-full md:w-1/3 flex justify-start md:justify-end items-center",
  selectContainer:
    "rounded-lg w-full md:w-1/2 bg-gray-600 dark:bg-gray-200 p-2 mx-0 my-2 md:my-0 md:mx-2",
  select:
    "rounded-lg w-full h-full bg-gray-600 dark:bg-gray-200 focus:outline-none",
};

const ChangeNameForm = ({ currentName, setCurrentName, changeName }) => {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        changeName();
      }}
    >
      <div className={defaultClasses.formInner}>
        <div className={defaultClasses.selectLabel}>
          <Text variant="heading" size="sm">
            Name:
          </Text>
        </div>

        <div className={defaultClasses.selectContainer}>
          <input
            autoFocus
            type="text"
            className={defaultClasses.select}
            value={currentName}
            onChange={e => setCurrentName(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

export const ChangeName = ({ showChangeNameModal, setShowChangeNameModal }) => {
  const hmsActions = useHMSActions();
  const [currentName, setCurrentName] = useState("");
  const changeName = async () => {
    const name = currentName.trim();
    if (name.length < 1) {
      hmsToast("Enter a valid name!");
      return;
    }
    try {
      await hmsActions.changeName(name);
      localStorage.setItem(USERNAME_KEY, name);
    } catch (error) {
      console.error("failed to update name", error);
      hmsToast(error.message);
    } finally {
      setShowChangeNameModal(false);
      setCurrentName("");
    }
  };

  const resetState = () => {
    setShowChangeNameModal(false);
    setCurrentName("");
  };

  return (
    <MessageModal
      title="Change my name"
      body={
        <ChangeNameForm
          currentName={currentName}
          setCurrentName={setCurrentName}
          changeName={changeName}
        />
      }
      footer={
        <Button
          variant="emphasized"
          shape="rectangle"
          onClick={changeName}
          disabled={currentName.trim().length < 1}
        >
          Change
        </Button>
      }
      show={showChangeNameModal}
      onClose={() => resetState()}
    />
  );
};

const StatsRow = ({ label, value }) => (
  <div className="grid grid-cols-2 mb-2">
    <span>{label}</span> <span>{value}</span>
  </div>
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

const LocalPeerStats = () => {
  const stats = useHMSStatsStore(selectHMSStats.localPeerStats);

  if (!stats) {
    return null;
  }

  return (
    <div className="m-4 mt-6">
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
    </div>
  );
};

const TrackStats = ({ trackID }) => {
  const stats = useHMSStatsStore(selectHMSStats.trackStatsByID(trackID));
  if (!stats) {
    return null;
  }
  const inbound = stats.type.includes("inbound");

  return (
    <div className="m-4 mt-6">
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
    </div>
  );
};

const StatsTrackOption = ({ track }) => {
  const peerName = useHMSStore(selectPeerNameByID(track.peerId));
  return (
    <option value={track.id}>
      {peerName} {track.source} {track.type}
    </option>
  );
};

export const StatsForNerds = ({ showModal, onCloseModal }) => {
  const tracksMap = useHMSStore(selectTracksMap);
  const trackIDs = useMemo(() => Object.keys(tracksMap), [tracksMap]);
  const { showStatsOnTiles, setShowStatsOnTiles } = useContext(AppContext);
  const [selectedStat, setSelectedStat] = useState("local-peer");

  useEffect(() => {
    if (selectedStat !== "local-peer" && !trackIDs.includes(selectedStat)) {
      setSelectedStat("local-peer");
    }
  }, [trackIDs, selectedStat]);

  return (
    <MessageModal
      show={showModal}
      onClose={() => {
        onCloseModal();
      }}
      title="Stats For Nerds"
      body={
        <Fragment>
          <div className="flex justify-center items-center">
            Stats for
            <div className={defaultClasses.selectContainer}>
              <select
                className={defaultClasses.select}
                value={selectedStat}
                onChange={e => setSelectedStat(e.target.value)}
              >
                <option value="local-peer">Your Stats</option>
                {trackIDs.map(trackID => (
                  <StatsTrackOption key={trackID} track={tracksMap[trackID]} />
                ))}
              </select>
            </div>
          </div>
          {selectedStat === "local-peer" ? (
            <LocalPeerStats />
          ) : (
            <TrackStats trackID={selectedStat} />
          )}
          <hr />
          <div className="flex justify-evenly items-center mt-4">
            <h3 className="text-base">Show Stats on Tiles</h3>
            <Switch
              checked={showStatsOnTiles}
              onCheckedChange={setShowStatsOnTiles}
            />
          </div>
        </Fragment>
      }
    />
  );
};
