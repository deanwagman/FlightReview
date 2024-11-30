import { useSpring, animated, useTransition } from "@react-spring/web";

export const Stat = ({ label, value, precision = 1 }) => {
  // Animated spring with value to simulate a counter
  const { animatedValue } = useSpring<{ animatedValue: number }>({
    from: { animatedValue: 0 },
    to: { animatedValue: parseFloat(String(value)) },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirction: "row",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.3em",
        gap: "1em",
        width: "100%",
        color: "var(--color-secondary-text)",
      }}
    >
      <div
        style={{
          flex: "50%",
          width: "50%",
          whiteSpace: "nowrap",
          textAlign: "right",
        }}
      >
        {label}
      </div>
      <animated.div
        style={{
          flex: "50%",
          width: "50%",
          textAlign: "left",
          fontFamily: "monospace",
        }}
      >
        {animatedValue.to((value) => value.toFixed(precision))}
      </animated.div>
    </div>
  );
};
