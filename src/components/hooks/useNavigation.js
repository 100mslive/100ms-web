import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getRoutePrefix } from "../../common/utils";

export const useNavigation = () => {
  const navigate = useNavigate();
  const navigation = useCallback(
    path => {
      const prefix = getRoutePrefix();
      let route = path;
      if (prefix && !path.startsWith(prefix)) {
        route = `${prefix}${path}`;
      }
      navigate(route);
    },
    [navigate]
  );
  return navigation;
};
