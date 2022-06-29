import React from "react";
import { flexCenter, styled, Text } from "@100mslive/react-ui";
import { ConnectionIndicator } from "./ConnectionIndicator";

const TileConnection = ({ name, peerId }) => {
  return (
    <Wrapper>
      <Text css={{ c: "$textHighEmp", mr: "$2" }} variant="xs">
        {name}
      </Text>
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
  backgroundColor: "$black",
  borderRadius: "$1",
  p: "$2 $4",
});

export default TileConnection;
