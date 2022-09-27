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
} from "@100mslive/react-ui";

export const StreamCard = ({
  title,
  subtitle,
  Icon,
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
        bg: "$surfaceLight",
        mb: "$10",
        mt: "$8",
        ...css,
      }}
      data-testid={testId}
      onClick={onClick}
    >
      <Text css={{ alignSelf: "center", p: "$4" }}>
        <Icon width={40} height={40} />
      </Text>
      <Box css={{ flex: "1 1 0", mx: "$8" }}>
        <Text variant="h6" css={{ mb: "$4" }}>
          {title}
        </Text>
        <Text variant="sm" css={{ color: "$textMedEmp" }}>
          {subtitle}
        </Text>
      </Box>
      <Text css={{ alignSelf: "center" }}>
        <ChevronRightIcon />
      </Text>
    </Flex>
  );
};

export const ContentHeader = ({ onBack, title, content }) => {
  return (
    <Flex css={{ w: "100%", py: "$8", px: "$10", cursor: "pointer" }}>
      <Text
        css={{ p: "$2", bg: "$surfaceLight", r: "$round", alignSelf: "center" }}
        onClick={onBack}
        data-testid="go_back"
      >
        <ChevronLeftIcon width={16} height={16} />
      </Text>
      <Box css={{ flex: "1 1 0", mx: "$8" }}>
        <Text variant="sm">{title}</Text>
        <Text variant="h6">{content}</Text>
      </Box>
      <IconButton
        onClick={onBack}
        css={{ alignSelf: "flex-start" }}
        data-testid="close_stream_section"
      >
        <CrossIcon width={16} height={16} />
      </IconButton>
    </Flex>
  );
};

export const Container = ({ children }) => {
  return (
    <Box
      css={{
        size: "100%",
        zIndex: 2,
        position: "absolute",
        top: 0,
        left: 0,
        bg: "$surfaceDefault",
        transform: "translateX(10%)",
        animation: `${slideLeftAndFade("10%")} 100ms ease-out forwards`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </Box>
  );
};

export const ContentBody = ({ Icon, title, children }) => {
  return (
    <Box css={{ p: "$10" }}>
      <Text css={{ display: "flex", alignItems: "center", mb: "$4" }}>
        <Icon />
        <Text as="span" css={{ fontWeight: "$semiBold", ml: "$4" }}>
          {title}
        </Text>
      </Text>
      <Text variant="sm" css={{ color: "$textMedEmp" }}>
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
      css={{ bg: "$surfaceLight", m: "$8 $10", p: "$8", r: "$0" }}
    >
      <Text css={{ color: "$error" }}>
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
    <Text variant="sm" css={{ mb: "$8", color: "$error" }}>
      {error}
    </Text>
  );
};
