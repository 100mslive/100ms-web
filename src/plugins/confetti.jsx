import { useCallback, useEffect } from "react";
import { useMedia } from "react-use";
import JSConfetti from "js-confetti";
import { useCustomEvent } from "@100mslive/react-sdk";

const jsConfetti = new JSConfetti();
const confettiMsgType = "CONFETTI";

const emojiCollections = {
  hearts: ["❤️", "😍", "♥️"],
  birthday: ["🎂", "🍰", "🎁"],
  yes: ["🙌", "✨", "🔥", "❤️"],
  no: ["🙅", "⛔", "❌"],
};

/**
 * This component shows a reference implementation of using [custom events](https://www.100ms.live/docs/javascript/v2/features/chat#custom-events).
 * One downside of the current implementation is that it doesn't take into account tab not in focus.
 * In this case multiple messages might accumulate leading to a lot of confetti when user comes back on the tab.
 */
export function Confetti() {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  const disableMotion = useMedia("(prefers-reduced-motion: reduce)");

  const onConfettiMsg = useCallback(
    config => {
      if (!disableMotion) {
        jsConfetti.addConfetti(config);
      }
    },
    [disableMotion]
  );

  const { sendEvent } = useCustomEvent({
    type: confettiMsgType,
    onEvent: onConfettiMsg,
  });

  // e.g. sendConfetti(), sendConfetti({type: "hearts"}), sendConfetti({emojis: ["🔥"]})
  const sendConfetti = useCallback(
    ({ type, emojis } = {}) => {
      if (type && emojiCollections[type]) {
        emojis = emojiCollections[type];
      }
      sendEvent({ emojis });
    },
    [sendEvent]
  );

  // putting the function to send on window for quick access
  useEffect(() => {
    window.sendConfetti = sendConfetti;
  }, [sendConfetti]);

  return <></>;
}
