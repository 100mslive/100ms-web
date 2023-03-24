import React from "react";
import { Box, Flex, Text, useTheme } from "@100mslive/react-ui";

function DeprecatedLink() {
  const themeType = useTheme().themeType;
  return (
    <Flex
      align="center"
      justify="center"
      css={{
        size: "100%",
        color: "$textPrimary",
        backgroundColor: "$bgPrimary",
      }}
    >
      <Box css={{ position: "relative", overflow: "hidden", r: "$3" }}>
        <img
          src={
            themeType === "dark"
              ? require("../images/error-bg-dark.svg")
              : require("../images/error-bg-light.svg")
          }
          alt="Error Background"
        />
        <Flex
          align="center"
          direction="column"
          css={{ position: "absolute", size: "100%", top: "33.33%", left: 0 }}
        >
          <Text variant="h3">Deprecated Link</Text>
          <Text
            variant="body1"
            css={{ margin: "1.75rem", textAlign: "center" }}
          >
            {
              "<room_id>/<role> link format is deprecated. Click here for more details."
            }
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}

DeprecatedLink.displayName = "DeprecatedLink";

export default DeprecatedLink;
