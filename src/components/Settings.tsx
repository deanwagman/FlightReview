import { useState } from "react";
import { useStore } from "../state";

const Settings = () => {
  const { chartDataPoints, setChartDataPoints } = useStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleToggle = (key: keyof typeof chartDataPoints) => {
    setChartDataPoints({ ...chartDataPoints, [key]: !chartDataPoints[key] });
  };

  return (
    <div className="settings--container">
      <button className="button" onClick={() => setShowMenu(!showMenu)}>settings</button>

      {showMenu && (
        <div className="settings--menu">
          {Object.entries(chartDataPoints).map(([key, value]) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={value}
                onChange={() =>
                  handleToggle(key as keyof typeof chartDataPoints)
                }
              />
              {key}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default Settings;
