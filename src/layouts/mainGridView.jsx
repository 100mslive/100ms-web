import React, { useEffect, useState } from "react";
import {
  selectLocalPeerID,
  selectLocalPeerRole,
  selectPeers,
  selectPeersByRoles,
  selectRolesMap,
  useHMSStore,
  useHMSActions,
  selectPermissions,
} from "@100mslive/react-sdk";
import { Flex } from "@100mslive/roomkit-react";
import { GridCenterView, GridSidePaneView } from "../components/gridView";
import { NonPublisherView } from "./NonPublisherView";
import { useAppLayout } from "../components/AppData/useAppLayout";
import { useUISettings } from "../components/AppData/useUISettings";
import { UI_SETTINGS } from "../common/constants";
import VideoTile from "../components/VideoTile";

export const MainGridView = () => {
  // const centerRoles = useAppLayout("center") || [];
  // const sidepaneRoles = useAppLayout("sidepane") || [];
  const centerPeers = useHMSStore(selectPeersByRoles(["moderator", "interviewee"]));
  const sidebarPeers = useHMSStore(selectPeersByRoles(["candidate"]));
  const maxTileCount = useUISettings(UI_SETTINGS.maxTileCount);
  const peers = useHMSStore(selectPeers);
  const roles = useHMSStore(selectRolesMap);
  const localPeerId = useHMSStore(selectLocalPeerID);
 
  const localRole = useHMSStore(selectLocalPeerRole);
  const peersByRoles = useHMSStore(
    selectPeersByRoles(localRole.subscribeParams.subscribeToRoles || [])
  );
  const [placeholder, setPlaceholder] = useState("");
  const hmsActions = useHMSActions();
 
    // Access selectors to get local peer's role, permissions, and allowed publishing
    const role =useHMSStore(selectLocalPeerRole);
    const permissions = useHMSStore(selectPermissions);
    
  
    // Log the permissions
    console.log(role, 'can I end room - ', permissions);
    console.log('can I change role - ', permissions.changeRole);
   
  const changeRole = (peerId, newRole, force) => {
    hmsActions.changeRoleOfPeer(peerId, newRole, force);
  };
  useEffect(() => {
    const hasPublishingPeers = peers.some(peer => {
      // peer able to publish
      if (peer.roleName && roles[peer.roleName]) {
        return !!roles[peer.roleName].publishParams?.allowed.length;
      }
      return true;
    });
    const hasSubscribedRolePublishing = peersByRoles.some(peer => {
      if (peer.roleName && roles[peer.roleName]) {
        return !!roles[peer.roleName].publishParams?.allowed.length;
      }
      return true;
    });
    if (!hasPublishingPeers) {
      setPlaceholder("None of the roles can publish video, audio or screen");
    } else if (!localRole.subscribeParams.subscribeToRoles?.length) {
      setPlaceholder("This role isn't subscribed to any role");
    } else if (!hasSubscribedRolePublishing) {
      setPlaceholder("This role subscribed to roles is not publishing");
    } else {
      setPlaceholder("");
    }
  }, [
    localRole.subscribeParams.subscribeToRoles?.length,
    peers,
    peersByRoles,
    roles,
  ]);
  /**
   * If there are peers from many publishing roles, then it's possible to divide
   * them into two parts, those who show in center and those who show in sidepane.
   * In case there is only one person in the room, then too sidepane will be shown
   * and center would be taken up by a banner image.
   * There is an issue currently, where the banner is still shown if there are
   * multiple viewers in the room but no publisher. Depending on the use case
   * this can be useful(for webinar) or look odd(for showing you're the only one).
   * Note that both center peers and sidebar peers have only publishing peers in them.
   */
  let showSidePane = centerPeers.length > 0 && sidebarPeers.length > 0;
  if (centerPeers.length === 0) {
    // we'll show the sidepane for banner in this case too if 1). it's only me
    // in the room. or 2). noone is publishing in the room
    const itsOnlyMeInTheRoom =
      peers.length === 1 && peers[0].id === localPeerId;
    const nooneIsPublishing = sidebarPeers.length === 0;
    showSidePane = itsOnlyMeInTheRoom || nooneIsPublishing;
  }
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };
  
  const rowStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  };
  return (
    // <Flex
    //   css={{
    //     size: "100%",
    //   }}
    //   direction={{
    //     "@initial": "row",
    //     "@md": "column",
    //   }}
    // >
    //   {placeholder ? (
    //     <NonPublisherView message={placeholder} />
    //   ) : (
    //     <>
    //       <GridCenterView
    //         peers={showSidePane ? centerPeers : peers}
    //         maxTileCount={maxTileCount}
    //         allowRemoteMute={false}
    //         hideSidePane={!showSidePane}
    //         totalPeers={peers.length}
    //       />
    //       {showSidePane && (
    //         <GridSidePaneView peers={sidebarPeers} totalPeers={peers.length} />
    //       )}
    //     </>
    //   )}
    // </Flex>
    <div className="conference-section" style={containerStyle}>
    {/* Container for moderators and interviewees */}
    <div className="moderator-interviewee-container" style={rowStyle}>
      {centerPeers.map(peer => (
        <VideoTile key={peer.id} peerId={peer.id} role={peer.role} onChangeRole={() => changeRole(peer.id, "interviewee", true)}   />
      ))}
    </div>

    {/* Container for candidates */}
    <div className="candidates-container" style={{ ...rowStyle, flexWrap: "wrap" }}>
      {sidebarPeers.map(peer => (
        <VideoTile key={peer.id} peerId={peer.id} role={peer.role}  onChangeRole={() => changeRole(peer.id, "interviewee", true)} />
      ))}
    </div>
  </div>
  );
};
