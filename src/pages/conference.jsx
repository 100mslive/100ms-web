import React, { useEffect, useContext, useState, useCallback } from "react";
import { AppContext } from "../store/AppContext";
import { useHistory, useParams } from "react-router-dom";
import { Header } from "../views/new/Header";
import { ConferenceFooter } from "../views/footerView";
import { ConferenceMainView } from "../views/mainView";
import { Button, MessageModal } from "@100mslive/hms-video-react";
import {
  selectRoomState,
  HMSRoomState,
  selectIsConnectedToRoom,
  selectRoleChangeRequest,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Box, Flex } from "@100mslive/react-ui";
import FullPageProgress from "../views/components/FullPageSpinner";

export const Conference = () => {
  const history = useHistory();
  const { roomId, role } = useParams();
  const { isHeadless } = useContext(AppContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = useCallback(() => {
    setIsChatOpen(open => !open);
  }, []);
  const isConnectingToRoom =
    useHMSStore(selectRoomState) === HMSRoomState.Connecting;
  const isConnectedToRoom = useHMSStore(selectIsConnectedToRoom);
  const roleChangeRequest = useHMSStore(selectRoleChangeRequest);
  const hmsActions = useHMSActions();

  useEffect(() => {
    if (!roomId) {
      history.push(`/`);
    }
    if (!(isConnectingToRoom || isConnectedToRoom)) {
      if (role) history.push(`/preview/${roomId || ""}/${role}`);
      else history.push(`/preview/${roomId || ""}`);
    }
    return () => {
      // This is needed to handle mac touchpad swipe gesture
      hmsActions.leave();
    };
    // eslint-disable-next-line
  }, []);

  if (!isConnectedToRoom) {
    return <FullPageProgress />;
  }

  return (
    <Flex css={{ size: "100%" }} direction="column">
      {!isHeadless && (
        <Box css={{ h: "$18", "@md": { h: "$17" } }}>
          <Header />
        </Box>
      )}
      <Box css={{ w: "100%", flex: "1 1 0" }}>
        <ConferenceMainView isChatOpen={isChatOpen} toggleChat={toggleChat} />
      </Box>
      {!isHeadless && (
        <Box css={{ h: "10%" }}>
          <ConferenceFooter isChatOpen={isChatOpen} toggleChat={toggleChat} />
        </Box>
      )}
      <MessageModal
        show={!!roleChangeRequest && !isHeadless}
        onClose={() => hmsActions.rejectChangeRole(roleChangeRequest)}
        title="Role Change Request"
        body={`Role change requested by ${roleChangeRequest?.requestedBy?.name}.
              Changing role to ${roleChangeRequest?.role?.name}.`}
        footer={
          <div className="flex space-x-1">
            <Button
              onClick={() => hmsActions.acceptChangeRole(roleChangeRequest)}
            >
              Accept
            </Button>
          </div>
        }
      />
    </Flex>
  );
};
