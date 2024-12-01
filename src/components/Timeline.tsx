import { useStore } from "../state";

import PlaybackSpeedSelector from "./PlaybackSpeedSelector";

export const Timeline = () => {
  const {
    timestamps,
    isLoading,
    isPlaying,
    current: { index },
    play,
    pause,
    setTimestampIndex,

    playbackSpeed,
    setPlaybackSpeed,
  } = useStore();

  if (isLoading || !timestamps.length) {
    return <div>Loading...</div>;
  }

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTimestampIndex(parseInt(value, 10) || 0);
  };

  return (
    <div className="timeline--container">
      {isPlaying ? (
        <button className="button" onClick={pause}>pause</button>
      ) : (
        <button className="button" onClick={play}>play</button>
      )}

      <button className="button" onClick={() => setTimestampIndex(0)}>restart</button>

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
        className="timeline--input"
      />
    </div>
  );
};
