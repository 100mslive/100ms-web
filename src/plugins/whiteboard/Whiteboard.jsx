import React from "react";
import { Tldraw } from "@tldraw/tldraw";
import { useMultiplayerState } from "./useMultiplayerState";

export const Whiteboard = React.memo(({ roomId }) => {
  const events = useMultiplayerState(roomId);

  return (
    <Tldraw
      autofocus
      disableAssets={true}
      showSponsorLink={false}
      showPages={false}
      showMenu={false}
      {...events}
    />
  );
});
