import React from "react";
import { Input, Button, styled } from "@100mslive/react-ui";
import { isStreamingKit } from "../../common/utils";

const PreviewName = ({ name, onChange, onJoin, enableJoin }) => {
  const formSubmit = e => {
    e.preventDefault();
  };
  return (
    <Form onSubmit={formSubmit}>
      <Input
        required
        id="name"
        css={{ w: "100%", "@sm": "400px" }}
        value={name}
        onChange={e => onChange(e.target.value)}
        placeholder="Enter your name"
        autoFocus
      />
      <Button type="submit" disabled={!name || !enableJoin} onClick={onJoin}>
        {isStreamingKit() ? "Join Stream" : "Join Room"}
      </Button>
    </Form>
  );
};

const Form = styled("form", {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "$4",
  mt: "$10",
});

export default PreviewName;
