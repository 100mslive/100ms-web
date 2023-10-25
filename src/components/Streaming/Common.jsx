import { selectPermissions, useHMSStore } from "@100mslive/react-sdk";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CrossIcon,
  RecordIcon,
} from "@100mslive/react-icons";
import {
  Box,
  Flex,
  IconButton,
  slideLeftAndFade,
  Switch,
  Text,
} from "@100mslive/roomkit-react";

export const StreamCard = ({
  title,
  subtitle,
  Icon,
  imgSrc = "",
  css = {},
  onClick,
  testId,
}) => {
  return (
    <Flex
      css={{
        w: "100%",
        p: "$10",
        r: "$1",
        cursor: "pointer",
        bg: "$surface_bright",
        mb: "$10",
        mt: "$8",
        ...css,
      }}
      data-testid={testId}
      onClick={onClick}
    >
      <Text css={{ alignSelf: "center", p: "$4" }}>
        {imgSrc ? (
          <img src={imgSrc} height={40} width={40} />
        ) : (
          <Icon width={40} height={40} />
        )}
      </Text>
      <Box css={{ flex: "1 1 0", mx: "$8" }}>
        <Text variant="h6" css={{ mb: "$4" }}>
          {title}
        </Text>
        <Text variant="sm" css={{ color: "$on_surface_medium" }}>
          {subtitle}
        </Text>
      </Box>
      <Text css={{ alignSelf: "center" }}>
        <ChevronRightIcon />
      </Text>
    </Flex>
  );
};

export const ContentHeader = ({ onBack, onClose, title = "", content }) => {
  return (
    <Flex css={{ w: "100%", py: "$8", px: "$10", cursor: "pointer" }}>
      {onBack ? (
        <Text
          css={{
            p: "$2",
            bg: "$surface_bright",
            r: "$round",
            alignSelf: "center",
            mr: "$8",
          }}
          onClick={onBack}
          data-testid="go_back"
        >
          <ChevronLeftIcon width={16} height={16} />
        </Text>
      ) : null}
      <Box css={{ flex: "1 1 0" }}>
        {title ? (
          <Text
            variant="tiny"
            css={{
              textTransform: "uppercase",
              fontWeight: "$semiBold",
              color: "$on_surface_medium",
            }}
          >
            {title}
          </Text>
        ) : null}
        <Text variant="h6">{content}</Text>
      </Box>
      {onClose ? (
        <IconButton
          onClick={onClose}
          css={{ alignSelf: "flex-start" }}
          data-testid="close_stream_section"
        >
          <CrossIcon width={16} height={16} />
        </IconButton>
      ) : null}
    </Flex>
  );
};

export const Container = ({ children, rounded = false }) => {
  return (
    <Box
      css={{
        size: "100%",
        zIndex: 2,
        position: "absolute",
        top: 0,
        left: 0,
        bg: "$surface_default",
        transform: "translateX(10%)",
        animation: `${slideLeftAndFade("10%")} 100ms ease-out forwards`,
        display: "flex",
        flexDirection: "column",
        borderRadius: rounded ? "$2" : "0",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {children}
    </Box>
  );
};

export const ContentBody = ({
  Icon,
  title,
  removeVerticalPadding = false,
  children,
}) => {
  return (
    <Box css={{ p: removeVerticalPadding ? "$0 $10" : "$10" }}>
      <Text css={{ display: "flex", alignItems: "center", mb: "$4" }}>
        <Icon />
        <Text as="span" css={{ fontWeight: "$semiBold", ml: "$4" }}>
          {title}
        </Text>
      </Text>
      <Text variant="sm" css={{ color: "$on_surface_medium" }}>
        {children}
      </Text>
    </Box>
  );
};

export const RecordStream = ({ record, setRecord, testId }) => {
  const permissions = useHMSStore(selectPermissions);
  return permissions?.browserRecording ? (
    <Flex
      align="center"
      css={{ bg: "$surface_bright", m: "$8 $10", p: "$8", r: "$0" }}
    >
      <Text css={{ color: "$alert_error_default" }}>
        <RecordIcon />
      </Text>
      <Text variant="sm" css={{ flex: "1 1 0", mx: "$8" }}>
        Record the stream
      </Text>
      <Switch
        checked={record}
        onCheckedChange={setRecord}
        data-testid={testId}
      />
    </Flex>
  ) : null;
};

export const ErrorText = ({ error }) => {
  if (!error) {
    return null;
  }
  return (
    <Text variant="sm" css={{ mb: "$8", color: "$alert_error_default" }}>
      {error}
    </Text>
  );
};
