import React, { Fragment, useState } from "react";
import {
  MessageModal,
  selectAvailableRoleNames,
  useHMSStore,
  Button,
  useHMSActions,
} from "@100mslive/hms-video-react";

const defaultClasses = {
  input:
    "rounded-lg w-full h-full bg-gray-600 dark:bg-gray-200 focus:outline-none",
  checkBoxLabel: "text-sm space-x-1 flex items-center",
};

export const MuteAll = () => {
  const roles = useHMSStore(selectAvailableRoleNames);
  const hmsActions = useHMSActions();
  const [showModal, setShowModal] = useState(false);
  const [mute, setMute] = useState(false);
  const [type, setType] = useState(false);
  const [role, setRole] = useState(false);
  const [source, setSource] = useState(false);

  const muteAll = async () => {
    await hmsActions.setRemoteTracksEnabled({
      enabled: !mute,
      type,
      source,
      roles: role ? [role] : undefined,
    });
    setShowModal(false);
  };

  return (
    <Fragment>
      {showModal && (
        <MessageModal
          show
          onClose={() => {
            setShowModal(false);
          }}
          title="RemoteTracks State Change"
          body={
            <form className="flex flex-col">
              <div className="flex items-center">
                <div className="mr-2">Roles</div>
                <select
                  className={defaultClasses.input}
                  onChange={event => {
                    setRole(event.currentTarget.value);
                  }}
                >
                  <option value="">Select track type</option>
                  {roles.map(role => {
                    return (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex items-center">
                <div className="mr-2">Track Type</div>
                <select
                  className={defaultClasses.input}
                  onChange={event => {
                    setType(event.currentTarget.value);
                  }}
                >
                  <option value="">Select track type</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              <div className="flex items-center">
                <div className="mr-2">Track Source</div>
                <select
                  className={defaultClasses.input}
                  onChange={event => {
                    setSource(event.currentTarget.value);
                  }}
                >
                  <option value="">Select track source</option>
                  <option value="regular">Regular</option>
                  <option value="screen">Screen</option>
                  <option value="audioplaylist">Audio Playlist</option>
                  <option value="videoplaylist">Video Playlist</option>
                </select>
              </div>
              <label className={defaultClasses.checkBoxLabel}>
                <input
                  type="checkbox"
                  onChange={() => setMute(prev => !prev)}
                  checked={mute}
                />
                <span>{mute ? "Unmute" : "Mute"}</span>
              </label>
            </form>
          }
          footer={
            <Button variant="emphasized" onClick={muteAll}>
              Change Tracks State
            </Button>
          }
        />
      )}
      <Button
        variant="standard"
        key="muteAll"
        onClick={muteAll}
        classes={{ root: "mr-2" }}
      >
        Mute/Unmute All
      </Button>
    </Fragment>
  );
};
