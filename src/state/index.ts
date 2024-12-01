import { create } from "zustand";
import { type TelemetryData, type State } from "../types";

// Utility function to map input data to the state format
const mapInputDataToState = (
  data: TelemetryData[]
): { telemetryMap: Record<string, TelemetryData>; timestamps: string[] } => {
  const telemetryMap: Record<string, TelemetryData> = {};
  const timestamps: string[] = [];

  data.forEach((entry: TelemetryData) => {
    telemetryMap[entry.timestamp] = entry;
    timestamps.push(entry.timestamp);
  });

  return { telemetryMap, timestamps };
};

export const useStore = create<State>((set, get) => ({
  telemetryData: {},
  timestamps: [],
  isLoading: false,
  error: null,
  current: {
    entry: null,
    timestamp: null,
    index: null,
  },

  setTimestamp: (timestamp) =>
    set((state) => {
      const index = state.timestamps.indexOf(timestamp);
      if (index === -1) {
        return { current: { entry: null, timestamp: null, index: null } };
      }
      return {
        current: {
          entry: state.telemetryData[timestamp] || null,
          timestamp,
          index,
        },
      };
    }),

  setTimestampIndex: (index) =>
    set((state) => {
      if (index < 0 || index >= state.timestamps.length) {
        return { current: { entry: null, timestamp: null, index: null } };
      }
      const timestamp = state.timestamps[index];
      return {
        current: {
          entry: state.telemetryData[timestamp] || null,
          timestamp,
          index,
        },
      };
    }),

  playbackSpeed: 1,
  isPlaying: false,
  playTimeout: null,

  play: () => {
    const { playTimeout } = get();
    if (playTimeout) {
      clearTimeout(playTimeout);
    }

    set({ isPlaying: true });

    const playNextFrame = () => {
      const { isPlaying, current, timestamps, setTimestamp, playbackSpeed } =
        get();

      if (!isPlaying || current.index === null) {
        set({ playTimeout: null });
        return;
      }

      const nextIndex = current.index + 1;
      if (nextIndex < timestamps.length) {
        setTimestamp(timestamps[nextIndex]);

        // Calculate the delay based on playbackSpeed
        const intervalTime = 1000 / playbackSpeed;

        // Schedule the next frame
        const timeoutId = setTimeout(playNextFrame, intervalTime);

        // Store the timeout ID
        set({ playTimeout: timeoutId });
      } else {
        set({ isPlaying: false, playTimeout: null });
      }
    };

    // Start playback
    playNextFrame();
  },

  pause: () => {
    const { playTimeout } = get();
    if (playTimeout) {
      clearTimeout(playTimeout);
      set({ playTimeout: null, isPlaying: false });
    }
  },

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  importData: async (endpoint) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const responseData = (await response.json()) as { data: TelemetryData[] };
      const { data } = responseData;

      const { telemetryMap, timestamps } = mapInputDataToState(data);

      set({
        telemetryData: telemetryMap,
        timestamps,
        current: {
          entry: telemetryMap[timestamps[0]] ?? null,
          timestamp: timestamps[0] || null,
          index: 0,
        },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error : new Error("Unknown error"),
        isLoading: false,
      });
    }
  },
}));
