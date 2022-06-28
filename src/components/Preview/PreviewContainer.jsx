import React, { useState } from "react";
import { styled, flexCenter } from "@100mslive/react-ui";
import PreJoinScreen from "./PreJoinScreen";
import PreviewJoin from "./PreviewJoin";

const PreviewContainer = ({ token, onJoin, env, skipPreview, initialName }) => {
  // just for testing revert before pushing
  const [isNameScreen, setIsNameScreen] = useState(false);
  return (
    <Container>
      {isNameScreen ? (
        <PreJoinScreen
          initialName={initialName}
          setIsNameScreen={setIsNameScreen}
        />
      ) : (
        <PreviewJoin
          initialName={initialName}
          skipPreview={skipPreview}
          env={env}
          onJoin={onJoin}
          token={token}
        />
      )}
    </Container>
  );
};

const Container = styled("div", {
  width: "100%",
  ...flexCenter,
  flexDirection: "column",
});

export default PreviewContainer;
