import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "../state";
import type { TelemetryData, ChartDataPoints } from "../types";

type AdaptedData = {
  timestamp: string;
  fuelFlow: number;
  oilTemp: number;
  oilPressure: number;
  volts: number;
  amps: number;
}[];

// Safely adapt data to the chart format
const adaptData = (
  telemetryData: Record<string, TelemetryData>,
  timestamps: string[],
  index: number,
  chartDataPoints: ChartDataPoints
): AdaptedData => {
  return timestamps.slice(0, index + 1).map((timestamp) => {
    const telemetry = telemetryData[timestamp];

    // Handle undefined or missing telemetry gracefully
    if (!telemetry) {
      console.warn(`Missing telemetry data for timestamp: ${timestamp}`);
      return {
        timestamp,
        fuelFlow: 0,
        oilTemp: 0,
        oilPressure: 0,
        volts: 0,
        amps: 0,
      };
    }

    const { avionics, engine, battery } = telemetry;

    return {
      timestamp,
      altitude: chartDataPoints.altitudeFt
        ? parseFloat(avionics.altitudeFt) || 0
        : undefined,
      groundSpeed: chartDataPoints.groundSpeedKt
        ? parseFloat(avionics.groundSpeedKt) || 0
        : undefined,
      fuelFlow: chartDataPoints.fuelFlowGPH
        ? parseFloat(engine.fuelFlowGPH) || 0
        : undefined,
      oilTemp: chartDataPoints.oilTempF
        ? parseFloat(engine.oilTempF) || 0
        : undefined,
      oilPressure: chartDataPoints.oilPressurePSI
        ? parseFloat(engine.oilPressurePSI) || 0
        : undefined,
      volts: chartDataPoints.volts ? parseFloat(battery.volts) || 0 : undefined,
      amps: chartDataPoints.amps ? parseFloat(battery.amps) || 0 : undefined,
    };
  });
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  // Format the date as needed, e.g., "HH:MM AM/PM"
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const Chart = () => {
  const {
    telemetryData,
    timestamps,
    setTimestamp,
    current: { index: currentIndex },
    chartDataPoints,
  } = useStore();

  const data = adaptData(
    telemetryData,
    timestamps,
    currentIndex,
    chartDataPoints
  );

  const handleClicked = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    // Set the current timestamp from clicked payload
    const timestamp = String(
      (
        e as React.MouseEvent<SVGElement, MouseEvent> & {
          activePayload?: { payload?: { timestamp: string } }[];
        }
      ).activePayload?.[0]?.payload?.timestamp
    );
    if (timestamp) {
      setTimestamp(timestamp);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        onClick={handleClicked}
      >
        <defs>
          <linearGradient id="colorAltitude" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFDD35" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FFDD35" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorGroundSpeed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF5733" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FF5733" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorFuelFlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFA500" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FFA500" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorOilTemp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF5733" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FF5733" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorOilPressure" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#1E90FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorVolts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#32CD32" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#32CD32" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorAmps" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF69B4" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FF69B4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="timestamp"
          padding={{ right: 50 }}
          tickFormatter={formatTime}
        />
        <YAxis allowDataOverflow={true} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="altitude"
          stroke="#FFDD35"
          fillOpacity={1}
          fill="url(#colorAltitude)"
        />
        <Area
          type="monotone"
          dataKey="groundSpeed"
          stroke="#FF5733"
          fillOpacity={1}
          fill="url(#colorGroundSpeed)"
        />
        <Area
          type="monotone"
          dataKey="fuelFlow"
          stroke="#FFA500"
          fillOpacity={1}
          fill="url(#colorFuelFlow)"
        />
        <Area
          type="monotone"
          dataKey="oilTemp"
          stroke="#FF5733"
          fillOpacity={1}
          fill="url(#colorOilTemp)"
        />
        <Area
          type="monotone"
          dataKey="oilPressure"
          stroke="#1E90FF"
          fillOpacity={1}
          fill="url(#colorOilPressure)"
        />
        <Area
          type="monotone"
          dataKey="volts"
          stroke="#32CD32"
          fillOpacity={1}
          fill="url(#colorVolts)"
        />
        <Area
          type="monotone"
          dataKey="amps"
          stroke="#FF69B4"
          fillOpacity={1}
          fill="url(#colorAmps)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
