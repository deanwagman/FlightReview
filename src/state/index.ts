import { create } from "zustand";
import { type TelemetryData } from "../types";

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
};

export const useStore = create<State>((set) => ({
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
