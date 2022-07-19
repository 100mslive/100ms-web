import { useContext } from "react";
import { selectDominantSpeaker, useHMSStore } from "@100mslive/react-sdk";
import { VolumeOneIcon } from "@100mslive/react-icons";
import { Flex, styled, Text, textEllipsis } from "@100mslive/react-ui";
import { AppContext } from "../context/AppContext";

export const SpeakerTag = () => {
  const dominantSpeaker = useHMSStore(selectDominantSpeaker);
  return dominantSpeaker && dominantSpeaker.name ? (
    <Flex
      align="center"
      justify="center"
      css={{ flex: "1 1 0", color: "$textPrimary", "@md": { display: "none" } }}
    >
      <VolumeOneIcon />
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
  p: "$2",
  w: "auto",
  "@md": {
    maxHeight: "$12",
  },
});

export const Logo = () => {
  const { logo } = useContext(AppContext);
  return <LogoImg src={logo} alt="Brand Logo" width={132} height={40} />;
};
