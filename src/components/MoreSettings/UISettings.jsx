import React, { useContext } from "react";
import { CheckIcon, GridIcon } from "@100mslive/react-icons";
import {
  Flex,
  Checkbox,
  Dialog,
  Label,
  Slider,
  Text,
  Box,
  HorizontalDivider,
} from "@100mslive/react-ui";
import {
  DialogCheckbox,
  DialogContent,
  DialogRow,
} from "../../primitives/DialogContent";
import { AppContext } from "../context/AppContext";

const cssStyle = {
  flexDirection: "column",
  alignItems: "flex-start",
};

const NotificationItem = ({ onClick, type, label, checked }) => {
  return (
    <Flex align="center" key={type} css={{ my: "$2" }}>
      <Checkbox.Root
        id={label}
        checked={checked}
        onCheckedChange={value => {
          onClick({
            type,
            isSubscribed: value,
          });
        }}
      >
        <Checkbox.Indicator>
          <CheckIcon width={16} height={16} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <Label
        htmlFor={label}
        css={{ ml: "$4", fontSize: "$sm", cursor: "pointer" }}
      >
        {label}
      </Label>
    </Flex>
  );
};

export const UISettings = ({ open, onOpenChange }) => {
  const {
    setMaxTileCount,
    maxTileCount,
    subscribedNotifications,
    setSubscribedNotifications,
    uiViewMode,
    setuiViewMode,
    isAudioOnly,
    setIsAudioOnly,
  } = useContext(AppContext);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <DialogContent title="UI Settings" Icon={GridIcon}>
        <DialogRow css={cssStyle}>
          <Text variant="md" css={{ mb: "$8", fontWeight: "$semiBold" }}>
            Configure Notifications
          </Text>
          <Flex justify="between" css={{ w: "100%" }}>
            <Box css={{ flex: "1 1 0" }}>
              <NotificationItem
                label="Peer Joined"
                type="PEER_JOINED"
                onClick={setSubscribedNotifications}
                checked={subscribedNotifications.PEER_JOINED}
              />
              <NotificationItem
                label="Peer Leave"
                type="PEER_LEFT"
                onClick={setSubscribedNotifications}
                checked={subscribedNotifications.PEER_LEFT}
              />
              <NotificationItem
                label="New Message"
                type="NEW_MESSAGE"
                onClick={setSubscribedNotifications}
                checked={subscribedNotifications.NEW_MESSAGE}
              />
            </Box>
            <Box css={{ flex: "1 1 0", ml: "$4" }}>
              <NotificationItem
                label="Error"
                type="ERROR"
                onClick={setSubscribedNotifications}
                checked={subscribedNotifications.ERROR}
              />
              <NotificationItem
                label="Hand Raised"
                type="METADATA_UPDATED"
                onClick={setSubscribedNotifications}
                checked={subscribedNotifications.METADATA_UPDATED}
              />
            </Box>
          </Flex>
        </DialogRow>
        <HorizontalDivider />
        <DialogRow css={cssStyle}>
          <Text variant="md" css={{ mb: "$4", fontWeight: "$semiBold" }}>
            View Layout
          </Text>
          <DialogCheckbox
            title="Active Speaker Mode"
            id="activeSpeakerMode"
            value={uiViewMode === "activeSpeaker"}
            onChange={value => {
              setuiViewMode(value ? "activeSpeaker" : "grid");
            }}
            css={{ margin: "0 0" }}
          />
          <DialogCheckbox
            title="Audio Only Mode"
            id="audioOnlyMode"
            value={isAudioOnly}
            onChange={value => {
              setIsAudioOnly(value);
            }}
            css={{ margin: "$4 0" }}
          />
          <Flex css={{ w: "100%", "@md": { display: "none" } }}>
            <Text variant="md">Tiles In View</Text>
            <Flex justify="end" css={{ flex: "1 1 0" }}>
              <Slider
                step={1}
                value={[maxTileCount]}
                min={1}
                max={49}
                onValueChange={e => {
                  setMaxTileCount(e[0]);
                }}
                css={{ w: "70%" }}
              />
            </Flex>
          </Flex>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
};
