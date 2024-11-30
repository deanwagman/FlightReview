import { useState } from "react";
import { useStore } from "../state";

import PlaybackSpeedSelector  from "./PlaybackSpeedSelector";

const buttonStyle = {
  backgroundColor: "#FFDD35",
  borderColor: "#FFDD35",
};

export const Timeline = () => {
  const {
    timestamps,
    isLoading,
    isPlaying,
    current: { timestamp, index },
    play,
    pause,
    setTimestampIndex,

    playbackSpeed,
    setPlaybackSpeed,
  } = useStore();
  const [showPlaybackSpeed, setShowPlaybackSpeed] = useState(false);

  if (isLoading || !timestamps.length) {
    return <div>Loading...</div>;
  }

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTimestampIndex(parseInt(value, 10) || 0);
  };

  const handlePlaybackSpeedToggle = () => {
    setShowPlaybackSpeed((show) => !show);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        blockSize: "100%",
        flex: 0,
        gap: "1em",
        padding: "5em",
      }}
    >
      <button
        onClick={() => {
          if (isPlaying) {
            pause();
          } else {
            play();
          }
        }}
        style={buttonStyle}
      >
        &#9199;
      </button>
      <button onClick={() => setTimestampIndex(0)} style={buttonStyle}>
        &#9198;
      </button>
      <PlaybackSpeedSelector
          currentSpeed={playbackSpeed}
          setPlaybackSpeed={setPlaybackSpeed}
        />

      <input
        type="range"
        min="0"
        max={timestamps.length - 1}
        step="1"
        value={index || 0}
        onChange={handleChange}
        style={{
          width: "100%",
        }}
      />
    </div>
  );
};
