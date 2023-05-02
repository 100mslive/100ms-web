import { useEffect } from "react";
import { useSetAppDataByKey } from "../AppData/useUISettings";
import { APP_DATA } from "../../common/constants";

export const useDropdownList = ({ name, open }) => {
  const [dropdownList = [], setDropdownList] = useSetAppDataByKey(
    APP_DATA.dropdownList
  );

  useEffect(() => {
    if (open) {
      if (!dropdownList.includes(name)) {
        setDropdownList([...dropdownList, name]);
      }
    } else {
      const index = dropdownList.indexOf(name);
      if (index >= 0) {
        const newDropdownList = [...dropdownList];
        newDropdownList.splice(index, 1);
        setDropdownList(newDropdownList);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, name]);
};
