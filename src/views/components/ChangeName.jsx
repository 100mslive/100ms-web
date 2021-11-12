import React from "react";
import { Button, MessageModal, Text } from "@100mslive/hms-video-react";

const defaultClasses = {
  formInner: "w-full flex flex-col md:flex-row my-1.5",
  selectLabel: "w-full md:w-1/3 flex justify-start md:justify-end items-center",
  selectContainer:
    "rounded-lg w-full md:w-1/2 bg-gray-600 dark:bg-gray-200 p-2 mx-0 my-2 md:my-0 md:mx-2",
  select:
    "rounded-lg w-full h-full bg-gray-600 dark:bg-gray-200 focus:outline-none",
};

const ChangeNameFrom = ({ newName, setNewName }) => {
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
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export const ChangeName = ({
  currentName,
  setCurrentName,
  changeName,
  showChangeNameModal,
  setShowChangeNameModal,
}) => (
  <MessageModal
    title="Change my name"
    body={<ChangeNameFrom newName={currentName} setNewName={setCurrentName} />}
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
