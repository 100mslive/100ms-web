import { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@100mslive/roomkit-react";

let emojiCount = 1;

const flyAndFade = keyframes({
  "20%": { opacity: 1 },
  "100%": { bottom: "60%", opacity: 0 },
});

const wiggleLeftRight = keyframes({
  "0%": { marginLeft: "-50px" },
  "100%": { marginLeft: "50px" },
});

const wiggleRightLeft = keyframes({
  "0%": { marginLeft: "50px" },
  "100%": { marginLeft: "-50px" },
});

const getStartingPoints = isMobile => {
  let arr = [];
  const min = 5;
  const max = isMobile ? 30 : 20;
  const inc = isMobile ? 8 : 5;
  for (let i = min; i <= max; i += inc) {
    arr.push(i);
  }
  return arr;
};

export function FlyingEmoji() {
  const localPeerId = useHMSStore(selectLocalPeerID);
  const vanillaStore = useHMSVanillaStore();
  const [emojis, setEmojis] = useState([]);
  const isMobile = useMedia(cssConfig.media.md);

  const startingPoints = useMemo(() => getStartingPoints(isMobile), [isMobile]);

  const showFlyingEmoji = useCallback(
    (emojiId, senderId) => {
      if (!emojiId || !senderId || document.hidden) {
        return;
      }
      const senderPeerName = vanillaStore.getState(
        selectPeerNameByID(senderId)
      );
      const nameToShow = localPeerId === senderId ? "You" : senderPeerName;
      const startingPoint = startingPoints[emojiCount % startingPoints.length];
      const id = emojiCount++;

      setEmojis(emojis => {
        return [
          ...emojis,
          {
            id: id,
            emojiId: emojiId,
            senderName: nameToShow,
            startingPoint: `${startingPoint}%`,
            wiggleType: Math.random() < 0.5 ? 0 : 1,
          },
        ];
      });
    },
    [localPeerId, vanillaStore, startingPoints]
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
              animation: `${flyAndFade()} 5s forwards, ${
                emoji.wiggleType === 0 ? wiggleLeftRight() : wiggleRightLeft()
              } 1s ease-in-out infinite alternate`,
            }}
            onAnimationEnd={() => {
              setEmojis(emojis.filter(item => item.id !== emoji.id));
            }}
          >
            <Box>
              <em-emoji id={emoji.emojiId} size="48px" set="apple"></em-emoji>
            </Box>
            <Box
              css={{
                width: "fit-content",
                padding: "$2 $4",
                background: "$surface_bright",
                borderRadius: "$1",
              }}
            >
              <Text
                css={{
                  fontSize: "$space$6",
                  lineHeight: "$xs",
                  color: "$on_surface_high",
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
