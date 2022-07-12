import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getRoutePrefix } from "../../common/utils";

export const useNavigation = () => {
  const navigate = useNavigate();
  const navigation = useCallback(
    path => {
      const route = `${getRoutePrefix()}${path}`;
      navigate(route);
    },
    [navigate]
  );
  return navigation;
};
