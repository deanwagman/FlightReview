import { useStore } from '../state';

export const Timeline = () => {
    const { timestamps, isLoading, current: { timestamp, index }, setTimestampIndex } = useStore();

    if (isLoading || !timestamps.length) {
        return <div>Loading...</div>;
    }

    console.log({
        timestamp,
        index,
    });

    const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        setTimestampIndex(parseInt(value, 10) || 0);
    }

  return (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        blockSize: '100%',
        justifySelf: 'flex-end',
        padding: '5em',
    }}>
      <input type="range" min="0" max={timestamps.length - 1} step="1" value={index || 0}
        onChange={handleChange}
        style={{
          width: '100%',
        }}
      />
    </div>
  )
}