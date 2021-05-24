import {
    selectPeers,
    useHMSStore,
} from "@100mslive/sdk-components";
import React, { useContext } from "react";
import { AppContext } from "../store/AppContext";
import {ROLES} from "../common/roles";
import {GridCenterView, GridSidePaneView} from "./components/gridView";

export const StudentGridView = ({ isChatOpen, toggleChat }) => {
    const { maxTileCount } = useContext(AppContext);
    const peers = useHMSStore(selectPeers);
    const teacherPeers = peers.filter(peer => peer.role === ROLES.TEACHER);
    const studentPeers = peers.filter(peer => peer.role === ROLES.STUDENT);
    return <React.Fragment>
        <GridCenterView
            peers={teacherPeers}
            maxTileCount={2}
            allowRemoteMute={false}
        ></GridCenterView>
        <GridSidePaneView
            peers={studentPeers}
            maxTileCount={maxTileCount}
            isChatOpen={isChatOpen}
            toggleChat={toggleChat}
        ></GridSidePaneView>
    </React.Fragment>
}
