import React, { useState, useEffect } from "react";
import { Text } from "@100mslive/react-ui";
import { ErrorDialog } from "../../new/DialogContent";

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
      <Text variant="sm" css={{ wordBreak: "break-all" }}>
        {info.description} Current URL - {window.location.href}
      </Text>
    </ErrorDialog>
  );
};
