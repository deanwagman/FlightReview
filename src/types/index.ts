export type telemetryData = {
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
