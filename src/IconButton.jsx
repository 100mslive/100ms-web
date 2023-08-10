import { IconButton as BaseIconButton, styled } from "@100mslive/roomkit-react";

const IconButton = styled(BaseIconButton, {
  width: "$14",
  height: "$14",
  border: "1px solid $border_bright",
  r: "$1",
  variants: {
    active: {
      false: {
        border: "1px solid transparent",
        color: "$on_primary_high",
      },
    },
  },
});

export default IconButton;
