import { useState } from "react";
import { CheckCircleIcon, SettingsIcon } from "@100mslive/react-icons";
import { Box, Dropdown, Flex, Text, Tooltip } from "@100mslive/roomkit-react";

export function HLSQualitySelector({
  layers,
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
            color: "$on_surface_high",
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
                        background: "$on_surface_high",
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
      {layers.length > 0 && (
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
          {layers.map(layer => {
            return (
              <Dropdown.Item
                onClick={() => onQualityChange(layer)}
                key={layer.width}
              >
                <Text css={{ flex: "1 1 0" }}>{getQualityText(layer)}</Text>
                {!isAuto &&
                  layer.width === selection?.width &&
                  layer.height === selection?.height && <CheckCircleIcon />}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Content>
      )}
    </Dropdown.Root>
  );
}

const getQualityText = layer =>
  `${Math.min(layer.height, layer.width)}p (${(
    Number(layer.bitrate / 1000) / 1000
  ).toFixed(2)} Mbps)`;
