import { InfoIcon } from "@100mslive/react-icons";
import { Text } from "@100mslive/roomkit-react";
import { DialogRow } from "../../primitives/DialogContent";
import { isChrome } from "../../common/constants";

export const PDFInfo = () => {
  if (!isChrome) {
    return null;
  }

  return (
    <DialogRow
      css={{
        p: "$8",
        bg: "$surfaceLight",
        r: "$1",
        outline: "none",
        border: "1px solid $borderLight",
        mt: "$0",
      }}
    >
      <InfoIcon
        height={20}
        width={20}
        style={{
          marginRight: "16px",
          minWidth: "20px",
        }}
      />
      <Text variant="caption" css={{ color: "$textMedEmp" }}>
        On the next screen, ensure you select{" "}
        <span style={{ fontWeight: "600" }}>“This Tab”</span> and click on{" "}
        <span style={{ fontWeight: "600" }}>“Share” </span>
      </Text>
    </DialogRow>
  );
};
