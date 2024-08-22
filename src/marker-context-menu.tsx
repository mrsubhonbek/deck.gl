import type { PickingInfo } from 'deck.gl';
import { LinerSegment, PointStation } from './App';

type PropsType = {
  info: PickingInfo;
  setMarkerShowContextMenu: React.Dispatch<React.SetStateAction<boolean>>;
  drawLine: { from: number[] } | undefined;
  setDrawLine: React.Dispatch<
    React.SetStateAction<{ from: number[] } | undefined>
  >;
  setDatasetPoint: React.Dispatch<React.SetStateAction<PointStation[]>>;
  setDatasetLine: React.Dispatch<React.SetStateAction<LinerSegment[]>>;
  setStartDrawing: React.Dispatch<React.SetStateAction<LinerSegment | undefined>>
};

const MarkerContextMenu = ({
  info,
  setMarkerShowContextMenu,
  setDatasetPoint,
  drawLine,
  setDrawLine,
  setDatasetLine,
  setStartDrawing,
}: PropsType) => {
  return (
    <div
      onMouseEnter={()=> {
        if(drawLine) {
          setStartDrawing({
            from: {
              coordinates: drawLine.from as [number, number],
              name: 'drawLine',
            },
            id: 'drawLine',
            to: {
              coordinates: (info.object.coordinates as [number, number]),
              name: 'drawLine',
            },
          });
        }
      }}
      style={{
        position: 'absolute',
        top: info.y,
        left: info.x,
        backgroundColor: 'white',
        padding: '5px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'start',
        gap: '4px',
        cursor: 'pointer',
        zIndex: 10,
      }}>
      <div
        onClick={() => {
          if (!drawLine && info?.object) {
            setDrawLine({
              from: info?.object?.coordinates,
            });
          } else if (info?.object?.coordinates) {
            setDatasetLine((prev) => [
              ...prev,
              {
                id: `${drawLine?.from.join('_') ?? ''}:${info.object.coordinates.join('_') ?? ''}`,
                from: {
                  name: 'test',
                  coordinates: (drawLine?.from as [number, number]) ?? [],
                },
                to: {
                  name: 'test',
                  coordinates:
                    (info.object.coordinates as [number, number]) ?? [],
                },
              },
            ]);
            setDrawLine(undefined);
            setStartDrawing(undefined)
          }
          setMarkerShowContextMenu(false);
        }}>
        {drawLine ? 'Complete line' : 'Start create line'}
      </div>
      <div
        onClick={() => {
          setMarkerShowContextMenu(false);
          setDatasetPoint((prev) =>
            prev.filter((item) => item.id !== info.object.id)
          );
          setDatasetLine(prev => prev.filter(item => !item.id.split(':').includes(info.object.id)))
        }}>
        Delete marker
      </div>
      <div onClick={() => setMarkerShowContextMenu(false)}>Cancel</div>
    </div>
  );
};

export default MarkerContextMenu;
