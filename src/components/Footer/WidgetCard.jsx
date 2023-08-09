import React from "react";
import { Flex, Text } from "@100mslive/roomkit-react";

export const WidgetCard = ({
  title,
  subtitle,
  imageSrc,
  onClick,
  css = {},
}) => {
  return (
    <Flex
      direction="column"
      css={{
        cursor: "pointer",
        w: "100%",
        "&:hover": { opacity: 0.7, r: "$0" },
        ...css,
      }}
      onClick={onClick}
      key={title}
    >
      <Flex css={{ border: "$space$px solid $border_bright", r: "$0" }}>
        <img
          src={imageSrc}
          alt={`${imageSrc}-polls`}
          style={{ borderRadius: "4px" }}
        />
      </Flex>
      <Text variant="sub2" css={{ mt: "$md", c: "$on_surface_high" }}>
        {title}
      </Text>
      <Text variant="caption" css={{ c: "$on_surface_medium", mt: "$2" }}>
        {subtitle}
      </Text>
    </Flex>
  );
};
