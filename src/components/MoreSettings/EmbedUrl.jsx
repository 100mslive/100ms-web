import React, { useState } from "react";
import { useScreenShare } from "@100mslive/react-sdk";
import { ViewIcon } from "@100mslive/react-icons";
import { Button, Dialog, Dropdown, Text } from "@100mslive/roomkit-react";
import {
  DialogContent,
  DialogInput,
  DialogRow,
} from "../../primitives/DialogContent";
import {
  useResetEmbedConfig,
  useSetAppDataByKey,
} from "../AppData/useUISettings";
import { APP_DATA } from "../../common/constants";

export const EmbedUrl = ({ setShowOpenUrl }) => {
  const { amIScreenSharing } = useScreenShare();
  if (!window.CropTarget) {
    return null;
  }
  return (
    <Dropdown.Item
      css={{ "&:hover": { backgroundColor: "$surface_bright" } }}
      onClick={() => {
        if (!amIScreenSharing) {
          setShowOpenUrl(true);
        }
      }}
      disabled={amIScreenSharing}
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
  const [url, setUrl] = useState(embedConfig || "");

  const isAnythingEmbedded = !!embedConfig;
  const isModifying = isAnythingEmbedded && url && url !== embedConfig;
  const resetConfig = useResetEmbedConfig();
  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <DialogContent title="Embed URL" Icon={ViewIcon}>
        <DialogInput
          title="URL"
          value={url}
          onChange={setUrl}
          placeholder="https://www.tldraw.com/"
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
                  setEmbedConfig(url);
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
                  resetConfig();
                  onOpenChange(false);
                }}
                data-testid="embed_url_btn"
              >
                Stop Embed
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              type="submit"
              disabled={!url.trim()}
              onClick={() => {
                setEmbedConfig(url);
                onOpenChange(false);
              }}
              data-testid="embed_url_btn"
            >
              Embed and Share
            </Button>
          )}
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
}
