// {
// "avionics": {
//     "latitude": "37.4579430",
//     "longitude": "-122.1122284",
//     "altitudeFt": "23.8",
//     "groundSpeedKt": "7.41",
//     "pitchDeg": "2.01",
//     "rollDeg": "0.96"
// },
// "battery": {
//     "volts": "28.0",
//     "amps": "0.5"
// },
// "engine": {
//     "fuelFlowGPH": "4.47",
//     "oilTempF": "170.25",
//     "oilPressurePSI": "59.76",
//     "rpm": "1312.2"
// },
// "timestamp": "2020-09-22T14:11:14.097Z"
// }

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
