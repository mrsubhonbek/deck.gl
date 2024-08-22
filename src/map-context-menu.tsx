import type { PickingInfo } from 'deck.gl';
import { LinerSegment, PointStation } from './App';

type PropsType = {
  info: PickingInfo;
  drawLine: { from: number[] } | undefined;
  setShowContextMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setDatasetPoint: React.Dispatch<React.SetStateAction<PointStation[]>>;
  setStartDrawing: React.Dispatch<
    React.SetStateAction<LinerSegment | undefined>
  >;
  setDrawLine: React.Dispatch<
    React.SetStateAction<{ from: number[] } | undefined>
  >;
  setDatasetLine: React.Dispatch<React.SetStateAction<LinerSegment[]>>;
  setMarkerShowContextMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const MapContextMenu = ({
  info,
  setDatasetPoint,
  setShowContextMenu,
  drawLine,
  setDrawLine,
  setStartDrawing,
  setDatasetLine,
}: PropsType) => {
  return (
    <div
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
          setDatasetPoint((prev) => [
            ...prev,
            {
              id: info.coordinate?.join('_') ?? '',
              name: 'test',
              coordinates: (info?.coordinate as [number, number]) ?? [],
            },
          ]);
          setShowContextMenu(false);
        }}>
        Create marker
      </div>
      {drawLine && (
        <div
          onClick={() => {
            setDrawLine(undefined);
            setStartDrawing(undefined);
            setShowContextMenu(false);
          }}>
          Stop drawing
        </div>
      )}
      {info?.layer?.id === 'LineLayer' && (
        <div
          onClick={() => {
            setDatasetLine((prev) =>
              prev.filter((item) => item.id !== info.object.id)
            );
            setShowContextMenu(false);
          }}>
          Delete line
        </div>
      )}
      <div onClick={() => setShowContextMenu(false)}>Cancel</div>
    </div>
  );
};

export default MapContextMenu;
