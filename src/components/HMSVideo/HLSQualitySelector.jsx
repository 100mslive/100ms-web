import { useState } from "react";
import { CheckCircleIcon, SettingsIcon } from "@100mslive/react-icons";
import { Box, Dropdown, Flex, Text, Tooltip } from "@100mslive/react-ui";

export function HLSQualitySelector({
  levels,
  onQualityChange,
  selection,
  isAuto,
}) {
  const [qualityDropDownOpen, setQualityDropDownOpen] = useState(false);

  return (
    <Dropdown.Root
      open={qualityDropDownOpen}
      onOpenChange={value => setQualityDropDownOpen(value)}
    >
      <Dropdown.Trigger asChild data-testid="quality_selector">
        <Flex
          css={{
            color: "$textPrimary",
            r: "$1",
            cursor: "pointer",
            p: "$2",
          }}
        >
          <Tooltip title="Select Quality" side="top">
            <Flex align="center">
              <Box
                css={{
                  w: "$9",
                  h: "$9",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <SettingsIcon />
              </Box>
              <Text
                variant={{
                  "@md": "sm",
                  "@sm": "xs",
                  "@xs": "tiny",
                }}
                css={{ display: "flex", alignItems: "center", ml: "$2" }}
              >
                {isAuto && (
                  <>
                    Auto
                    <Box
                      css={{
                        mx: "$2",
                        w: "$2",
                        h: "$2",
                        background: "$textPrimary",
                        r: "$1",
                      }}
                    />
                  </>
                )}
                {selection && Math.min(selection.width, selection.height)}p
              </Text>
            </Flex>
          </Tooltip>
        </Flex>
      </Dropdown.Trigger>
      {levels.length > 0 && (
        <Dropdown.Content
          sideOffset={5}
          align="end"
          css={{ height: "auto", maxHeight: "$96", w: "$64" }}
        >
          <Dropdown.Item
            onClick={_ => onQualityChange({ height: "auto" })}
            key="auto"
          >
            <Text css={{ flex: "1 1 0" }}>Automatic</Text>
            {isAuto && <CheckCircleIcon />}
          </Dropdown.Item>
          {levels.map(level => {
            return (
              <Dropdown.Item
                onClick={() => onQualityChange(level)}
                key={level.url}
              >
                <Text css={{ flex: "1 1 0" }}>{getQualityText(level)}</Text>
                {!isAuto &&
                  level.width === selection?.width &&
                  level.height === selection?.height && <CheckCircleIcon />}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Content>
      )}
    </Dropdown.Root>
  );
}

const getQualityText = level =>
  `${Math.min(level.height, level.width)}p (${(
    Number(level.bitrate / 1000) / 1000
  ).toFixed(2)} Mbps)`;
