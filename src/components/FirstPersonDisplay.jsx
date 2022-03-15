import React from "react";
import { Flex, Box, Text } from "@100mslive/react-ui";
import PlaceholderBg from "../images/first_person.png";

export const FirstPersonDisplay = () => {
  return (
    <Box
      css={{
        position: "relative",
        overflow: "hidden",
        w: "37.5rem",
        maxWidth: "80%",
        h: "100%",
        r: "$3",
        m: "0 auto",
        backgroundImage: `url(${PlaceholderBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Flex
        align="center"
        direction="column"
        css={{
          position: "absolute",
          w: "100%",
          top: "33.33%",
          left: 0,
          textAlign: "center",
        }}
      >
        <Text variant="h4" css={{ "@md": { fontSize: "$md" } }}>
          Welcome!
        </Text>
        <Text variant="h6" css={{ mt: "$4", "@md": { fontSize: "$sm" } }}>
          You’re the first one here.
        </Text>
        <Text variant="h6" css={{ mt: "$2", "@md": { fontSize: "$sm" } }}>
          Sit back and relax till the others join.
        </Text>
      </Flex>
    </Box>
  );
};
