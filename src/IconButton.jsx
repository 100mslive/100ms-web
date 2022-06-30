import { IconButton as BaseIconButton, styled } from "@100mslive/react-ui";

const IconButton = styled(BaseIconButton, {
  width: "$13",
  height: "$13",
  border: "1px solid $borderLight",
  r: "$1",
  variants: {
    active: {
      false: {
        border: "none",
      },
    },
  },
});

export default IconButton;
