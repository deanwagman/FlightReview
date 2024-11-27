export const Timeline = () => {
  return (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        blockSize: '100%',
        justifySelf: 'flex-end',
        padding: '5em',
    }}>
      <input type="range" min="0" max="100" step="1"
        onChange={(e) => console.log(e.target.value)}
        style={{
          width: '100%',
        }}
      />
    </div>
  )
}