import { useCallback } from "react";
import { Button, Flex } from "@100mslive/roomkit-react";
import {
  useResetPDFConfig,
  useSetAppDataByKey,
} from "../AppData/useUISettings";
import { isValidURL } from "../../common/utils";
import { APP_DATA } from "../../common/constants";

export const SubmitPDF = ({
  pdfFile,
  pdfURL,
  isValidateProgress,
  setIsPDFUrlValid,
  setIsValidateProgress,
  onOpenChange,
  hideSecondaryCTA = false,
  setPDFFile = () => {},
}) => {
  const [, setPDFConfig] = useSetAppDataByKey(APP_DATA.pdfConfig);
  const isValidPDF = useCallback(
    pdfURL => {
      setIsValidateProgress(true);
      const isValid = isValidURL(pdfURL);
      if (isValid) {
        setIsPDFUrlValid(true);
        setIsValidateProgress(false);
        setPDFConfig(pdfURL);
        onOpenChange(false);
      } else {
        setIsPDFUrlValid(false);
        setIsValidateProgress(false);
      }
    },
    [onOpenChange, setIsPDFUrlValid, setIsValidateProgress, setPDFConfig]
  );
  const resetConfig = useResetPDFConfig();
  return (
    <Flex
      direction="row"
      css={{
        mb: "0",
        mt: "auto",
        gap: "$8",
      }}
    >
      {hideSecondaryCTA ? null : (
        <Button
          variant="standard"
          outlined
          type="submit"
          onClick={() => {
            resetConfig();
            setPDFFile(null);
          }}
          css={{ w: "50%" }}
        >
          Go Back
        </Button>
      )}
      <Button
        variant="primary"
        type="submit"
        onClick={async () => {
          if (pdfFile) {
            setPDFConfig(pdfFile);
            onOpenChange(false);
          } else if (pdfURL) {
            isValidPDF(pdfURL);
          }
        }}
        disabled={!pdfFile && !pdfURL}
        loading={isValidateProgress}
        data-testid="share_pdf_btn"
        css={{
          w: hideSecondaryCTA ? "100%" : "50%",
        }}
      >
        Start Sharing
      </Button>
    </Flex>
  );
};
