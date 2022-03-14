import React from "react";
import {
  useHMSStore,
  selectConnectionQualityByPeerID,
} from "@100mslive/react-sdk";
import { styled, Tooltip } from "@100mslive/react-ui";
import { getColor, getText } from "./utils";

const Dot = styled("span", {
  width: "5px",
  height: "5px",
  borderRadius: "$round",
  backgroundColor: "$bgTertiary",
});

const Container = styled("div", {
  position: "absolute",
  top: "5px",
  left: "5px",
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "$transparentBg",
  padding: "4px",
  borderRadius: "4px",
  "& > * + *": {
    marginRight: "0",
    marginLeft: "4px",
  },
});

const dots = [1, 2, 3, 4, 5];

export const ConnectionQuality = ({ peerId }) => {
  const downlinkScore = useHMSStore(
    selectConnectionQualityByPeerID(peerId)
  )?.downlinkScore;
  if (downlinkScore === -1 || downlinkScore === undefined) {
    return null;
  }
  return (
    <Tooltip title={getText(downlinkScore)}>
      <Container>
        {dots.map((_, i) => (
          <Dot
            css={{ bg: getColor(i, downlinkScore, "$bgTertiary") }}
            key={i}
          />
        ))}
      </Container>
    </Tooltip>
  );
};
