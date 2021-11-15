import React, { useState } from "react";
import {
  Button,
  MessageModal,
  Text,
  useHMSActions,
} from "@100mslive/hms-video-react";
import { hmsToast } from "./notifications/hms-toast";

const defaultClasses = {
  formInner: "w-full flex flex-col md:flex-row my-1.5",
  selectLabel: "w-full md:w-1/3 flex justify-start md:justify-end items-center",
  selectContainer:
    "rounded-lg w-full md:w-1/2 bg-gray-600 dark:bg-gray-200 p-2 mx-0 my-2 md:my-0 md:mx-2",
  select:
    "rounded-lg w-full h-full bg-gray-600 dark:bg-gray-200 focus:outline-none",
};

const ChangeNameForm = ({ currentName, setCurrentName }) => {
  return (
    <div>
      <form>
        <div className={defaultClasses.formInner}>
          <div className={defaultClasses.selectLabel}>
            <Text variant="heading" size="sm">
              Name:
            </Text>
          </div>

          <div className={defaultClasses.selectContainer}>
            <input
              type="text"
              className={defaultClasses.select}
              value={currentName}
              onChange={e => setCurrentName(e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export const ChangeName = ({ showChangeNameModal, setShowChangeNameModal }) => {
  const hmsActions = useHMSActions();
  const [currentName, setCurrentName] = useState("");

  const changeName = async () => {
    try {
      await hmsActions.updatePeer({
        name: currentName,
      });
    } catch (error) {
      console.error("failed to update name", error);
      hmsToast(error.message);
    } finally {
      setShowChangeNameModal(false);
      setCurrentName("");
    }
  };

  return (
    <MessageModal
      title="Change my name"
      body={
        <ChangeNameForm
          currentName={currentName}
          setCurrentName={setCurrentName}
        />
      }
      footer={
        <Button
          variant="emphasized"
          shape="rectangle"
          onClick={changeName}
          disabled={currentName.length < 1}
        >
          Change
        </Button>
      }
      show={showChangeNameModal}
      onClose={() => setShowChangeNameModal(false)}
    />
  );
};
