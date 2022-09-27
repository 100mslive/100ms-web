import { useEffect, useRef } from "react";

export const useEmojiPickerStyles = showing => {
  const ref = useRef(null);
  useEffect(() => {
    if (showing) {
      setTimeout(() => {
        const root = ref.current?.querySelector("em-emoji-picker").shadowRoot;
        const style = document.createElement("style");
        style.textContent = `
          #root {
            --em-rgb-color: var(--hms-ui-colors-textPrimary);
            --color-b: var(--hms-ui-colors-textPrimary);
            --rgb-background: transparent;
            color: var(--hms-ui-colors-textPrimary);
            font-family: var(--hms-ui-fonts-sans);
          }
          .sticky {
            background-color: var(--hms-ui-colors-surfaceLight);
          }
        `;
        root.appendChild(style);
      }, 0);
    }
  }, [showing]);

  return ref;
};
