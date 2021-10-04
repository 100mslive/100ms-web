import React, { Fragment, useCallback, useState } from "react";
import {
  MessageModal,
  selectAvailableRoleNames,
  useHMSStore,
  Button,
  useHMSActions,
} from "@100mslive/hms-video-react";

const defaultClasses = {
  form: "flex flex-col justify-center",
  formItem: "flex items-center h-8 mb-3",
  label: "w-1/4 mr-2",
  input:
    "rounded-lg w-1/2 h-full bg-gray-600 dark:bg-gray-200 focus:outline-none",
  checkBoxLabel: "text-sm space-x-1 flex items-center",
};

export const MuteAll = () => {
  const roles = useHMSStore(selectAvailableRoleNames);
  const hmsActions = useHMSActions();
  const [showModal, setShowModal] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [type, setType] = useState();
  const [role, setRole] = useState();
  const [source, setSource] = useState();
  const [error, setError] = useState("");

  const muteAll = useCallback(async () => {
    if (!type && !source && !role) {
      setError("Please select one of role, type or source");
      return;
    }
    setError("");
    await hmsActions.setRemoteTracksEnabled({
      enabled,
      type: type,
      source,
      roles: role ? [role] : undefined,
    });
    setShowModal(false);
  }, [role, enabled, type, source]); //eslint-disable-line

  const resetState = () => {
    setEnabled(false);
    setType("");
    setSource("");
    setError("");
  };

  return (
    <Fragment>
      {showModal && (
        <MessageModal
          show
          onClose={() => {
            setShowModal(false);
            resetState();
          }}
          title="Mute/Unmute Remote Tracks"
          body={
            <form className={defaultClasses.form}>
              <div className={defaultClasses.formItem}>
                <div className={defaultClasses.label}>Roles</div>
                <select
                  className={defaultClasses.input}
                  onChange={event => {
                    setRole(event.currentTarget.value);
                    setError("");
                  }}
                >
                  <option value="">Select Role</option>
                  {roles.map(role => {
                    return (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className={defaultClasses.formItem}>
                <div className={defaultClasses.label}>Track Type</div>
                <select
                  className={defaultClasses.input}
                  onChange={event => {
                    setType(event.currentTarget.value);
                    setError("");
                  }}
                >
                  <option value="">Select track type</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              <div className={defaultClasses.formItem}>
                <div className={defaultClasses.label}>Track Source</div>
                <select
                  className={defaultClasses.input}
                  onChange={event => {
                    setSource(event.currentTarget.value);
                    setError("");
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
                  onChange={() => setEnabled(prev => !prev)}
                  checked={enabled}
                />
                <span>Enabled</span>
              </label>
              <label className="text-yellow-500 mt-2">{error}</label>
            </form>
          }
          footer={
            <Button variant="emphasized" onClick={muteAll}>
              Apply
            </Button>
          }
        />
      )}
      <Button
        variant="standard"
        key="muteAll"
        onClick={() => {
          setShowModal(true);
          resetState();
        }}
        classes={{ root: "mr-2" }}
      >
        Mute/Unmute All
      </Button>
    </Fragment>
  );
};
