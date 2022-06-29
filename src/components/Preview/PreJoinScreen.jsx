import React, { useState } from "react";
import { Text, Input, Button, Label, styled } from "@100mslive/react-ui";
import { ArrowRightIcon } from "@100mslive/react-icons";
import {
  useUserPreferences,
  UserPreferencesKeys,
  defaultPreviewPreference,
} from "../hooks/useUserPreferences";
import UserMusicIcon from "../../images/UserMusicIcon";

const PreJoinScreen = ({ initialName, setIsNameScreen }) => {
  const [previewPreference, setPreviewPreference] = useUserPreferences(
    UserPreferencesKeys.PREVIEW,
    defaultPreviewPreference
  );
  const formSubmit = e => {
    e.preventDefault();
    setPreviewPreference({
      ...previewPreference,
      name,
    });
    setIsNameScreen(false);
  };
  const [name, setName] = useState(initialName || previewPreference.name);
  return (
    <>
      <UserMusicIcon />
      <Text css={{ mt: "$8", mb: "$4" }} variant="h4">
        Jump right in!
      </Text>
      <Text css={{ c: "$textMedEmp", textAlign: "center" }} variant="body1">
        Enter your name to join
      </Text>
      <Form onSubmit={formSubmit}>
        <InputField>
          <Label htmlFor="name">
            <Text css={{ c: "$textHighEmp" }} variant="body2">
              Name
            </Text>
          </Label>
          <Input
            id="name"
            css={{ w: "100%", "@sm": "400px" }}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            autoFocus
          />
        </InputField>

        <Button type="submit" icon>
          Get Started <ArrowRightIcon />
        </Button>
      </Form>
    </>
  );
};

const InputField = styled("fieldset", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  margin: "$12 0",
  "& > * + *": {
    marginTop: "$2",
    marginBottom: "0rem",
  },
});

const Form = styled("form", {
  maxWidth: "400px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "0 $8",
});

export default PreJoinScreen;
