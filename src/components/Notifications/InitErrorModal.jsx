import React, { useEffect, useState } from "react";
import { Text } from "@100mslive/react-ui";
import { ErrorDialog } from "../../primitives/DialogContent";

export const InitErrorModal = ({ notification }) => {
  const [showModal, setShowModal] = useState(false);
  const [info, setInfo] = useState({ title: "Init Error", description: "" });

  useEffect(() => {
    const data = notification?.data;
    if (!data || data.action !== "INIT") {
      return;
    }
    let description;
    let title;
    if (data.description.includes("role is invalid")) {
      description =
        "This role does not exist for the given room. Try again with a valid role.";
      title = "Invalid Role";
    } else if (data.description.includes("room is not active")) {
      title = "Room is disabled";
      description =
        "This room is disabled and cannot be joined. To enable the room, use the 100ms dashboard or the API.";
    } else {
      description = data.description;
      title = "Init Error";
    }
    setInfo({ title, description });
    setShowModal(true);
  }, [notification]);

  return (
    <ErrorDialog
      open={showModal}
      onOpenChange={setShowModal}
      title={info.title}
    >
      <Text variant="sm" css={{ wordBreak: "break-word" }}>
        {info.description} <br />
        Current URL - {window.location.href}
      </Text>
    </ErrorDialog>
  );
};
