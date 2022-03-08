import { Loading } from "@100mslive/react-ui";

const FullPageProgress = () => (
  <div className="h-full">
    <div className="flex justify-center h-full items-center">
      <Loading size={100} />
    </div>
  </div>
);

export default FullPageProgress;
