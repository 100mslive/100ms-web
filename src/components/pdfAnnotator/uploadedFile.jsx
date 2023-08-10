import { TrashIcon } from "@100mslive/react-icons";
import { Dialog, Flex, Text } from "@100mslive/roomkit-react";
import { DialogRow } from "../../primitives/DialogContent";
import { PDFHeader } from "./pdfHeader";
import { PDFInfo } from "./pdfInfo";
import { SubmitPDF } from "./submitPdf";

export const UploadedFile = ({
  pdfFile,
  pdfURL,
  isValidateProgress,
  setPDFFile,
  setIsPDFUrlValid,
  setIsValidateProgress,
  onOpenChange,
}) => {
  const [fileName, ext] = pdfFile.name.split(".");
  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          css={{
            w: "min(420px,80%)",
            overflow: "auto",
            p: "$10",
          }}
        >
          <Flex direction="column">
            <PDFHeader
              onOpenChange={onOpenChange}
              title="Ready to Share?"
              subtitle="Please check that the PDF selected is correct"
            />
            <DialogRow
              css={{
                fontFamily: "$sans",
                bg: "$surface_bright",
                r: "$1",
                outline: "none",
                border: "1px solid $border_bright",
                p: "$4 $6",
                minHeight: "$11",
                c: "$on_surface_high",
                fs: "$md",
                w: "100%",
                "&:focus": {
                  boxShadow: "0 0 0 1px $colors$primary_default",
                  border: "1px solid $transparent",
                },
                mb: "$8",
                mt: "$6",
              }}
            >
              <Flex direction="row" css={{ flexGrow: "1", maxWidth: "88%" }}>
                <Text
                  css={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fileName}
                </Text>
                <Text css={{ whiteSpace: "nowrap" }}>.{ext}</Text>
              </Flex>
              <TrashIcon
                onClick={() => setPDFFile(null)}
                style={{
                  cursor: "pointer",
                }}
              />
            </DialogRow>
            <PDFInfo />
            <SubmitPDF
              pdfFile={pdfFile}
              pdfURL={pdfURL}
              isValidateProgress={isValidateProgress}
              setIsPDFUrlValid={setIsPDFUrlValid}
              setIsValidateProgress={setIsValidateProgress}
              onOpenChange={onOpenChange}
            />
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
