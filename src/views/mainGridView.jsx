import React, { useContext } from "react";
import { selectPeers, useHMSStore } from "@100mslive/hms-video-react";
import { GridCenterView, GridSidePaneView } from "./components/gridView";
import { AppContext } from "../store/AppContext";

export const MainGridView = ({
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
}) => {
  const {
    maxTileCount,
    appPolicyConfig: { center: centerRoles, sidepane: sidepaneRoles },
  } = useContext(AppContext);
  const peers = useHMSStore(selectPeers);
  const centerPeers = peers.filter(peer => centerRoles.includes(peer.roleName));
  const sidebarPeers = peers.filter(peer =>
    sidepaneRoles.includes(peer.roleName)
  );
  // if there is only one type of peers to show
  const hideSidePane = sidebarPeers.length === 0 || centerPeers.length === 0;

  return (
    <React.Fragment>
      <GridCenterView
        peers={hideSidePane ? peers : centerPeers}
        maxTileCount={maxTileCount}
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        allowRemoteMute={false}
        hideSidePane={hideSidePane}
        isParticipantListOpen={isParticipantListOpen}
        totalPeers={peers.length}
      />
      {!hideSidePane && (
        <GridSidePaneView
          peers={sidebarPeers}
          isChatOpen={isChatOpen}
          toggleChat={toggleChat}
          isParticipantListOpen={isParticipantListOpen}
          totalPeers={peers.length}
        />
      )}
    </React.Fragment>
  );
};
