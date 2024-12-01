import "./App.css";
import { useEffect, lazy, Suspense } from "react";
import { Timeline } from "./components/Timeline";
import { Stat } from "./components/Stat";
import { useStore } from "./state";
import Settings from "./components/Settings";

const LazyAvatar = lazy(() => import("./components/Avatar"));
const LazyChart = lazy(() => import("./components/Chart"));

function App() {
  const {
    isLoading,
    importData,
    current: { entry, timestamp },
  } = useStore();

  const formattedTimestamp = new Date(timestamp).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  useEffect(() => {
    importData("/time-series-data.json").catch((error) => {
      console.error("Failed to import data:", error);
    });
  }, [importData]);

  if (isLoading || !entry) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app--container">
      <div className="main--container">
        <div className="column--container">
          <div className="avatar--container">
            <Suspense fallback={<div>Loading...</div>}>
              <LazyAvatar
                altitude={entry.avionics.altitudeFt}
                pitch={entry.avionics.pitchDeg}
                roll={entry.avionics.rollDeg}
              />
            </Suspense>
          </div>
          <div className="clock--container">
            <h1 className="clock--text">{formattedTimestamp}</h1>
          </div>

          <div className="stat--container">
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
        <div className="column--container">
          <div
            style={{
              flex: 1,
            }}
          >
            <h2>Telemetry Data</h2>
            <Suspense fallback={<div>Loading...</div>}>
              <LazyChart />
            </Suspense>
          </div>
          <div className="double-stat--container">
            <div className="stat--container">
              <h3>Battery</h3>
              <Stat label="Volts" value={entry.battery.volts} precision={1} />
              <Stat label="Amps" value={entry.battery.amps} precision={1} />
            </div>

            <div className="stat--container">
              <h3>Engine</h3>
              <Stat
                label="Fuel Flow (GPH)"
                value={entry.engine.fuelFlowGPH}
                precision={2}
              />
              <Stat
                label="Oil Temp (F)"
                value={entry.engine.oilTempF}
                precision={2}
              />
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

      <Timeline />

      <Settings />
    </div>
  );
}

export default App;
