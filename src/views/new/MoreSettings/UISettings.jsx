import React, { useContext } from "react";
import { CheckIcon } from "@100mslive/react-icons";
import {
  Flex,
  Checkbox,
  Dialog,
  Label,
  Slider,
  Text,
} from "@100mslive/react-ui";
import { DialogContent, DialogRow } from "../DialogContent";
import { AppContext } from "../../../store/AppContext";

const cssStyle = {
  flexDirection: "column",
  alignItems: "flex-start",
  maxWidth: "70%",
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
      <Label htmlFor={label} css={{ ml: "$4", fontSize: "$sm" }}>
        {label}
      </Label>
    </Flex>
  );
};

export const UISettings = ({ show, onToggle }) => {
  const {
    setMaxTileCount,
    maxTileCount,
    subscribedNotifications,
    setSubscribedNotifications,
    uiViewMode,
    setuiViewMode,
  } = useContext(AppContext);
  return (
    <Dialog.Root open={show} onOpenChange={onToggle}>
      <DialogContent title="UI Settings">
        <DialogRow>
          <Text variant="md">Tiles In View</Text>
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
        </DialogRow>
        <DialogRow css={cssStyle}>
          <Text variant="md" css={{ mb: "$8" }}>
            Configure Notifications
          </Text>
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
        </DialogRow>
        <DialogRow css={cssStyle}>
          <Text variant="md" css={{ mb: "$8" }}>
            View Layout
          </Text>
          <Flex align="center">
            <Checkbox.Root
              id="viewMode"
              checked={uiViewMode === "activeSpeaker"}
              onCheckedChange={value => {
                setuiViewMode(value ? "activeSpeaker" : "grid");
              }}
            >
              <Checkbox.Indicator>
                <CheckIcon width={16} height={16} />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <Label htmlFor="viewMode" css={{ ml: "$4", fontSize: "$sm" }}>
              Active Speaker Mode
            </Label>
          </Flex>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
};
