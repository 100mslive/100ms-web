import React from "react";
import { styled, Text, textEllipsis } from "@100mslive/roomkit-react";
import { ConnectionIndicator } from "./ConnectionIndicator";

const TileConnection = ({ name, peerId, hideLabel, width }) => {
  return (
    <Wrapper>
      {!hideLabel ? (
        <Text
          css={{
            c: "$on_surface_high",
            ...textEllipsis(width - 60),
          }}
          variant="xs"
        >
          {name}
        </Text>
      ) : null}
      <ConnectionIndicator isTile peerId={peerId} />
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "absolute",
  bottom: "$2",
  left: "$2",
  backgroundColor: "$background_dim",
  borderRadius: "$1",
  maxWidth: "85%",
  zIndex: 1,
  "& p,span": {
    p: "$2 $3",
  },
});

export default TileConnection;
