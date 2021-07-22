import {
  Header,
  ParticipantList,
  useHMSStore,
  VolumeIcon,
  Text,
  selectDominantSpeaker,
  MessageModal,
  Button,
  useHMSActions,
} from "@100mslive/hms-video-react";
import React from "react";
import { useState } from "react";
import { selectAvailableRoles } from "@100mslive/hms-video-react";

const SpeakerTag = () => {
  const dominantSpeaker = useHMSStore(selectDominantSpeaker);
  return dominantSpeaker && dominantSpeaker.name ? (
    <div className="self-center focus:outline-none text-lg flex items-center">
      <VolumeIcon />
      <Text
        variant="body"
        size="md"
        classes={{ root: "truncate max-w-xs ml-1 flex-1" }}
        title={dominantSpeaker.name}
      >
        {dominantSpeaker.name}
      </Text>
    </div>
  ) : (
    <></>
  );
};

export const ConferenceHeader = ({ onParticipantListOpen }) => {
  const [showRoleChange, setShowRoleChange] = useState(false);
  const [peer, setPeer] = useState(null);
  const roles = useHMSStore(selectAvailableRoles);
  const hmsActions = useHMSActions();

  return (
    <>
      <MessageModal
        title="Change role"
        show={showRoleChange}
        onClose={() => setShowRoleChange(false)}
        body={
          <ul className="space-y-2">
            {roles.map(role => (
              <li key={role.name}>
                <Button
                  onClick={() => {
                    if (peer) {
                      hmsActions.changeRole(peer, role.name);
                      setPeer(null);
                    }
                    setShowRoleChange(false);
                  }}
                >
                  {role.name}
                </Button>
              </li>
            ))}
          </ul>
        }
      />
      <Header
        centerComponents={[<SpeakerTag key={0} />]}
        rightComponents={[
          <ParticipantList
            key={0}
            onToggle={onParticipantListOpen}
            onRoleChangeClick={peer => {
              setPeer(peer);
              setShowRoleChange(true);
            }}
          />,
        ]}
        classes={{ root: "h-full" }}
      />
    </>
  );
};
