import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePrevious } from "react-use";
import {
  selectRoomState,
  HMSRoomState,
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Box, Flex } from "@100mslive/react-ui";
import FullPageProgress from "./FullPageProgress";
import { RoleChangeRequestModal } from "./RoleChangeRequestModal";
import { ConferenceMainView } from "../layouts/mainView";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useNavigation } from "./hooks/useNavigation";
import { useIsHeadless } from "./AppData/useUISettings";

const Conference = () => {
  const navigate = useNavigation();
  const { roomId, role } = useParams();
  const isHeadless = useIsHeadless();
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
      !(
        roomState === HMSRoomState.Connecting ||
        roomState === HMSRoomState.Reconnecting ||
        isConnectedToRoom
      )
    ) {
      if (role) navigate(`/preview/${roomId || ""}/${role}`);
      else navigate(`/preview/${roomId || ""}`);
    }
  }, [isConnectedToRoom, prevState, roomState, navigate, role, roomId]);

  useEffect(() => {
    // beam doesn't need to store messages, saves on unnecessary store updates in large calls
    if (isHeadless) {
      hmsActions.ignoreMessageTypes(["chat"]);
    }
  }, [isHeadless, hmsActions]);

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
        <Box css={{ h: "$18", "@md": { h: "$17" } }} data-testid="header">
          <Header />
        </Box>
      )}
      <Box
        css={{
          w: "100%",
          flex: "1 1 0",
          minHeight: 0,
        }}
        data-testid="conferencing"
      >
        <ConferenceMainView />
      </Box>
      {!isHeadless && (
        <Box css={{ flexShrink: 0, minHeight: "$24" }} data-testid="footer">
          <Footer />
        </Box>
      )}
      <RoleChangeRequestModal />
    </Flex>
  );
};

export default Conference;
