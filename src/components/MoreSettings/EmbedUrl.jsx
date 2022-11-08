import React, { useState } from "react";
import { ViewIcon } from "@100mslive/react-icons";
import { Button, Dialog, Dropdown, Text } from "@100mslive/react-ui";
import {
  DialogContent,
  DialogInput,
  DialogRow,
} from "../../primitives/DialogContent";

export const EmbedUrl = ({ setShowOpenUrl }) => {
  if (!window.CropTarget) {
    return null;
  }

  return (
    <Dropdown.Item
      onClick={() => {
        setShowOpenUrl(true);
      }}
      data-testid="embed_url_btn"
    >
      <ViewIcon />
      <Text variant="sm" css={{ ml: "$4" }}>
        Embed URL
      </Text>
    </Dropdown.Item>
  );
};

export function EmbedUrlModal({ onOpenChange }) {
  const [url, setUrl] = useState("");
  // const hmsActions = useHMSActions();

  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <DialogContent
        title="Embed URL"
        Icon={ViewIcon}
        // css={{ width: "min(700px, 100%)", height: "min(700px, 90%)" }}
      >
        <DialogInput
          title="URL"
          value={url}
          onChange={setUrl}
          placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
          type="url"
        />
        <DialogRow>
          <Text>
            Embed or update the url and share with everyone in the room. Ensure
            that you're sharing the current tab when the prompt opens. Note that
            not all websites support being embedded. If your url doesn't support
            it you would see a black screen.
          </Text>
        </DialogRow>
        <DialogRow justify="end">
          <Button
            variant="primary"
            type="submit"
            disabled={!url.trim()}
            onClick={async () => {}}
            data-testid="embed_url_btn"
          >
            Open Prompt
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
}
