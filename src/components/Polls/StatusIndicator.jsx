import { Flex, Text } from "@100mslive/react-ui";

export const StatusIndicator = ({ isTimed }) => {
  return (
    <Flex align="center">
      <Flex
        css={{
          backgroundColor: "$error",
          p: "$2 $4",
          borderRadius: isTimed ? "$0 0 0 $0" : "$0",
        }}
      >
        <Text
          variant="caption"
          css={{
            fontWeight: "$semiBold",
            color: "$textHighEmp",
          }}
        >
          LIVE
        </Text>
      </Flex>

      {/* {isTimed ? (
        <Flex
          css={{
            borderRadius: "0 $0 $0 0",
            p: "$2 $4",
            backgroundColor: "$surfaceLighter",
          }}
        >
          <Text
            variant="caption"
            css={{
              fontWeight: "$semiBold",
              color: "$textHighEmp",
            }}
          >
            0:32
          </Text>
        </Flex>
      ) : null} */}
    </Flex>
  );
};
