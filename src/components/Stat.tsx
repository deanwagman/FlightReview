import { useSpring, animated } from "@react-spring/web";

export const Stat = ({ label, value, precision = 1 }) => {
  // Animated spring with value to simulate a counter
  const { animatedValue } = useSpring<{ animatedValue: number }>({
    from: { animatedValue: 0 },
    to: { animatedValue: parseFloat(String(value)) },
  });

  return (
    <div className="stat--item--container">
      <div className="stat--item--label">{label}</div>
      <animated.div className="stat--item--value">
        {animatedValue.to((value) => value.toFixed(precision))}
      </animated.div>
    </div>
  );
};
