import { Fragment } from "react";
import {
  selectIsAllowedToPublish,
  useHMSStore,
  useScreenShare,
} from "@100mslive/react-sdk";
import { ShareScreenIcon } from "@100mslive/react-icons";
import { Box, Flex, styled, Tooltip } from "@100mslive/roomkit-react";
import { ShareScreenOptions } from "./pdfAnnotator/shareScreenOptions";
import IconButton from "../IconButton";
import {
  useResetEmbedConfig,
  useResetPDFConfig,
  useUISettings,
} from "./AppData/useUISettings";
import { isScreenshareSupported } from "../common/utils";
import { UI_SETTINGS } from "../common/constants";

export const ScreenshareToggle = ({ css = {} }) => {
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const isAudioOnly = useUISettings(UI_SETTINGS.isAudioOnly);

  const {
    amIScreenSharing,
    screenShareVideoTrackId: video,
    toggleScreenShare,
  } = useScreenShare();
  const resetConfig = useResetPDFConfig();
  const embedResetConfig = useResetEmbedConfig();

  const isVideoScreenshare = amIScreenSharing && !!video;
  if (!isAllowedToPublish.screen || !isScreenshareSupported()) {
    return null;
  }

  return (
    <Fragment>
      <Flex direction="row">
        <ScreenShareButton
          variant="standard"
          key="ShareScreen"
          active={!isVideoScreenshare}
          css={css}
          disabled={isAudioOnly}
          onClick={async () => {
            await toggleScreenShare();
            resetConfig();
            embedResetConfig();
          }}
        >
          <Tooltip
            title={`${!isVideoScreenshare ? "Start" : "Stop"} screen sharing`}
          >
            <Box>
              <ShareScreenIcon />
            </Box>
          </Tooltip>
        </ScreenShareButton>
        <ShareScreenOptions />
      </Flex>
    </Fragment>
  );
};

const ScreenShareButton = styled(IconButton, {
  h: "$14",
  px: "$8",
  r: "$1",
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  "@md": {
    px: "$4",
    mx: 0,
  },
});

export const ShareMenuIcon = styled(ScreenShareButton, {
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  borderTopRightRadius: "$1",
  borderBottomRightRadius: "$1",
  borderLeftWidth: 0,
  w: "$4",
  "@md": {
    px: "$2",
  },
});
