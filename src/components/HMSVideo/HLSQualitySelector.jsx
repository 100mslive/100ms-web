import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SettingsIcon,
} from "@100mslive/react-icons";
import { Box, Dropdown, Flex, Text, Tooltip } from "@100mslive/react-ui";

export function HLSQualitySelector({
  availableLevels,
  qualitySelectorHandler,
  currentSelectedQualityText,
}) {
  const [qualityDropDownOpen, setQualityDropDownOpen] = useState(false);

  return (
    <Dropdown.Root
      css={{ margin: "0px" }}
      open={qualityDropDownOpen}
      onOpenChange={value => setQualityDropDownOpen(value)}
    >
      <Dropdown.Trigger asChild data-testid="quality_selector">
        <Flex
          css={{
            color: "$textPrimary",
            borderRadius: "$1",
            margin: "0px",
            cursor: "pointer",
            border: "1px solid $textDisabled",
            padding: "$2 $4",
          }}
        >
          <Tooltip title="Select Quality">
            <Flex align="center">
              <SettingsIcon />
              <Text
                variant={{
                  "@md": "sm",
                  "@sm": "xs",
                  "@xs": "tiny",
                }}
              >
                {currentSelectedQualityText}
              </Text>
            </Flex>
          </Tooltip>

          <Box
            css={{
              "@lg": { display: "none" },
              color: "$textDisabled",
            }}
          >
            {qualityDropDownOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Box>
        </Flex>
      </Dropdown.Trigger>
      {availableLevels.length > 0 && (
        <Dropdown.Content
          sideOffset={5}
          align="end"
          css={{ height: "auto", maxHeight: "$96" }}
        >
          <Dropdown.Item
            onClick={_ => qualitySelectorHandler({ height: "auto" })}
            css={{
              h: "auto",
              flexDirection: "column",
              flexWrap: "wrap",
              cursor: "pointer",
              alignItems: "flex-start",
            }}
            key="auto"
          >
            <Text>Automatic</Text>
          </Dropdown.Item>
          {availableLevels.map(level => {
            return (
              <Dropdown.Item
                onClick={() => qualitySelectorHandler(level)}
                css={{
                  h: "auto",
                  flexDirection: "column",
                  flexWrap: "wrap",
                  cursor: "pointer",
                  alignItems: "flex-start",
                }}
                key={level.url}
              >
                <Text>{getQualityText(level)}</Text>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Content>
      )}
    </Dropdown.Root>
  );
}

const getQualityText = level =>
  `${level.height}p (${(Number(level.bitrate / 1024) / 1024).toFixed(2)} Mbps)`;
