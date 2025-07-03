import { useState } from 'react';
import { PolygonAnnotation, PolygonStyleProps } from '../src/lib';
import Toolbar from './Toolbar';

const initialData = [
  {
    id: 'd3ab238e-c2fd-4337-a397-3d813f575894',
    label: 'planet',
    points: [
      [634.5, 177],
      [387.5, 32],
    ],
  },
  {
    id: '10f65935-596a-4447-8ea5-3b2a24b5e73c',
    label: 'planet2',
    points: [
      [93.5, 34],
      [248.5, 160],
    ],
  },
];

const imageSource = './space_landscape.jpg';

const LineDrawExample = () => {
  const [maxPolygons, setMaxPolygons] = useState<number>(initialData.length || 1);
  const [showLabel, setShowLabel] = useState<boolean>(false);
  const [polygonStyle, setPolygonStyle] = useState<PolygonStyleProps>({
    vertexRadius: 6,
    lineColor: '#1ea703',
    fillColor: '#37f71139',
    vertexColor: '#ff0000',
    vertexStrokeWidth: 2,
  });

  return (
    <PolygonAnnotation
      bgImage={imageSource}
      maxPolygons={maxPolygons}
      polygonStyle={polygonStyle}
      showLabel={showLabel}
      initialPolygons={initialData}
      className={`polygon-annotation`}
      isLineMode
    >
      <Toolbar
        maxPolygons={maxPolygons}
        setMaxPolygons={setMaxPolygons}
        config={polygonStyle}
        setConfig={setPolygonStyle}
        showLabel={showLabel}
        setShowLabel={setShowLabel}
      />
    </PolygonAnnotation>
  );
};

export default LineDrawExample;
