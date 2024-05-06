import { useState } from 'react';
import { PolygonAnnotation, PolygonStyleProps } from 'lib';

import Toolbar from './Toolbar';

const videoSource = './space_landscape.jpg';

const AnnotationDraw = () => {
  const [maxPolygons, setMaxPolygons] = useState<number>(1);
  const [polygonStyle, setPolygonStyle] = useState<PolygonStyleProps>({
    vertexRadius: 6,
    lineColor: '#1ea703',
    fillColor: '#37f71139',
    vertexColor: '#ff0000',
    vertexStrokeWidth: 2,
  });
  return (
    <PolygonAnnotation
      bgImage={videoSource}
      maxPolygons={maxPolygons}
      polygonStyle={polygonStyle}
    >
      <Toolbar
        maxPolygons={maxPolygons}
        setMaxPolygons={setMaxPolygons}
        config={polygonStyle}
        setConfig={setPolygonStyle}
      />
    </PolygonAnnotation>
  );
};

export default AnnotationDraw;
