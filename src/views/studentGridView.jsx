import { selectPeers, useHMSStore } from "@100mslive/hms-video-react";
import React, { useContext } from "react";
import { AppContext } from "../store/AppContext";
import { ROLES } from "../common/roles";
import { GridCenterView, GridSidePaneView } from "./components/gridView";

export const StudentGridView = ({ isChatOpen, toggleChat }) => {
  const { maxTileCount } = useContext(AppContext);
  const peers = useHMSStore(selectPeers);
  const teacherPeers = peers.filter(
    peer => peer.role.toLowerCase() === ROLES.TEACHER
  );
  const studentPeers = peers.filter(
    peer => peer.role.toLowerCase() !== ROLES.TEACHER
  );
  const hideSidePane =
    (teacherPeers.length > 1 && studentPeers.length === 0) ||
    (teacherPeers.length === 0 && studentPeers.length > 1);
  return (
    <React.Fragment>
      <GridCenterView
        peers={hideSidePane ? peers : teacherPeers}
        maxTileCount={maxTileCount}
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        allowRemoteMute={false}
        hideSidePane={hideSidePane}
      ></GridCenterView>
      {!hideSidePane && (
        <GridSidePaneView
          peers={studentPeers}
          isChatOpen={isChatOpen}
          toggleChat={toggleChat}
        ></GridSidePaneView>
      )}
    </React.Fragment>
  );
};
