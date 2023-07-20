import { useTheme } from "@100mslive/roomkit-react";

export const useDropdownSelection = () => {
  const { themeType } = useTheme();
  return themeType === "dark" ? "$primaryDark" : "$grayLight";
};
