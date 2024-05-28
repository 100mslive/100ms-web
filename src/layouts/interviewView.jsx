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
import { ToastManager } from "../components/Toast/ToastManager";
import { Buffer } from 'buffer';
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
  const [prevPeerCount, setPrevPeerCount] = useState(peers.length);
  const [intervieweePeer, setIntervieweePeer] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false); // New state for the reason selection modal
  const [selectedReason, setSelectedReason] = useState(null);

  const reasonOptions = [
    "Mic not audible",
    "Camera not Clear",
    "Inappropriate Behavior",
    "Background not working",
    "English too weak",
    "Bad Internet"
  ];

  // Function to toggle reason selection modal visibility
  const toggleReasonModal = () => {
    setShowReasonModal(!showReasonModal);
  };

  // Function to handle deny action with reason
  const handleDeny = (reason) => {
    console.log('handle deny function')
    setSelectedReason(reason);
    toggleReasonModal();
    // Call handleAction with reason
    handleAction(false, reason);
  };

  
  const pingSound = new Audio("/ping.mp3");
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
  const [decodedData, setDecodedData] = useState(null);

  useEffect(() => {
    const base64Data = localStorage.getItem('data');
    console.log(base64Data, "base64")
    if (base64Data) {
      try {
        // Decode the Base64 string using Buffer
        const decodedString = Buffer.from(base64Data, 'base64').toString('utf-8');

        // Parse the JSON string
        const data = JSON.parse(decodedString);

        // Set the decoded data to state
        setDecodedData(data);
      } catch (error) {
        console.error('Error decoding Base64 string:', error);
        // setError('Failed to decode data');
      }
    } else {
      console.log('No data parameter found in URL');
    }
  }, [location.search]);
  console.log("decoded data", decodedData)
  // Log the permissions
  // console.log(role, 'can I end room - ', permissions);
  // console.log('can I change role - ', permissions.changeRole);
  console.log('no of peers', peers, peers.length, prevPeerCount)
  console.log('interview peer', intervieweePeer)
  console.log("local role", localRole)
  //set default interview peer data
  useEffect(() => {
    const initialInterviewee = peers.find(peer => peer.roleName === "interviewee");
    setIntervieweePeer(initialInterviewee);
  }, [peers]);

  useEffect(() => {
    console.log("peer lenth useeffect")
    if (peers.length > 0 && peers.length > prevPeerCount) {
      pingSound.play();
      console.log("play ping sound")
    }
    setPrevPeerCount(peers.length);
  }, [peers.length]);

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
    if (newRole === "interviewee") {
      const updatedPeer = peers.find(peer => peer.id === peerId);
      setIntervieweePeer(updatedPeer);
    }
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
  // console.log("Sidebar Peers:", sidebarPeers);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // Function to handle API call with action and optional reason
  const handleAction = async (accept, rejectionReason = null) => {
    try {
      const learnerId = intervieweePeer ? JSON.parse(intervieweePeer.metadata).userId : null;
      const response = await fetch('https://dev.clapingo.com/api/session/acceptOrRejectLearner', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': decodedData.token
        },
        body: JSON.stringify({
          learnerId,
          sessionId: decodedData.sessionId,
          accept,
          rejectionReason // Pass rejection reason if provided
        })
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        ToastManager.addToast({
          title: `${data.message || ""}`,
          variant: "success",
        });
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        ToastManager.addToast({
          title: `${errorData.message || ""}`,
          variant: "error",
        });
      }
    } catch (error) {
      console.error(`Error ${accept ? "approving" : "denying"} learner:`, error);
    }
  };


  return (
    <>
      {/* Deny Reason Modal */}
      <Modal
        isOpen={showReasonModal}
        onRequestClose={toggleReasonModal}
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
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Select Reason for Denial</h2>
        <form>
          {reasonOptions.map(reason => (
            <div key={reason} style={{ marginBottom: '10px' }}>
              <input
                type="radio"
                id={reason}
                name="reason"
                value={reason}
                onChange={(e) => setSelectedReason(e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <label htmlFor={reason} style={{ color: '#fff' }}>{reason}</label>
            </div>
          ))}
          <button
            onClick={() => {
              if (selectedReason) {
                handleDeny(selectedReason);
                toggleReasonModal();
              }
            }}
            style={{ backgroundColor: '#dc3545', color: '#fff', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer', marginTop: '20px' }}
          >
            Deny
          </button>
        </form>
      </Modal>


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

      <div className="conference-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
        {/* Container for moderators and interviewees */}
        <div className="moderator-interviewee-container" style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
          {centerPeers.map(peer => (

            <InterviewVideoTile
              peerId={peer.id}
              role={peer.role}
              onChangeRole={() => changeRole(peer.id, "interviewee", true)}
              kickUser={() => kickUser(peer.id)}
            />


          ))}
          {localRole.name === "moderator" && intervieweePeer && (
            <div style={{ backgroundColor: '#39424e', color: '#fff', padding: '10px', borderRadius: '8px', marginTop: '50px' }}>
              <h1>User Information</h1>
              <p>Name : {intervieweePeer?.name}</p>
              <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '10px' }}>
                <button onClick={() => handleAction(true)} style={{ backgroundColor: '#28a745', color: '#fff', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Approve</button>
                <button onClick={toggleReasonModal} style={{ backgroundColor: '#dc3545', color: '#fff', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Deny</button>
              </div>
            </div>
          )}


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