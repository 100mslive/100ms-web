import { Box, Flex, Text } from "@100mslive/roomkit-react";

const Tabs = ({ options, activeTab, setActiveTab }) => {
  return (
    <Flex
      align="center"
      css={{
        w: "100%",
        p: "$2",
        backgroundColor: "$surfaceDark",
        borderRadius: "$2",
      }}
    >
      {options.map(option => {
        const isActive = option === activeTab;
        return (
          <Box
            onClick={() => setActiveTab(option)}
            key={option}
            css={{
              p: "$4 $8",
              borderRadius: "$1",
              w: "100%",
              backgroundColor: isActive ? "$surfaceLight" : "$surfaceDark",
              cursor: "pointer",
            }}
          >
            <Text
              variant="sm"
              css={{
                color: isActive ? "$textHighEmp" : "$textDisabled",
                textAlign: "center",
                fontWeight: "$semiBold",
              }}
            >
              {option}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
};

export default Tabs;
