import React, { useEffect, useContext, useState, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  selectRoomState,
  HMSRoomState,
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Box, Flex } from "@100mslive/react-ui";
import { Header } from "./Header";
import { Footer } from "./Footer";
import FullPageProgress from "./FullPageSpinner";
import { RoleChangeRequestModal } from "./RoleChangeRequestModal";
import { ConferenceMainView } from "../layouts/mainView";
import { AppContext } from "./context/AppContext";

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
        <Box css={{ flexShrink: 0, minHeight: "$24" }}>
          <Footer isChatOpen={isChatOpen} toggleChat={toggleChat} />
        </Box>
      )}
      <RoleChangeRequestModal />
    </Flex>
  );
};
