import { css } from "@100mslive/react-ui";
export const settingOverflow = css({
  flex: "1 1 0",
  pr: "$12",
  mr: "-$12",
  overflowY: "auto",
});

export const settingContent = css({
  display: "flex",
  flexDirection: "column",
  "&[hidden]": {
    display: "none",
  },
});
