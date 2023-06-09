import { useCallback } from "react";
import { Button, Flex } from "@100mslive/react-ui";
import { useSetAppDataByKey } from "../AppData/useUISettings";
import { APP_DATA } from "../../common/constants";

export const SubmitPDF = ({
  pdfFile,
  pdfURL,
  isValidateProgress,
  setIsPDFUrlValid,
  setIsValidateProgress,
  onOpenChange,
}) => {
  const [, setPDFConfig] = useSetAppDataByKey(APP_DATA.pdfConfig);

  const isValidPDF = useCallback(
    pdfURL => {
      const extension = pdfURL.split(".").pop().toLowerCase();
      setIsValidateProgress(true);
      if (extension === "pdf") {
        setIsPDFUrlValid(true);
        setIsValidateProgress(false);
        setPDFConfig({ state: true, file: pdfFile, url: pdfURL });
        onOpenChange(false);
      }

      fetch(pdfURL, { method: "HEAD" })
        .then(response => response.headers.get("content-type"))
        .then(contentType => {
          if (contentType === "application/pdf") {
            setIsPDFUrlValid(true);
            setIsValidateProgress(false);
            setPDFConfig({ state: true, file: pdfFile, url: pdfURL });
            onOpenChange(false);
          } else {
            setIsPDFUrlValid(false);
            setIsValidateProgress(false);
          }
        })
        .catch(error => {
          setIsPDFUrlValid(false);
          setIsValidateProgress(false);
        });
    },
    [
      onOpenChange,
      pdfFile,
      setIsPDFUrlValid,
      setIsValidateProgress,
      setPDFConfig,
    ]
  );
  return (
    <Flex
      direction="row"
      css={{
        mb: "0",
        mt: "auto",
        gap: "$8",
      }}
    >
      <Button
        variant="standard"
        outlined
        type="submit"
        onClick={() => {
          onOpenChange(false);
        }}
        css={{ w: "50%" }}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        type="submit"
        onClick={() => {
          if (pdfFile) {
            setPDFConfig({ state: true, file: pdfFile, url: pdfURL });
            onOpenChange(false);
          } else if (pdfURL) {
            isValidPDF(pdfURL);
          }
        }}
        disabled={!pdfFile && !pdfURL}
        loading={isValidateProgress}
        data-testid="share_pdf_btn"
        css={{
          w: "50%",
        }}
      >
        Start Sharing
      </Button>
    </Flex>
  );
};
