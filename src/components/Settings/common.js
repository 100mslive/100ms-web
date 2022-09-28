import { css } from "@100mslive/react-ui";
export const settingOverflow = css({
  overflowY: "auto",
  flex: "1 1 0",
  pr: "$12",
  mr: "-$12",
});

export const settingContent = css({
  display: "flex",
  flexDirection: "column",
  "&[hidden]": {
    display: "none",
  },
});
