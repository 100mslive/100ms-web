import React from "react";
import { useParams } from "react-router-dom";
import { Button, Flex, Box, Text } from "@100mslive/react-ui";
import { ExitIcon } from "@100mslive/react-icons";
import { ToastManager } from "./Toast/ToastManager";
import { Header } from "./Header";
import { useNavigation } from "./hooks/useNavigation";
import {
  UserPreferencesKeys,
  useUserPreferences,
  defaultPreviewPreference,
} from "./hooks/useUserPreferences";

const PostLeave = () => {
  const navigate = useNavigation();
  const { roomId, role } = useParams();
  const [previewPreference] = useUserPreferences(
    UserPreferencesKeys.PREVIEW,
    defaultPreviewPreference
  );
  return (
    <Flex direction="column" css={{ size: "100%" }}>
      <Box css={{ h: "$18", "@md": { h: "$17" } }} data-testid="header">
        <Header isPreview />
      </Box>
      <Flex
        justify="center"
        direction="column"
        align="center"
        css={{ bg: "$mainBg", flex: "1 1 0", position: "relative" }}
      >
        <Text variant="h2" css={{ fontWeight: "$semiBold" }}>
          👋
        </Text>
        <Text
          variant="h4"
          css={{ color: "$textHighEmp", fontWeight: "$semiBold", mt: "$12" }}
        >
          You left the stream
        </Text>
        <Text
          variant="body1"
          css={{ color: "$textMedEmp", mt: "$8", fontWeight: "$regular" }}
        >
          Have a nice day
          {previewPreference.name && `, ${previewPreference.name}`}!
        </Text>
        <Flex css={{ mt: "$14", gap: "$10", alignItems: "center" }}>
          <Text
            variant="body1"
            css={{ color: "$textMedEmp", fontWeight: "$regular" }}
          >
            Left by mistake?
          </Text>
          <Button
            onClick={() => {
              let previewUrl = "/preview/" + roomId;
              if (role) previewUrl += "/" + role;
              navigate(previewUrl);
              ToastManager.clearAllToast();
            }}
            data-testid="join_again_btn"
          >
            <ExitIcon />
            <Text css={{ ml: "$3", fontWeight: "$semiBold" }}>Rejoin</Text>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PostLeave;
