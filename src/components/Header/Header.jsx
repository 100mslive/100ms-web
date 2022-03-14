import React, { useContext } from "react";
import { Flex, Text, textEllipsis, Box, styled } from "@100mslive/react-ui";
import { SpeakerIcon } from "@100mslive/react-icons";
import {
  useHMSStore,
  selectDominantSpeaker,
  selectLocalPeer,
} from "@100mslive/react-sdk";
import { ParticipantList } from "./ParticipantList";
import { AdditionalRoomState } from "./AdditionalRoomState";
import PIPComponent from "../PIP/PIPComponent";
import { AppContext } from "../context/AppContext";
import { DEFAULT_HLS_VIEWER_ROLE } from "../../common/constants";

const SpeakerTag = () => {
  const dominantSpeaker = useHMSStore(selectDominantSpeaker);
  return dominantSpeaker && dominantSpeaker.name ? (
    <Flex
      align="center"
      justify="center"
      css={{ flex: "1 1 0", color: "$textPrimary", "@md": { display: "none" } }}
    >
      <SpeakerIcon width={24} height={24} />
      <Text
        variant="md"
        css={{ ...textEllipsis(200), ml: "$2" }}
        title={dominantSpeaker.name}
      >
        {dominantSpeaker.name}
      </Text>
    </Flex>
  ) : (
    <></>
  );
};

const LogoImg = styled("img", {
  maxHeight: "$14",
  "@md": {
    maxHeight: "$12",
  },
});

const Logo = () => {
  const { logo } = useContext(AppContext);
  return <LogoImg src={logo} alt="Brand Logo" />;
};

export const Header = ({ isPreview }) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const showPip = localPeer?.roleName !== DEFAULT_HLS_VIEWER_ROLE && !isPreview;
  return (
    <Flex
      justify="between"
      align="center"
      css={{ position: "relative", height: "100%" }}
    >
      <Flex align="center" css={{ position: "absolute", left: "$4" }}>
        <Logo />
      </Flex>
      <SpeakerTag />
      <Flex align="center" css={{ position: "absolute", right: "$4" }}>
        {showPip && <PIPComponent />}
        <Flex align="center" css={{ mx: "$2" }}>
          <AdditionalRoomState />
        </Flex>
        <Box css={{ mx: "$2" }}>
          <ParticipantList />
        </Box>
      </Flex>
    </Flex>
  );
};
