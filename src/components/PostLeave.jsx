import React from "react";
import { SunWithFace } from "@100mslive/react-icons";
import {
  Box,
  Button,
  Flex,
  HorizontalDivider,
  Text,
} from "@100mslive/react-ui";
import PlaceholderBg from "../images/post_leave.png";

export const PostLeave = ({ history, match }) => {
  return (
    <Flex justify="center" align="center" css={{ size: "100%", bg: "$mainBg" }}>
      <Box
        css={{
          position: "relative",
          overflow: "hidden",
          w: "37.5rem",
          maxWidth: "80%",
          h: "75%",
          maxHeight: "42.5rem",
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
            top: 0,
            left: 0,
            pt: "20%",
            textAlign: "center",
            background:
              "linear-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%)",
          }}
        >
          <SunWithFace width={72} height={72} />
          <Text variant="h5" css={{ fontWeight: "$semiBold", mt: "$12" }}>
            You left the room
          </Text>
          <Text
            variant="h5"
            css={{
              mt: "$8",
              fontWeight: "$semiBold",
            }}
          >
            Have a nice day!
          </Text>
          <HorizontalDivider
            css={{ bg: "$textPrimary", maxWidth: "50%", m: "$10 0" }}
          />
          <Flex justify="center">
            <Button
              onClick={() => {
                let previewUrl = "/preview/" + match.params.roomId;
                if (match.params.role) previewUrl += "/" + match.params.role;
                history.push(previewUrl);
              }}
              css={{ mx: "$4" }}
            >
              Join Again
            </Button>
            <Button
              variant="standard"
              onClick={() => {
                window.open("https://dashboard.100ms.live/", "_blank");
              }}
              css={{ mx: "$4" }}
            >
              Go to dashboard
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};
