import React, { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePrevious } from "react-use";
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
import FullPageProgress from "./FullPageProgress";
import { RoleChangeRequestModal } from "./RoleChangeRequestModal";
import { ConferenceMainView } from "../layouts/mainView";
import { AppContext } from "./context/AppContext";

const Conference = () => {
  const navigate = useNavigate();
  const { roomId, role } = useParams();
  const { isHeadless } = useContext(AppContext);
  const roomState = useHMSStore(selectRoomState);
  const prevState = usePrevious(roomState);
  const isConnectedToRoom = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();

  useEffect(() => {
    if (!roomId) {
      navigate(`/`);
      return;
    }
    if (
      !prevState &&
      !(roomState === HMSRoomState.Connecting || isConnectedToRoom)
    ) {
      if (role) navigate(`/preview/${roomId || ""}/${role}`);
      else navigate(`/preview/${roomId || ""}`);
    }
  }, [isConnectedToRoom, prevState, roomState, navigate, role, roomId]);

  useEffect(() => {
    return () => {
      // This is needed to handle mac touchpad swipe gesture
      if (isConnectedToRoom) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnectedToRoom]);

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
      <Box
        css={{
          w: "100%",
          flex: "1 1 0",
          minHeight: 0,
        }}
      >
        <ConferenceMainView />
      </Box>
      {!isHeadless && (
        <Box css={{ flexShrink: 0, minHeight: "$24" }}>
          <Footer />
        </Box>
      )}
      <RoleChangeRequestModal />
    </Flex>
  );
};

export default Conference;
