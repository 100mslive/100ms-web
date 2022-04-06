import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { SunWithFace } from "@100mslive/react-icons";
import {
  Box,
  Button,
  Flex,
  HorizontalDivider,
  Text,
} from "@100mslive/react-ui";
import PlaceholderBg from "../images/post_leave.png";

const PostLeave = () => {
  const history = useHistory();
  const { roomId, role } = useParams();
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
          "@md": {
            width: "100%",
            height: "100%",
            maxWidth: "unset",
            maxHeight: "unset",
          },
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
          <Text
            color="white"
            variant="h5"
            css={{ fontWeight: "$semiBold", mt: "$12" }}
          >
            You left the room
          </Text>
          <Text
            color="white"
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
                let previewUrl = "/preview/" + roomId;
                if (role) previewUrl += "/" + role;
                history.push(previewUrl);
              }}
              css={{ mx: "$4" }}
              data-testid="join_again_btn"
            >
              Join Again
            </Button>
            <Button
              variant="standard"
              onClick={() => {
                window.open("https://dashboard.100ms.live/", "_blank");
              }}
              css={{ mx: "$4" }}
              data-testid="go_to_dashboard_btn"
            >
              Go to dashboard
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default PostLeave;
