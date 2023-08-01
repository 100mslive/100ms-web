import { selectIsConnectedToRoom, useHMSStore } from "@100mslive/react-sdk";
import { BrbIcon, HandIcon } from "@100mslive/react-icons";
import { Flex, Tooltip } from "@100mslive/roomkit-react";
import IconButton from "../IconButton";
import { useIsFeatureEnabled } from "./hooks/useFeatures";
import { useMyMetadata } from "./hooks/useMetadata";
import { FEATURE_LIST } from "../common/constants";

const MetaActions = ({ isMobile = false, compact = false }) => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const { isHandRaised, isBRBOn, toggleHandRaise, toggleBRB } = useMyMetadata();
  const isHandRaiseEnabled = useIsFeatureEnabled(FEATURE_LIST.HAND_RAISE);
  const isBRBEnabled = useIsFeatureEnabled(FEATURE_LIST.BRB);

  if (!isConnected || (!isHandRaiseEnabled && !isBRBEnabled)) {
    return null;
  }

  return (
    <Flex align="center" css={{ gap: compact ? "$4" : "$8" }}>
      {isHandRaiseEnabled && (
        <Tooltip title={`${!isHandRaised ? "Raise" : "Unraise"} hand`}>
          <IconButton
            onClick={toggleHandRaise}
            active={!isHandRaised}
            data-testid={isMobile ? "raise_hand_btn_mobile" : "raise_hand_btn"}
          >
            <HandIcon />
          </IconButton>
        </Tooltip>
      )}
      {isBRBEnabled && (
        <Tooltip title={isBRBOn ? `I'm back` : `I'll be right back`}>
          <IconButton
            onClick={toggleBRB}
            active={!isBRBOn}
            data-testid="brb_btn"
          >
            <BrbIcon />
          </IconButton>
        </Tooltip>
      )}
    </Flex>
  );
};

export default MetaActions;
