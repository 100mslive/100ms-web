import React, { useState, useEffect } from "react";
import { Dialog, Text } from "@100mslive/react-ui";

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
        "The role does not exist for the given room. Try again with valid role.";
      title = "Invalid Role";
    } else {
      description = data.description;
      title = "Init Error";
    }
    setInfo({ title, description });
    setShowModal(true);
  }, [notification]);

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <Dialog.Content
        title={info.title}
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
        onPointerDownOutside={e => e.preventDefault()}
        close={info.title !== "Invalid Role"}
      >
        <Text variant="sm" css={{ wordBreak: "break-all" }}>
          {info.description}
          <br />
          {window.location.href}
        </Text>
      </Dialog.Content>
    </Dialog>
  );
};
