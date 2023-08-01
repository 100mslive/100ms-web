// @ts-check
import React, { useRef, useState } from "react";
import { Dropdown, Flex, Switch, Text } from "@100mslive/roomkit-react";
import { DialogDropdownTrigger } from "../../../primitives/DropdownTrigger";
import { useDropdownSelection } from "../../hooks/useDropdownSelection";

const timerSettings = {
  10: "10 secs",
  15: "15 secs",
  20: "20 secs",
  25: "25 secs",
  30: "30 secs",
  60: "1 min",
  120: "2 mins",
  300: "5 mins",
};

export const Timer = ({
  timer,
  setTimer,
  showTimerDropDown,
  setShowTimerDropDown,
}) => {
  const selectionBg = useDropdownSelection();
  const [timerDropdownToggle, setTimerDropdownToggle] = useState(false);
  const timerDropdownRef = useRef();

  return (
    <Flex justify="between" align="center" css={{ mt: "$10" }}>
      <Flex align="center">
        <Switch
          checked={showTimerDropDown}
          onCheckedChange={setShowTimerDropDown}
          css={{ mr: "$6" }}
        />
        <Text variant="body2" css={{ c: "$on_surface_medium" }}>
          Timer
        </Text>
      </Flex>
      <Flex align="center">
        {showTimerDropDown ? (
          <Dropdown.Root
            open={timerDropdownToggle}
            onOpenChange={setTimerDropdownToggle}
          >
            <DialogDropdownTrigger
              ref={timerDropdownRef}
              title={timerSettings[timer]}
              open={timerDropdownToggle}
              titleCss={{ c: "$on_surface_high", ml: "$md" }}
            />
            <Dropdown.Portal>
              <Dropdown.Content
                align="start"
                sideOffset={8}
                css={{
                  w: timerDropdownRef.current?.clientWidth,
                  zIndex: 1000,
                }}
              >
                {Object.keys(timerSettings).map(value => {
                  const val = parseInt(value);
                  return (
                    <Dropdown.Item
                      key={value}
                      onSelect={() => setTimer(val)}
                      css={{
                        px: "$9",
                        bg: timer === val ? selectionBg : undefined,
                      }}
                    >
                      {timerSettings[val]}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Content>
            </Dropdown.Portal>
          </Dropdown.Root>
        ) : null}
      </Flex>
    </Flex>
  );
};
