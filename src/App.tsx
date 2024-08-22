/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Map } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { useCallback, useState } from 'react';
import { MjolnirEvent } from 'mjolnir.js';
import { PickingInfo } from 'deck.gl';

import { IconLayer, LineLayer } from '@deck.gl/layers';

import 'mapbox-gl/dist/mapbox-gl.css';
import ControlGraph from './control-graph';

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

export enum ToolsEnum {
  None,
  CreateMarker,
  DeleteMarker,
  DrawLine,
  DeleteLine,
}

function App() {
  const [datasetPoint, setDatasetPoint] = useState<PointStation[]>([]);
  const [datasetLine, setDatasetLine] = useState<LinerSegment[]>([]);
  const [drawLine, setDrawLine] = useState<{ from: number[] } | undefined>();
  const [startDrawing, setStartDrawing] = useState<LinerSegment | undefined>();
  const [tools, setTools] = useState<ToolsEnum>(ToolsEnum.None);

  const onClick = useCallback(
    (info: PickingInfo, _event: MjolnirEvent) => {
      switch (Number(tools)) {
        case ToolsEnum.CreateMarker: {
          if (info.layer?.id !== 'IconLayer') {
            setDatasetPoint((prev) => [
              ...prev,
              {
                id: info.coordinate?.join('_') ?? '',
                name: 'test',
                coordinates: (info?.coordinate as [number, number]) ?? [],
              },
            ]);
          }
          break;
        }
        case ToolsEnum.DeleteMarker: {
          if (info.layer?.id === 'IconLayer') {
            setDatasetPoint((prev) =>
              prev.filter((item) => item.id !== info.object.id)
            );
            setDatasetLine((prev) =>
              prev.filter(
                (item) => !item.id.split(':').includes(info.object.id)
              )
            );
          }
          break;
        }
        case ToolsEnum.DrawLine: {
          if (info.layer?.id === 'IconLayer') {
            if (!drawLine && info?.object) {
              setDrawLine({
                from: info?.object?.coordinates,
              });
            } else if (info?.object?.coordinates) {
              setDatasetLine((prev) => [
                ...prev,
                {
                  id: `${drawLine?.from.join('_') ?? ''}:${
                    info.object.coordinates.join('_') ?? ''
                  }`,
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
              setStartDrawing(undefined);
            }
          }
          break;
        }
        case ToolsEnum.DeleteLine: {
          if (info.layer?.id === 'LineLayer') {
            setDatasetLine((prev) =>
              prev.filter((item) => item.id !== info.object.id)
            );
          }
          break;
        }
      }
    },
    [drawLine, tools]
  );

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
    getColor: () => [0, 140, 140],
    getSourcePosition: (d: LinerSegment) => d?.from.coordinates ?? [],
    getTargetPosition: (d: LinerSegment) => d?.to.coordinates ?? [],
    getWidth: 4,
  });

  const layerPoint = new IconLayer<PointStation>({
    id: 'IconLayer',
    data: datasetPoint,
    getColor: () => [0, 0, 0],
    getIcon: () => 'marker',
    getPosition: (d: PointStation) => d.coordinates,
    getSize: 40,
    iconAtlas:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
    iconMapping:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json',
    pickable: true,
  });

  return (
    <div>
      <ControlGraph setTools={setTools} />
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
