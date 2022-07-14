import React from "react";
import { flexCenter, styled, Text, textEllipsis } from "@100mslive/react-ui";
import { ConnectionIndicator } from "./ConnectionIndicator";

const TileConnection = ({ name, peerId, hideLabel }) => {
  return (
    <Wrapper>
      {!hideLabel ? (
        <Text
          css={{
            c: "$textHighEmp",
            mr: "$2",
            ...textEllipsis("75px"),
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
  ...flexCenter,
  position: "absolute",
  bottom: "$2",
  left: "$2",
  zIndex: 10,
  backgroundColor: "$backgroundDark",
  borderRadius: "$1",
  "& p,span": {
    p: "$2 $3",
  },
});

export default TileConnection;
