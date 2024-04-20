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
import Modal from 'react-modal';
import InterviewVideoTile from "../components/InterviewVideoTile";
export const InterviewView = () => {
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

  const [showModal, setShowModal] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const hmsActions = useHMSActions();

  // Function to toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Logic for showing more than 4 candidates
  const showMoreCandidates = () => {
    setShowMore(true);
  };

  // JSX for the "Show More" button
  const showMoreButton = (
    <button onClick={showMoreCandidates}>Show More</button>
  );

  // Access selectors to get local peer's role, permissions, and allowed publishing
  const role = useHMSStore(selectLocalPeerRole);
  const permissions = useHMSStore(selectPermissions);


  // Log the permissions
  console.log(role, 'can I end room - ', permissions);
  console.log('can I change role - ', permissions.changeRole);

  const kickUser = async (peerId) => {
    try {
      const reason = 'Good Bye';
      await hmsActions.removePeer(peerId, reason);
    } catch (error) {
      console.error(error);
    }
  };

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

  console.log("Center Peers:", centerPeers);
  console.log("Sidebar Peers:", sidebarPeers);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  return (
    <>
      <Modal
        isOpen={showModal}
        onRequestClose={toggleModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#39424e', // Background color for modal
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <h2 style={{ color: '#fff' }}>All Candidates</h2>
        <ol style={{ color: '#fff', textAlign: 'left' }}> {/* Adjusted textAlign to 'left' */}
          {sidebarPeers.map((peer, index) => (
            <li key={peer.id} style={{ marginBottom: '10px' }}>
              {peer.name}
            </li>
          ))}
        </ol>
      </Modal>

      <div className="conference-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Container for moderators and interviewees */}
        <div className="moderator-interviewee-container" style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
          {centerPeers.map(peer => (
            <InterviewVideoTile key={peer.id} peerId={peer.id} role={peer.role} onChangeRole={() => changeRole(peer.id, "interviewee", true)} kickUser={() => kickUser(peer.id)} />
          ))}
        </div>

        {/* Candidates container */}
        <div className="candidates-container" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {sidebarPeers.slice(0, 5).map(peer => (
            <InterviewVideoTile key={peer.id} peerId={peer.id} role={peer.role} onChangeRole={() => changeRole(peer.id, "interviewee", true)} />
          ))}
        </div>

        {/* Show More button */}
        {sidebarPeers.length > 4 && (
          <button
            onClick={toggleModal}
            style={{
              backgroundColor: '#39424e',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 8px',
              cursor: 'pointer',
              marginTop: '30px', // Add some top margin for spacing
              alignSelf: 'center', // Align button to the center
            }}
          >
            Show More
          </button>
        )}
      </div>
    </>
  );


};