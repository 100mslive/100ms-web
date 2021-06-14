import React, { useContext, useEffect } from "react";
import {
  selectPeers,
  useHMSStore,
  useHMSNotifications,
} from "@100mslive/hms-video-react";
import { GridCenterView, GridSidePaneView } from "./components/gridView";
import { AppContext } from "../store/AppContext";
import { ROLES } from "../common/roles";

export const MainGridView = ({ isChatOpen, toggleChat, role }) => {
  const { maxTileCount } = useContext(AppContext);
  const peers = useHMSStore(selectPeers);
  const notificationHandler = useHMSNotifications();
  const teacherPeers = peers.filter(
    peer => peer.role.toLowerCase() === ROLES.TEACHER
  );
  const studentPeers = peers.filter(
    peer => peer.role.toLowerCase() !== ROLES.TEACHER
  );
  const hideSidePane =
    (teacherPeers.length > 1 && studentPeers.length === 0) ||
    (teacherPeers.length === 0 && studentPeers.length > 1);

  const centerPeers = role === ROLES.TEACHER ? studentPeers : teacherPeers;
  const sidebarPeers = role === ROLES.TEACHER ? teacherPeers : studentPeers;

  useEffect(() => {
    const unsubscribe = notificationHandler(notification => {
      console.log("[Notification]", notification);
    });
    return unsubscribe;
  }, [notificationHandler]);

  return (
    <React.Fragment>
      <GridCenterView
        peers={hideSidePane ? peers : centerPeers}
        maxTileCount={maxTileCount}
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        allowRemoteMute={false}
        hideSidePane={hideSidePane}
      />
      {!hideSidePane && (
        <GridSidePaneView
          peers={sidebarPeers}
          isChatOpen={isChatOpen}
          toggleChat={toggleChat}
        />
      )}
    </React.Fragment>
  );
};
