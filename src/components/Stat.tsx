export const Stat = ({ label, value }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirction: "row",
        justifyContent: "center",
        alignItems: "center",
        blockSize: "100%",
        fontSize: "1.5em",
      }}
    >
        <div>{label}</div>
        <div>{value}</div>
    </div>
  );
};
