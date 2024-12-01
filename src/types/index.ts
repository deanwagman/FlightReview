export type TelemetryData = {
  avionics: {
    latitude: string;
    longitude: string;
    altitudeFt: string;
    groundSpeedKt: string;
    pitchDeg: string;
    rollDeg: string;
  };
  battery: {
    volts: string;
    amps: string;
  };
  engine: {
    fuelFlowGPH: string;
    oilTempF: string;
    oilPressurePSI: string;
    rpm: string;
  };
  timestamp: string;
};

export type CurrentEntry = {
  entry: TelemetryData | null;
  timestamp: string | null;
  index: number | null;
};

export type ChartDataPoints = {
  altitudeFt: boolean;
  groundSpeedKt: boolean;
  fuelFlowGPH: boolean;
  oilTempF: boolean;
  oilPressurePSI: boolean;
  volts: boolean;
  amps: boolean;
};

export type State = {
  telemetryData: Record<string, TelemetryData>;
  timestamps: string[];
  isLoading: boolean;
  error: Error | null;
  current: CurrentEntry;

  setTimestamp: (timestamp: string) => void;
  setTimestampIndex: (index: number) => void;

  play: () => void;
  pause: () => void;
  isPlaying: boolean;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  playTimeout: NodeJS.Timeout | null;

  importData: (endpoint: string) => Promise<void>;

  chartDataPoints: ChartDataPoints;
  setChartDataPoints: (dataPoints: ChartDataPoints) => void;
};
