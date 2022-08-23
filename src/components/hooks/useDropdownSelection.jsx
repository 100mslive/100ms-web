import { useTheme } from "@100mslive/react-ui";

export const useDropdownSelection = () => {
  const { themeType } = useTheme();
  return themeType === "dark" ? "$primaryDark" : "$grayLight";
};
