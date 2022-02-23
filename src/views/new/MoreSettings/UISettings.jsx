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
        <DialogRow css={cssStyle}>
          <Text variant="h5" css={{ mb: "$8" }}>
            Participants In View
          </Text>
          <Slider
            step={1}
            value={[maxTileCount]}
            onValueChange={e => {
              setMaxTileCount(e[0]);
            }}
          />
        </DialogRow>
        <DialogRow css={cssStyle}>
          <Text variant="h5" css={{ mb: "$8" }}>
            Receive notifications for
          </Text>
          {Object.keys(subscribedNotifications).map(type => {
            return (
              <Flex align="center" key={type}>
                <Checkbox.Root
                  id={type}
                  checked={subscribedNotifications[type]}
                  onCheckedChange={value => {
                    setSubscribedNotifications({
                      type,
                      isSubscribed: value,
                    });
                  }}
                >
                  <Checkbox.Indicator>
                    <CheckIcon width={16} height={16} />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <Label htmlFor={type} css={{ ml: "$4" }}>
                  {type
                    .toLowerCase()
                    .split("_")
                    .map(
                      name =>
                        `${name.charAt(0).toUpperCase()}${name.substring(1)}`
                    )
                    .join(" ")}
                </Label>
              </Flex>
            );
          })}
        </DialogRow>
        <DialogRow css={cssStyle}>
          <Text variant="h5" css={{ mb: "$8" }}>
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
            <Label htmlFor="viewMode" css={{ ml: "$4" }}>
              Active Speaker Mode
            </Label>
          </Flex>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
};
