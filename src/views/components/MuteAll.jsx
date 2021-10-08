import React, { useCallback, useState } from "react";
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

export const MuteAll = ({ showModal, onCloseModal }) => {
  const roles = useHMSStore(selectAvailableRoleNames);
  const hmsActions = useHMSActions();
  const [enabled, setEnabled] = useState(false);
  const [type, setType] = useState();
  const [role, setRole] = useState();
  const [source, setSource] = useState();

  const muteAll = useCallback(async () => {
    await hmsActions.setRemoteTracksEnabled({
      enabled,
      type,
      source,
      roles: role ? [role] : undefined,
    });
    onCloseModal();
  }, [role, enabled, type, source]); //eslint-disable-line

  const resetState = () => {
    setEnabled(false);
    setType("");
    setSource("");
  };

  return (
    <MessageModal
      show={showModal}
      onClose={() => {
        onCloseModal();
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
              }}
            >
              <option value="">Select track source</option>
              <option value="regular">Regular</option>
              <option value="screen">Screen</option>
              <option value="audioplaylist">Audio Playlist</option>
              <option value="videoplaylist">Video Playlist</option>
            </select>
          </div>
          <div className={defaultClasses.formItem}>
            <div className={defaultClasses.label}>Enabled</div>
            <label className={defaultClasses.checkBoxLabel}>
              <input
                type="checkbox"
                onChange={() => setEnabled(prev => !prev)}
                checked={enabled}
              />
              <span></span>
            </label>
          </div>
        </form>
      }
      footer={
        <Button variant="emphasized" onClick={muteAll}>
          Apply
        </Button>
      }
    />
  );
};
