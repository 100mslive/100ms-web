import React, {
    useState,
    useEffect,
    Fragment
  } from "react";

  import {filters} from './../footerView'


  import {
    Button,
    ContextMenu,
    ContextMenuItem,
    HamburgerMenuIcon,
    PersonIcon,
    Settings,
    UiSettings,
    SettingsIcon,
    useHMSStore,
    selectAvailableRoleNames,
    selectLocalPeer,
    TickIcon,
    GridIcon,
    ArrowRightIcon,
    useHMSActions,
    selectPermissions,
    FullScreenIcon,
    RecordIcon,
    StarIcon,
    ChangeTextIcon,
    selectHLSState,
    HLSStreamingIcon,
  } from "@100mslive/hms-video-react";

  export const ImageFilters = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [gray,setGray] = useState(true);
    
    const [state, setSlide] = useState(1);

    let useSlider = (min, max, label, id) => {
    
        let handleChange = e => {
          setSlide(e.target.value);
          filters.brightness.set(e.target.value);
        };
        let Slider = () => (
            <>
            <label for={id}>Brightness</label>
          <input
            type="range"
            id={id}
            min={min}
            max={max}
            step={0.1}
            value={state}
            onChange={handleChange}
          />
      </>
        );
        return [state, Slider, setSlide];
      };
      let [slideValue, Slider] = useSlider(
        0,
        2,
        "Brightness",
        "Brightness"
      );

      const [state2, setSlide2] = useState(1);
      let useSlider2 = (min, max, label, id) => {
    
        let handleChange = e => {
          setSlide2(e.target.value);
          filters.contrast.set(e.target.value);
        };
        let Slider2 = () => (
            <>
            <label for={id}>Contrast</label>
          <input
            type="range"
            id={id}
            min={min}
            max={max}
            step={0.1}
            value={state2}
            onChange={handleChange}
          />
      </>
        );
        return [state2, Slider2, setSlide2];
      };
      let [slideValue2, Slider2] = useSlider2(
        0,
        2,
        "Contrast",
        "Contrast"
      );


      return (
          <Fragment>
               <ContextMenu
        menuOpen={showMenu}
        onTrigger={value => {
          setShowMenu(value);
        }}
        classes={{
          root: "static",
          trigger: "bg-transparent-0",
          menu: "mt-0 py-0 w-52",
        }}
        trigger={
          <Button
            iconOnly
            variant="no-fill"
            iconSize="md"
            shape="rectangle"
            active={showMenu}
            key="hamburgerIcon"
          >
            <HamburgerMenuIcon />
          </Button>
        }
        menuProps={{
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          transformOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
        }}
      >
        <ContextMenuItem
          label="Gray"
          key="grayscale"
          onClick={() => {
            filters.grayscale.set(gray);
            setGray(!gray);
          }}/>
          <Slider/>
          <Slider2/>

      </ContextMenu>
          </Fragment>
      )
  };