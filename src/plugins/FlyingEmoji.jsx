import { useCallback, useEffect, useState } from "react";
import { useMedia } from "react-use";
import {
  selectLocalPeerID,
  selectPeerNameByID,
  useHMSStore,
  useHMSVanillaStore,
} from "@100mslive/react-sdk";
import {
  Box,
  config as cssConfig,
  Flex,
  keyframes,
  Text,
} from "@100mslive/react-ui";

let emojiCount = 1;

const flyAndFade = keyframes({
  "20%": { opacity: 1 },
  "100%": { bottom: "70%", opacity: 0 },
});

const wiggleLeftRight = keyframes({
  "0%": { marginLeft: "-50px" },
  "100%": { marginLeft: "50px" },
});

const wiggleRightLeft = keyframes({
  "0%": { marginLeft: "50px" },
  "100%": { marginLeft: "-50px" },
});

export function FlyingEmoji() {
  const localPeerId = useHMSStore(selectLocalPeerID);
  const vanillaStore = useHMSVanillaStore();
  const [emojis, setEmojis] = useState([]);
  const isMobile = useMedia(cssConfig.media.md);

  const showFlyingEmoji = useCallback(
    (emojiId, senderPeerId) => {
      if (!emojiId || !senderPeerId || document.hidden) {
        return;
      }
      const senderPeerName = vanillaStore.getState(
        selectPeerNameByID(senderPeerId)
      );
      const nameToShow = localPeerId === senderPeerId ? "You" : senderPeerName;

      setEmojis(emojis => {
        return [
          ...emojis,
          {
            id: emojiCount++,
            emojiId: emojiId,
            senderName: nameToShow,
            startingPoint: `${5 + Math.random() * (isMobile ? 40 : 20)}%`,
            wiggleType: Math.random() < 0.5 ? 0 : 1,
          },
        ];
      });
    },
    [localPeerId, vanillaStore, isMobile]
  );

  useEffect(() => {
    window.showFlyingEmoji = showFlyingEmoji;
  }, [showFlyingEmoji]);

  return (
    <Box
      css={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 999,
      }}
    >
      {emojis.map(emoji => {
        return (
          <Flex
            key={emoji.id}
            css={{
              left: emoji.startingPoint,
              flexDirection: "column",
              alignItems: "center",
              position: "absolute",
              bottom: 0,
              animation: `${flyAndFade()} 3s forwards, ${
                emoji.wiggleType === 0 ? wiggleLeftRight() : wiggleRightLeft()
              } 1s ease-in-out infinite alternate`,
            }}
            onAnimationEnd={() => {
              setEmojis(emojis.filter(item => item.id !== emoji.id));
            }}
          >
            <Box>
              <em-emoji id={emoji.emojiId} size="56px" set="apple"></em-emoji>
            </Box>
            <Box
              css={{
                width: "fit-content",
                padding: "$2 $4",
                background: "$surfaceLight",
                borderRadius: "$1",
              }}
            >
              <Text
                css={{
                  fontSize: "$space$6",
                  lineHeight: "$xs",
                  color: "$textHighEmp",
                }}
              >
                {emoji.senderName}
              </Text>
            </Box>
          </Flex>
        );
      })}
    </Box>
  );
}
