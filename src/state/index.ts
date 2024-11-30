/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { create } from "zustand";
import { type TelemetryData } from "../types";

type Coordinate = {
  latitude: number;
  longitude: number;
};

// Utility function to map input data to the state format
const mapInputDataToState = (data: Array<{ timestamp: string }>) => {
  const telemetryMap: { [key: string]: TelemetryData } = {};
  const timestamps: string[] = [];

  data.forEach((entry) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    telemetryMap[entry.timestamp] = entry as TelemetryData;
    timestamps.push(entry.timestamp);
  });

  return { telemetryMap, timestamps };
};

// Define the Zustand store state type
type State = {
  telemetryData: { [key: string]: TelemetryData };
  timestamps: string[];
  isLoading: boolean;
  error?: Error | null;
  importData: (endpoint: string) => Promise<void>;

  current: {
    entry: TelemetryData | null;
    timestamp: string | null;
    index: number | null;
  };

  setTimestamp: (timestamp: string) => void;
  setTimestampIndex: (index: number) => void;

  play: () => void;
  pause: () => void;
  isPlaying: boolean;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const entry = state.telemetryData[timestamp] || null;
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        current: { entry, timestamp, index },
      };
    }),

  setTimestampIndex: (index) =>
    set((state) => {
      if (index < 0 || index >= state.timestamps.length) {
        return { current: { entry: null, timestamp: null, index: null } };
      }
      const timestamp = state.timestamps[index];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const entry = state.telemetryData[timestamp] || null;
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        current: { entry, timestamp, index },
      };
    }),

  playbackSpeed: 1,
  isPlaying: false,
  playTimeout: null,
  play: () => {
    // Clear any existing timeout
    const { playTimeout } = get();
    if (playTimeout) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      clearTimeout(playTimeout);
      set({ playTimeout: null, isPlaying: false });
    }
  },

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  importData: async (endpoint: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      type ResponseData = { data: Array<{ timestamp: string }> };
      const responseData: ResponseData =
        (await response.json()) as ResponseData;
      const { data } = responseData;

      const { telemetryMap, timestamps } = mapInputDataToState(data);

      set({
        telemetryData: telemetryMap,
        timestamps: timestamps,
        current: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          entry: telemetryMap[timestamps[0]] || null,
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
