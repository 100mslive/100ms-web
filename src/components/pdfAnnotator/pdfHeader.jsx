import { Dialog, Text } from "@100mslive/react-ui";
import { DialogCol } from "../../primitives/DialogContent";

export const PDFHeader = () => {
  return (
    <DialogCol
      align="start"
      css={{
        mt: 0,
        mb: "$6",
      }}
    >
      <Dialog.Title asChild>
        <Text as="h6" variant="h6">
          Share PDF
        </Text>
      </Dialog.Title>
      <Dialog.Description asChild>
        <Text
          variant="sm"
          css={{
            c: "$textMedEmp",
          }}
        >
          Choose PDF you want to annotate and share
        </Text>
      </Dialog.Description>
    </DialogCol>
  );
};
