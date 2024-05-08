import React, { useState } from 'react';
import { PolygonAnnotation, PolygonStyleProps } from '../src/lib';
import Toolbar from './Toolbar';

const videoSource = './space_landscape.jpg';

const AnnotationDraw = () => {
  const [maxPolygons, setMaxPolygons] = useState<number>(1);
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
      bgImage={videoSource}
      maxPolygons={maxPolygons}
      polygonStyle={polygonStyle}
      showLabel={showLabel}
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

export default AnnotationDraw;
