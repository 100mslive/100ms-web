// @ts-check
import React from "react";
import { CheckCircleIcon } from "@100mslive/react-icons";
import { Box, Button, Flex, Text } from "@100mslive/roomkit-react";
import { QUESTION_TYPE_TITLE } from "../../../common/constants";

export const SavedQuestion = ({ question, index, length, convertToDraft }) => {
  return (
    <>
      <Text variant="overline" css={{ c: "$on_surface_low" }}>
        Question {index + 1} of {length}: {QUESTION_TYPE_TITLE[question.type]}
      </Text>
      <Text variant="body2" css={{ mt: "$4", mb: "$md" }}>
        {question.text}
      </Text>
      {question.options.map(option => (
        <Flex css={{ alignItems: "center" }}>
          <Text variant="body2" css={{ my: "$xs", c: "$on_surface_medium" }}>
            {option.text}
          </Text>
          {option.isCorrectAnswer && (
            <Box css={{ color: "$alert_success", mx: "$xs" }}>
              <CheckCircleIcon />
            </Box>
          )}
        </Flex>
      ))}
      <Flex justify="end" css={{ w: "100%" }}>
        <Button
          variant="standard"
          css={{ fontWeight: "$semiBold", p: "$4 $8" }}
          onClick={() => convertToDraft(question.draftID)}
        >
          Edit
        </Button>
      </Flex>
    </>
  );
};
