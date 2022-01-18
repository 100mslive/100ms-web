import React, { useEffect, useContext, useState, useCallback } from "react";
import { AppContext } from "../store/AppContext";
import { useHistory, useParams } from "react-router-dom";
import { ConferenceHeader } from "../views/headerView";
import { ConferenceFooter } from "../views/footerView";
import { ConferenceMainView } from "../views/mainView";
import {
  Button,
  MessageModal,
  selectIsConnectedToRoom,
  selectRoleChangeRequest,
  useHMSActions,
  useHMSStore,
} from "@100mslive/hms-video-react";
import { Box, Flex } from "@100mslive/react-ui";
import FullPageProgress from "../views/components/FullPageSpinner";

export const Conference = () => {
  const history = useHistory();
  const { roomId, role } = useParams();
  const context = useContext(AppContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false);
  const toggleChat = useCallback(() => {
    setIsChatOpen(open => !open);
  }, []);
  const isConnectedToRoom = useHMSStore(selectIsConnectedToRoom);
  const roleChangeRequest = useHMSStore(selectRoleChangeRequest);
  const hmsActions = useHMSActions();

  const onParticipantListOpen = useCallback(value => {
    setIsParticipantListOpen(value);
  }, []);

  const { loginInfo } = context;
  const isHeadless = loginInfo.isHeadlessMode;

  useEffect(() => {
    if (!roomId) {
      history.push(`/`);
    }
    if (!loginInfo.token) {
      // redirect to join if token not present
      if (role)
        history.push(`/preview/${loginInfo.roomId || roomId || ""}/${role}`);
      else history.push(`/preview/${loginInfo.roomId || roomId || ""}`);
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
    <Flex css={{ size: "100%", bg: "$bg" }} direction="column">
      {!isHeadless && (
        <Box css={{ h: "$6", "@md": { h: "$header" } }}>
          <ConferenceHeader onParticipantListOpen={onParticipantListOpen} />
        </Box>
      )}
      <Box css={{ w: "100%", flex: "1 1 0" }}>
        <ConferenceMainView
          isChatOpen={isChatOpen}
          isParticipantListOpen={isParticipantListOpen}
          toggleChat={toggleChat}
        />
      </Box>
      {!isHeadless && (
        <Box css={{ h: "10%", bg: "$bg" }}>
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
