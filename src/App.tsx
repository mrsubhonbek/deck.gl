/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Map } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { useCallback, useState } from 'react';
import { MjolnirEvent } from 'mjolnir.js';
import { PickingInfo } from 'deck.gl';

import { IconLayer, LineLayer } from '@deck.gl/layers';
import MapContextMenu from './map-context-menu';
import MarkerContextMenu from './marker-context-menu';

import 'mapbox-gl/dist/mapbox-gl.css';

export type PointStation = {
  id: string;
  name: string;
  coordinates: [longitude: number, latitude: number];
};

export type LinerSegment = {
  id: string;
  from: {
    name: string;
    coordinates: [longitude: number, latitude: number];
  };
  to: {
    name: string;
    coordinates: [longitude: number, latitude: number];
  };
};

function App() {
  const [datasetPoint, setDatasetPoint] = useState<PointStation[]>([]);
  const [datasetLine, setDatasetLine] = useState<LinerSegment[]>([]);
  const [showMapContextMenu, setMapShowContextMenu] = useState(false);
  const [showMarkerContextMenu, setMarkerShowContextMenu] = useState(false);
  const [info, setInfo] = useState<PickingInfo>();
  const [drawLine, setDrawLine] = useState<{ from: number[] } | undefined>();
  const [startDrawing, setStartDrawing] = useState<LinerSegment | undefined>();

  const onClick = useCallback((info: PickingInfo, event: MjolnirEvent) => {
    console.log('MouseEnter', info, event);
    if (info.layer?.id !== 'IconLayer') {
      setMapShowContextMenu(true);
      setMarkerShowContextMenu(false);
    } else {
      setMapShowContextMenu(false);
      setMarkerShowContextMenu(true);
    }
    setInfo(info);
  }, []);

  const layerLine = new LineLayer<LinerSegment>({
    id: 'LineLayer',
    data: datasetLine,
    getColor: () => [140, 140, 0],
    getSourcePosition: (d: LinerSegment) => d?.from.coordinates ?? [],
    getTargetPosition: (d: LinerSegment) => d?.to.coordinates ?? [],
    getWidth: 4,
    pickable: !drawLine,
  });

  const layerDrawingLine = new LineLayer<LinerSegment>({
    id: 'LineLayer',
    data: [startDrawing],
    getColor: () => [140, 140, 0],
    getSourcePosition: (d: LinerSegment) => d?.from.coordinates ?? [],
    getTargetPosition: (d: LinerSegment) => d?.to.coordinates ?? [],
    getWidth: 4,
  });

  const layerPoint = new IconLayer<PointStation>({
    id: 'IconLayer',
    data: datasetPoint,
    getColor: () => [0, 0, 0],
    getIcon: () => 'marker',
    onClick: (e) => {
      console.log('marker', e);
      setMapShowContextMenu(false);
      setMarkerShowContextMenu(true);
    },
    getPosition: (d: PointStation) => d.coordinates,
    getSize: 40,
    iconAtlas:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
    iconMapping:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json',
    pickable: true,
  });

  return (
    <div
      onWheel={() => {
        setMarkerShowContextMenu(false);
        setMapShowContextMenu(false);
      }}>
      {showMapContextMenu && info && (
        <MapContextMenu
          info={info}
          drawLine={drawLine}
          setDatasetPoint={setDatasetPoint}
          setShowContextMenu={setMapShowContextMenu}
          setStartDrawing={setStartDrawing}
          setDrawLine={setDrawLine}
          setDatasetLine={setDatasetLine}
          setMarkerShowContextMenu={setMarkerShowContextMenu}
        />
      )}
      {showMarkerContextMenu && info && (
        <MarkerContextMenu
          info={info}
          drawLine={drawLine}
          setDatasetPoint={setDatasetPoint}
          setMarkerShowContextMenu={setMarkerShowContextMenu}
          setDatasetLine={setDatasetLine}
          setDrawLine={setDrawLine}
          setStartDrawing={setStartDrawing}
        />
      )}
      <DeckGL
        initialViewState={{
          longitude: -122.4,
          latitude: 37.74,
          zoom: 11,
        }}
        controller
        onHover={(e) => {
          if (drawLine && e.coordinate) {
            setStartDrawing({
              from: {
                coordinates: drawLine?.from as [number, number],
                name: 'drawLine',
              },
              id: 'drawLine',
              to: {
                coordinates: [e.coordinate[0], e.coordinate[1]] as [
                  number,
                  number
                ],
                name: 'drawLine',
              },
            });
          }
        }}
        onClick={onClick}
        onDragStart={() => {
          setMarkerShowContextMenu(false);
          setMapShowContextMenu(false);
        }}
        layers={[layerPoint, layerLine, layerDrawingLine]}>
        <Map
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxAccessToken="pk.eyJ1IjoieWlpdSIsImEiOiJjazJvMmJ3M2QwejYzM21tdWdiZzR6cmUwIn0.XolZlohi-gYoIdMoen7Gyg"
        />
      </DeckGL>
    </div>
  );
}

export default App;
