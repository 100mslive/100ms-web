import React, { useCallback, useEffect, useState } from "react";
import { useMedia } from "react-use";
import {
  ChevronLeftIcon,
  CrossIcon,
  GridFourIcon,
  NotificationsIcon,
  SettingsIcon,
} from "@100mslive/react-icons";
import {
  Box,
  config as cssConfig,
  Dialog,
  Flex,
  IconButton,
  Tabs,
  Text,
} from "@100mslive/react-ui";
import DeviceSettings from "./DeviceSettings";
import { LayoutSettings } from "./LayoutSettings";
import { NotificationSettings } from "./NotificationSettings";
import { settingContent } from "./common.js";

const SettingsModal = ({ open, onOpenChange, children }) => {
  const mediaQueryLg = cssConfig.media.md;
  const isMobile = useMedia(mediaQueryLg);
  const [selection, setSelection] = useState("");
  const resetSelection = useCallback(() => {
    setSelection("");
  }, []);

  useEffect(() => {
    setSelection(isMobile ? "" : "devices");
  }, [isMobile]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          css={{
            w: "min(800px, 90%)",
            height: "min(656px, 90%)",
            p: 0,
            r: "$4",
          }}
        >
          <Tabs.Root
            value={selection}
            activationMode={isMobile ? "manual" : "automatic"}
            onValueChange={setSelection}
            css={{ size: "100%", position: "relative" }}
          >
            <Tabs.List
              css={{
                w: isMobile ? "100%" : "18.625rem",
                flexDirection: "column",
                bg: "$backgroundDefault",
                p: "$14 $10",
                borderTopLeftRadius: "$4",
                borderBottomLeftRadius: "$4",
              }}
            >
              <Text variant="h5">Settings </Text>
              <Flex
                direction="column"
                css={{ mx: isMobile ? "-$8" : 0, overflowY: "auto" }}
              >
                <Tabs.Trigger
                  value="devices"
                  css={{ gap: "$8", mt: "$10", mb: "$4" }}
                >
                  <SettingsIcon />
                  Device Settings
                </Tabs.Trigger>
                <Tabs.Trigger value="notifications" css={{ gap: "$8" }}>
                  <NotificationsIcon />
                  Notifications
                </Tabs.Trigger>
                <Tabs.Trigger value="layout" css={{ gap: "$8" }}>
                  <GridFourIcon />
                  Layout
                </Tabs.Trigger>
              </Flex>
            </Tabs.List>
            {selection && (
              <Flex
                direction="column"
                css={{
                  flex: "1 1 0",
                  minWidth: 0,
                  mr: "$4",
                  ...(isMobile
                    ? {
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bg: "$surfaceDefault",
                        width: "100%",
                        height: "100%",
                      }
                    : {}),
                }}
              >
                <Tabs.Content value="devices" className={settingContent()}>
                  <SettingsContentHeader
                    onBack={resetSelection}
                    isMobile={isMobile}
                  >
                    Device Settings
                  </SettingsContentHeader>
                  <DeviceSettings />
                </Tabs.Content>
                <Tabs.Content
                  value="notifications"
                  className={settingContent()}
                >
                  <SettingsContentHeader
                    onBack={resetSelection}
                    isMobile={isMobile}
                  >
                    Notifications
                  </SettingsContentHeader>
                  <NotificationSettings />
                </Tabs.Content>
                <Tabs.Content value="layout" className={settingContent()}>
                  <SettingsContentHeader
                    onBack={resetSelection}
                    isMobile={isMobile}
                  >
                    Layout
                  </SettingsContentHeader>
                  <LayoutSettings />
                </Tabs.Content>
              </Flex>
            )}
          </Tabs.Root>
          <Dialog.Close
            css={{ position: "absolute", right: "$10", top: "$10" }}
          >
            <IconButton as="div" data-testid="dialog_cross_icon">
              <CrossIcon />
            </IconButton>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const SettingsContentHeader = ({ children, isMobile, onBack }) => {
  return (
    <Text
      variant="h6"
      css={{ mb: "$12", display: "flex", alignItems: "center" }}
    >
      {isMobile && (
        <Box
          as="span"
          css={{ bg: "$surfaceLight", mr: "$4", r: "$round", p: "$2" }}
          onClick={onBack}
        >
          <ChevronLeftIcon />
        </Box>
      )}
      {children}
    </Text>
  );
};

export default SettingsModal;
