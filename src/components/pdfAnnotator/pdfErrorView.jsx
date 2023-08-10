import { InfoIcon } from "@100mslive/react-icons";
import { Text } from "@100mslive/roomkit-react";
import { DialogRow } from "../../primitives/DialogContent";

export const PdfErrorView = ({ isPDFUrlValid }) => {
  return (
    !isPDFUrlValid && (
      <DialogRow
        css={{
          mt: "-$8",
          color: "$alert_error_default",
          justifyContent: "start",
        }}
      >
        <InfoIcon width="12px" height="12px" />
        <Text
          variant="caption"
          css={{
            pl: "$1",
            color: "$alert_error_default",
          }}
        >
          Please enter a valid PDF URL
        </Text>
      </DialogRow>
    )
  );
};
