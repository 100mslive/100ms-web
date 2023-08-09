import { CrossIcon } from "@100mslive/react-icons";
import { Dialog, Flex, Text } from "@100mslive/roomkit-react";
import { DialogCol } from "../../primitives/DialogContent";

export const PDFHeader = ({ onOpenChange, title = "", subtitle = "" }) => {
  return (
    <DialogCol
      align="start"
      css={{
        mt: 0,
        mb: "$6",
      }}
    >
      <Dialog.Title asChild>
        <Flex justify="between" align="center" css={{ w: "100%" }}>
          <Text as="h6" variant="h6">
            {title}
          </Text>
          <Flex
            onClick={() => onOpenChange(false)}
            css={{
              color: "$on_surface_high",
              cursor: "pointer",
              p: "$2",
              borderRadius: "$round",
              "&:hover": { backgroundColor: "$surface_brighter" },
            }}
          >
            <CrossIcon />
          </Flex>
        </Flex>
      </Dialog.Title>
      <Dialog.Description asChild>
        <Text
          variant="sm"
          css={{
            c: "$on_surface_medium",
          }}
        >
          {subtitle}
        </Text>
      </Dialog.Description>
    </DialogCol>
  );
};
