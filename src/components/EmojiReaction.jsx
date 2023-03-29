import React, { Fragment, useCallback, useMemo, useState } from "react";
import data from "@emoji-mart/data/sets/14/apple.json";
import { init } from "emoji-mart";
import {
  selectAvailableRoleNames,
  selectLocalPeerRoleName,
  useCustomEvent,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import { EmojiIcon } from "@100mslive/react-icons";
import {
  Box,
  Dropdown,
  Flex,
  styled,
  Text,
  Tooltip,
} from "@100mslive/react-ui";
import IconButton from "../IconButton";
import { useHLSViewerRole } from "./AppData/useUISettings";
import { HLS_TIMED_METADATA_DOC_URL } from "../common/constants";

init({ data });
const emojiReactionList = [
  [
    { emojiId: "+1" },
    { emojiId: "-1" },
    { emojiId: "wave" },
    { emojiId: "clap" },
    { emojiId: "fire" },
  ],
  [
    { emojiId: "tada" },
    { emojiId: "heart_eyes" },
    { emojiId: "joy" },
    { emojiId: "open_mouth" },
    { emojiId: "sob" },
  ],
];

export const EmojiReaction = () => {
  const [open, setOpen] = useState(false);
  const hmsActions = useHMSActions();
  const roles = useHMSStore(selectAvailableRoleNames);
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const hlsViewerRole = useHLSViewerRole();
  const { isStreamingOn } = useRecordingStreaming();
  const filteredRoles = useMemo(
    () => roles.filter(role => role !== hlsViewerRole),
    [roles, hlsViewerRole]
  );

  const onEmojiEvent = useCallback(data => {
    window.showConfettiUsingEmojiId(data.emojiId);
  }, []);

  const { sendEvent } = useCustomEvent({
    type: "EMOJI_REACTION",
    onEvent: onEmojiEvent,
  });

  const sendReaction = async emojiId => {
    const data = { type: "EMOJI_REACTION", emojiId: emojiId };
    sendEvent(data, { roleNames: filteredRoles });
    if (isStreamingOn) {
      await hmsActions.sendHLSTimedMetadata([
        {
          payload: JSON.stringify(data),
          duration: 2,
        },
      ]);
    }
  };
  if (localPeerRole === hlsViewerRole) {
    return null;
  }
  return (
    <Fragment>
      <Dropdown.Root open={open} onOpenChange={setOpen}>
        <Dropdown.Trigger asChild data-testid="emoji_reaction_btn">
          <IconButton>
            <Tooltip title="Emoji reaction">
              <Box>
                <EmojiIcon />
              </Box>
            </Tooltip>
          </IconButton>
        </Dropdown.Trigger>
        <Dropdown.Content
          sideOffset={5}
          align="center"
          css={{ p: "$8", bg: "$surfaceDefault" }}
        >
          {emojiReactionList.map((emojiLine, index) => (
            <Flex key={index} justify="between" css={{ mb: "$8" }}>
              {emojiLine.map(emoji => (
                <EmojiContainer
                  key={emoji.emojiId}
                  onClick={() => sendReaction(emoji.emojiId)}
                >
                  <em-emoji
                    id={emoji.emojiId}
                    size="100%"
                    set="apple"
                  ></em-emoji>
                </EmojiContainer>
              ))}
            </Flex>
          ))}
          <div style={{ textAlign: "center" }}>
            <Text
              variant="sm"
              inline={true}
              css={{
                color: "$textAccentMedium",
              }}
            >
              Reactions will be timed for Live Streaming viewers.{" "}
            </Text>
            <Text
              variant="sm"
              inline={true}
              css={{
                color: "$primaryLight",
                fontWeight: "$semiBold",
              }}
            >
              <a
                href={HLS_TIMED_METADATA_DOC_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {"Learn more ->"}
              </a>
            </Text>
          </div>
        </Dropdown.Content>
      </Dropdown.Root>
    </Fragment>
  );
};

const EmojiContainer = styled("span", {
  position: "relative",
  cursor: "pointer",
  width: "$16",
  height: "$16",
  p: "$4",
  "&:hover": {
    p: "7px",
    bg: "$surfaceLighter",
    borderRadius: "$1",
  },
});
