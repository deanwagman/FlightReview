import React, { useState, useRef, useEffect } from "react";

type PlaybackSpeedSelectorProps = {
  currentSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
};

const playbackOptions = [
  { label: "1X", value: 1 },
  { label: "2X", value: 2 },
  { label: "5X", value: 5 },
  { label: "10X", value: 10 },
  { label: "30X", value: 30 },
];

const PlaybackSpeedSelector: React.FC<PlaybackSpeedSelectorProps> = ({
  currentSpeed,
  setPlaybackSpeed,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  // Close the popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Find the index of the current speed for the slider
  const currentIndex = playbackOptions.findIndex(
    (option) => option.value === currentSpeed
  );

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(event.target.value, 10);
    const selectedSpeed = playbackOptions[index].value;
    setPlaybackSpeed(selectedSpeed);
  };

  return (
    <div style={{ position: "relative" }} ref={selectorRef}>
      <button onClick={() => setIsOpen((prev) => !prev)} className="button">
        {currentSpeed}X
      </button>

      {isOpen && (
        <div className="playback-speed--popover">
          <input
            type="range"
            min="0"
            max={playbackOptions.length - 1}
            step="1"
            value={currentIndex !== -1 ? currentIndex : 0}
            onChange={handleSliderChange}
            className="playback-speed--input"
            list="playback-speed-options"
          />
          <datalist id="playback-speed-options">
            {playbackOptions.map((option, index) => (
              <option key={option.value} value={index} label={option.label} />
            ))}
          </datalist>
          <div className="playback-speed--labels">
            {playbackOptions.map((option) => (
              <span key={option.value}>{option.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaybackSpeedSelector;
