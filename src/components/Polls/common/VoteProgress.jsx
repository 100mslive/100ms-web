import { Progress } from "@100mslive/roomkit-react";

export const VoteProgress = ({ response, option, totalResponses }) => {
  const showProgress =
    response &&
    typeof option.voteCount === "number" &&
    typeof totalResponses === "number" &&
    totalResponses > 0;
  const progressValue = (100 * option.voteCount) / totalResponses;

  return showProgress ? (
    <Progress.Root value={progressValue}>
      <Progress.Content
        style={{
          transform: `translateX(-${100 - progressValue}%)`,
        }}
      />
    </Progress.Root>
  ) : null;
};
