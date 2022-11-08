import React, { useState } from "react";
import { ViewIcon } from "@100mslive/react-icons";
import { Button, Dialog, Dropdown, Text } from "@100mslive/react-ui";
import {
  DialogContent,
  DialogInput,
  DialogRow,
} from "../../primitives/DialogContent";
import { useSetAppDataByKey } from "../AppData/useUISettings";
import { APP_DATA } from "../../common/constants";

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
  const [embedConfig, setEmbedConfig] = useSetAppDataByKey(
    APP_DATA.embedConfig
  );
  const [url, setUrl] = useState(embedConfig?.url || "");

  const isAnythingEmbedded = !!embedConfig?.url;
  const isModifying = isAnythingEmbedded && url && url !== embedConfig.url;

  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <DialogContent title="Embed URL" Icon={ViewIcon}>
        <DialogInput
          title="URL"
          value={url}
          onChange={setUrl}
          placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
          type="url"
        />
        <DialogRow>
          <Text>
            Embed a url and share with everyone in the room. Ensure that you're
            sharing the current tab when the prompt opens. Note that not all
            websites support being embedded.
          </Text>
        </DialogRow>
        <DialogRow justify="end">
          {isAnythingEmbedded ? (
            <>
              <Button
                variant="primary"
                type="submit"
                disabled={!isModifying}
                onClick={() => {
                  setEmbedConfig({ url, shareScreen: embedConfig.shareScreen });
                  onOpenChange(false);
                }}
                data-testid="embed_url_btn"
                css={{ mr: "$4" }}
              >
                Update Embed
              </Button>
              <Button
                variant="danger"
                type="submit"
                onClick={() => {
                  setEmbedConfig({ url: "" });
                  onOpenChange(false);
                }}
                data-testid="embed_url_btn"
              >
                Stop Embed
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                type="submit"
                disabled={!url.trim()}
                onClick={() => {
                  setEmbedConfig({ url });
                  onOpenChange(false);
                }}
                data-testid="embed_url_btn"
                css={{ mr: "$4" }}
              >
                Just Embed
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={!url.trim()}
                onClick={() => {
                  setEmbedConfig({ url, shareScreen: true });
                  onOpenChange(false);
                }}
                data-testid="embed_url_btn"
              >
                Embed and Share
              </Button>
            </>
          )}
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
}
