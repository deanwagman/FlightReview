/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import './App.css'
import { useEffect } from 'react'
import { Timeline } from './components/Timeline'
import { Stat } from './components/Stat';
import { useStore } from './state';

function App() {

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unused-vars
  const { isLoading, importData, current: { entry } } = useStore();

  console.log({
    isLoading,
    entry,
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    importData('/time-series-data.json').catch((error) => {
      console.error('Failed to import data:', error);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !entry) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2>Telemetry Data</h2>
      <h3>Avionics</h3>
      <Stat label="Latitude" value={entry.avionics.latitude} />
      <Stat label="Longitude" value={entry.avionics.longitude} />
      <Stat label="Altitude (ft)" value={entry.avionics.altitudeFt} />
      <Stat label="Ground Speed (kt)" value={entry.avionics.groundSpeedKt} />
      <Stat label="Pitch (deg)" value={entry.avionics.pitchDeg} />
      <Stat label="Roll (deg)" value={entry.avionics.rollDeg} />

      <h3>Battery</h3>
      <Stat label="Volts" value={entry.battery.volts} />
      <Stat label="Amps" value={entry.battery.amps} />

      <h3>Engine</h3>
      <Stat label="Fuel Flow (GPH)" value={entry.engine.fuelFlowGPH} />
      <Stat label="Oil Temp (F)" value={entry.engine.oilTempF} />
      <Stat label="Oil Pressure (PSI)" value={entry.engine.oilPressurePSI} />
      <Stat label="RPM" value={entry.engine.rpm} />  
      
      <Timeline />
    </>
  )
}

export default App
