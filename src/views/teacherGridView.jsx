import { selectPeers, useHMSStore } from "@100mslive/hms-video-react";
import React, { useContext } from "react";
import { AppContext } from "../store/AppContext";
import { ROLES } from "../common/roles";
import { GridCenterView, GridSidePaneView } from "./components/gridView";

export const TeacherGridView = ({ isChatOpen, toggleChat }) => {
  const { maxTileCount } = useContext(AppContext);
  const peers = useHMSStore(selectPeers);
  const teacherPeers = peers.filter((peer) => peer.role === ROLES.TEACHER);
  const studentPeers = peers.filter((peer) => peer.role === ROLES.STUDENT);
  const hideSidePane = (teacherPeers.length > 1 && studentPeers.length === 0) || (teacherPeers.length === 0 && studentPeers.length > 1)
  return (
    <React.Fragment>
      <GridCenterView
        peers={hideSidePane ? peers : studentPeers}
        maxTileCount={maxTileCount}
        allowRemoteMute={true}
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        hideSidePane={hideSidePane}
      ></GridCenterView>
      {!hideSidePane && <GridSidePaneView
        peers={teacherPeers}
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
      ></GridSidePaneView>}
    </React.Fragment>
  );
};
