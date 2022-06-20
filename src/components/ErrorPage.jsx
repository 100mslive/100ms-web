import React from "react";
import errorBgDark from "../images/error-bg-dark.svg";
import errorBgLight from "../images/error-bg-light.svg";
import { Flex, Box, Text, useTheme } from "@100mslive/react-ui";
import { CREATE_ROOM_DOC_URL } from "../common/constants";

function ErrorPage({ error }) {
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
          src={themeType === "dark" ? errorBgDark : errorBgLight}
          alt="error background"
        />
        {window.location.hostname === "localhost" && error === "isRoot" ? (
          <Flex
            align="center"
            direction="column"
            css={{ position: "absolute", size: "100%", top: "33.33%", left: 0 }}
          >
            <Text variant="h2">Almost There!</Text>
            <Text
              variant="body1"
              css={{ margin: "1.75rem", textAlign: "center" }}
            >
              {
                "Hi there! thanks for trying us out, there is not much here yet. Let's get you all setup to join a meeting. "
              }
              <a
                href={CREATE_ROOM_DOC_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline" }}
              >
                Click here
              </a>{" "}
              for next steps
            </Text>
          </Flex>
        ) : (
          <Flex
            align="center"
            direction="column"
            css={{ position: "absolute", size: "100%", top: "33.33%", left: 0 }}
          >
            <Text variant="h2">404</Text>
            <Text variant="h4" css={{ mt: "1.75rem" }}>
              {error}
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

ErrorPage.displayName = "ErrorPage";

export default ErrorPage;
