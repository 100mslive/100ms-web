import React, { useState } from "react";
import {
  Dialog,
  Flex,
  HorizontalDivider,
  Input,
  Text,
} from "@100mslive/react-ui";
import { DialogInputFile, DialogRow } from "../../primitives/DialogContent";
import { PdfErrorView } from "./pdfErrorView";
import { PDFHeader } from "./pdfHeader";
import { PDFInfo } from "./pdfInfo";
import { SubmitPDF } from "./submitPdf";
import { UploadedFile } from "./uploadedFile";

export function PDFFileOptions({ onOpenChange }) {
  const [isPDFUrlValid, setIsPDFUrlValid] = useState(true);
  const [isValidateProgress, setIsValidateProgress] = useState(false);
  const [pdfFile, setPDFFile] = useState(null);
  const [pdfURL, setPDFURL] = useState("");

  return !pdfFile ? (
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
            <PDFHeader />
            <DialogInputFile
              onChange={target => {
                setPDFFile(target.files[0]);
              }}
              placeholder="Click to upload"
              type="file"
              accept=".pdf"
            />
            <DialogRow
              css={{
                m: "$10 0",
              }}
            >
              <HorizontalDivider
                css={{
                  mr: "$4",
                }}
              />
              <Text
                variant="tiny"
                css={{
                  color: "$textDisabled",
                }}
              >
                OR
              </Text>
              <HorizontalDivider
                css={{
                  ml: "$4",
                }}
              />
            </DialogRow>
            <Text
              variant="sm"
              css={{
                py: "$2",
              }}
            >
              Import from URL
            </Text>
            <Input
              css={{ w: "100%", mb: "$10" }}
              value={pdfURL}
              onFocus={() => {
                setIsPDFUrlValid(true);
                setIsValidateProgress(false);
              }}
              onChange={e => {
                setPDFURL(e.target.value);
              }}
              placeholder="Add PDF URL"
              type="text"
              error={!isPDFUrlValid}
            />
            {!isPDFUrlValid && <PdfErrorView isPDFUrlValid={isPDFUrlValid} />}
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
  ) : (
    <UploadedFile
      pdfFile={pdfFile}
      pdfURL={pdfURL}
      isValidateProgress={isValidateProgress}
      setPDFFile={setPDFFile}
      setIsPDFUrlValid={setIsPDFUrlValid}
      setIsValidateProgress={setIsValidateProgress}
      onOpenChange={onOpenChange}
    />
  );
}
