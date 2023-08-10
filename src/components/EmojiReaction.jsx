import React, { Fragment, useCallback, useMemo, useState } from "react";
import data from "@emoji-mart/data/sets/14/apple.json";
import { init } from "emoji-mart";
import {
  selectAvailableRoleNames,
  selectIsConnectedToRoom,
  selectLocalPeerID,
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
} from "@100mslive/roomkit-react";
import IconButton from "../IconButton";
import { useHLSViewerRole } from "./AppData/useUISettings";
import { useDropdownList } from "./hooks/useDropdownList";
import { useIsFeatureEnabled } from "./hooks/useFeatures";
import {
  EMOJI_REACTION_TYPE,
  FEATURE_LIST,
  HLS_TIMED_METADATA_DOC_URL,
} from "../common/constants";

init({ data });

// When changing emojis in the grid, keep in mind that the payload used in sendHLSTimedMetadata has a limit of 100 characters. Using bigger emoji Ids can cause the limit to be exceeded.
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
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const roles = useHMSStore(selectAvailableRoleNames);
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const localPeerId = useHMSStore(selectLocalPeerID);
  const hlsViewerRole = useHLSViewerRole();
  const { isStreamingOn } = useRecordingStreaming();
  const isFeatureEnabled = useIsFeatureEnabled(FEATURE_LIST.EMOJI_REACTION);
  const filteredRoles = useMemo(
    () => roles.filter(role => role !== hlsViewerRole),
    [roles, hlsViewerRole]
  );
  useDropdownList({ open: open, name: "EmojiReaction" });

  const onEmojiEvent = useCallback(data => {
    window.showFlyingEmoji(data?.emojiId, data?.senderId);
  }, []);

  const { sendEvent } = useCustomEvent({
    type: EMOJI_REACTION_TYPE,
    onEvent: onEmojiEvent,
  });

  const sendReaction = async emojiId => {
    const data = {
      type: EMOJI_REACTION_TYPE,
      emojiId: emojiId,
      senderId: localPeerId,
    };
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

  if (!isConnected || localPeerRole === hlsViewerRole || !isFeatureEnabled) {
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
          css={{ p: "$8", bg: "$surface_default" }}
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
                color: "$on_surface_medium",
              }}
            >
              Reactions will be timed for Live Streaming viewers.{" "}
            </Text>
            <Text
              variant="sm"
              inline={true}
              css={{
                color: "$primary_bright",
                fontWeight: "$semiBold",
              }}
            >
              <a
                href={HLS_TIMED_METADATA_DOC_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Learn more
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
    bg: "$surface_brighter",
    borderRadius: "$1",
  },
});
