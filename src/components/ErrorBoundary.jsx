import React, { Component } from "react";
import LogRocket from "logrocket";
import { CopyIcon } from "@100mslive/react-icons";
import {
  Box,
  Button,
  Flex,
  Text,
  ThemeContext,
  Tooltip,
} from "@100mslive/react-ui";
import { ErrorWithSupportLink } from "./PreviewScreen";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null, isErrorCopied: false };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`react error boundary - ${error.message}`, error, errorInfo);
    // Catch errors in any components below and re-render with error message
    this.setState(
      {
        error: error?.message,
        errorInfo: errorInfo,
      },
      () => {
        LogRocket.track("uiError", { error: this.state.error });
        LogRocket.captureMessage(`uiError: ${this.state.error}`, {
          tags: {
            error: this.state.error,
          },
          extra: this.state.errorInfo,
        });
      }
    );
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <Flex
          align="center"
          justify="center"
          css={{
            size: "100%",
            color: "$textPrimary",
            backgroundColor: "$bgPrimary",
          }}
        >
          <Box css={{ position: "relative", overflow: "hidden", r: "$3" }}>
            <ThemeContext.Consumer>
              {value => {
                const { themeType } = value;
                return (
                  <img
                    src={
                      themeType === "dark"
                        ? require("../images/error-bg-dark.svg")
                        : require("../images/error-bg-light.svg")
                    }
                    alt="error background"
                  />
                );
              }}
            </ThemeContext.Consumer>
            <Flex
              direction="column"
              css={{
                position: "absolute",
                size: "100%",
                top: "33.33%",
                left: 0,
              }}
            >
              <div style={{ margin: "1.5rem" }}>
                <Text>{`Something went wrong. ERROR: ${this.state.error}`}</Text>
                {ErrorWithSupportLink(`Please reload to see if it works.`)}
              </div>
              <Flex justify="center">
                <Tooltip title="Reload page">
                  <Button
                    onClick={() => {
                      window.location.reload();
                    }}
                    css={{ mx: "$4" }}
                    data-testid="join_again_btn"
                  >
                    Reload
                  </Button>
                </Tooltip>
                <Tooltip title="Copy error details to clipboard">
                  <Button
                    onClick={() => {
                      const { error, errorInfo } = this.state;
                      navigator.clipboard.writeText(
                        JSON.stringify({
                          error,
                          errorInfo,
                        })
                      );
                      this.setState({ isErrorCopied: true });
                    }}
                    css={{ mx: "$4" }}
                    data-testid="join_again_btn"
                  >
                    <CopyIcon />{" "}
                    {this.state.isErrorCopied ? "Copied" : "Copy Details"}
                  </Button>
                </Tooltip>
              </Flex>

              <details style={{ whiteSpace: "pre-wrap", margin: "1.5rem" }}>
                <Text>{this.state.error && this.state.error.toString()}</Text>
                <br />
                <Text>{JSON.stringify(this.state.errorInfo)}</Text>
              </details>
            </Flex>
          </Box>
        </Flex>
      );
    }

    return this.props.children;
  }
}
