import { Avatar, Box, Flex, Text, Tooltip } from "@100mslive/roomkit-react";
import { VoterList } from "./VoterList";

// Shows number of votes, avatars of voters and list of voters on hover
export const Votes = ({ voters }) => {
  const hiddenVotersCount = voters.length > 2 ? voters.length - 2 : 0;

  return (
    <Flex align="center" css={{ gap: "$4" }}>
      <Text variant="sm" css={{ color: "$on_surface_medium" }}>
        {voters.length}&nbsp;
        {voters.length && voters.length !== 1 ? "votes" : "votes"}
      </Text>
      <Tooltip
        side="bottom"
        align="start"
        disabled={hiddenVotersCount === 0}
        boxCss={{
          backgroundColor: "$surface_brighter",
          borderRadius: "$1",
          p: "$4 $6",
          top: "$2",
          zIndex: "20",
          minWidth: "$44",
        }}
        title={<VoterList voters={voters} />}
      >
        <Flex align="center">
          {voters.length
            ? voters.slice(0, 2).map((voter, index) => (
                <Avatar
                  name={voter}
                  css={{
                    position: "relative",
                    transform: "unset",
                    left: `${index * -1}px`,
                    fontSize: "$tiny",
                    size: "$9",
                    p: "$4",
                    zIndex: "5",
                  }}
                />
              ))
            : null}
          {hiddenVotersCount ? (
            <Box
              css={{
                backgroundColor: "$secondary_default",
                borderRadius: "$round",
                position: "relative",
                left: "-$2",
                p: "$2 $3",
              }}
            >
              <Text
                variant="caption"
                css={{
                  fontWeight: "$semiBold",
                  color: "$on_surface_high",
                  fontSize: "$tiny",
                }}
              >
                +{hiddenVotersCount}
              </Text>
            </Box>
          ) : null}
        </Flex>
      </Tooltip>
    </Flex>
  );
};
