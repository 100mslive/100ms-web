import { IconButton as BaseIconButton, styled } from "@100mslive/react-ui";

const IconButton = styled(BaseIconButton, {
  width: "$14",
  height: "$14",
  border: "1px solid $borderLight",
  r: "$1",
  variants: {
    active: {
      false: {
        border: "1px solid transparent",
        color: "$white",
      },
    },
  },
});

export default IconButton;
