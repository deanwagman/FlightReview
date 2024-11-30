/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "./App.css";
import { useEffect } from "react";
import { Timeline } from "./components/Timeline";
import { Stat } from "./components/Stat";
import { useStore } from "./state";

import Avatar from "./components/Avatar";
import Chart from "./components/Chart";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unused-vars
  const {
    isLoading,
    importData,
    current: { entry, timestamp },
  } = useStore();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    importData("/time-series-data.json").catch((error) => {
      console.error("Failed to import data:", error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !entry) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        blockSize: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          blockSize: "100%",
          gap: "1em",
        }}
      >
        <div
          style={{
            flex: "50%",
            padding: "5em",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              fontSize: "1.5em",
              gap: "1em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                flex: 1,
                fontSize: "1.5em",
                gap: "1em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                altitude={entry.avionics.altitudeFt}
                pitch={entry.avionics.pitchDeg}
                roll={entry.avionics.rollDeg}
              />
            </div>
            <div
              style={{
                flex: 0,
                gap: "1em",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h1
                style={{
                  fontSize: "1em",
                  color: "var(--color-primary-text)",
                }}
              >
                {new Date(timestamp).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",

                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </h1>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3>Avionics</h3>
            <Stat
              label="Latitude"
              value={entry.avionics.latitude}
              precision={7}
            />
            <Stat
              label="Longitude"
              value={entry.avionics.longitude}
              precision={7}
            />
            <Stat
              label="Altitude (ft)"
              value={entry.avionics.altitudeFt}
              precision={1}
            />
            <Stat
              label="Ground Speed (kt)"
              value={entry.avionics.groundSpeedKt}
              precision={2}
            />
            <Stat
              label="Pitch (deg)"
              value={entry.avionics.pitchDeg}
              precision={2}
            />
            <Stat
              label="Roll (deg)"
              value={entry.avionics.rollDeg}
              precision={2}
            />
          </div>
        </div>
        <div
          style={{
            flex: "50%",
            // blockSize: "50%",
            padding: "5em",
            flexDircetion: "column",
            display: "flex",
          }}
        >
          <div
            style={{
              flex: 1,
              gap: "1em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                flex: 1,
              }}
            >
              <h2>Telemetry Data</h2>
              <Chart />
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  flex: 1,
                  padding: "1em",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h3>Battery</h3>
                <Stat label="Volts" value={entry.battery.volts} precision={1} />
                <Stat label="Amps" value={entry.battery.amps} precision={1} />
              </div>

              <div
                style={{
                  flex: 1,
                  padding: "1em",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h3>Engine</h3>
                <Stat
                  label="Fuel Flow (GPH)"
                  value={entry.engine.fuelFlowGPH}
                  precision={2}
                />
                <Stat label="Oil Temp (F)" value={entry.engine.oilTempF} precision={2} />
                <Stat
                  label="Oil Pressure (PSI)"
                  value={entry.engine.oilPressurePSI}
                  precision={2}
                />
                <Stat label="RPM" value={entry.engine.rpm} precision={1} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Timeline />
    </div>
  );
}

export default App;
