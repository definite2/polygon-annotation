import { useState } from 'react';
import { PolygonAnnotation, PolygonConfigProps } from 'lib';

import Toolbar from './Toolbar';

const videoSource = './space_landscape.jpg';

const AnnotationDraw = () => {
  const [maxPolygons, setMaxPolygons] = useState<number>(1);
  const [config, setConfig] = useState<PolygonConfigProps>({
    vertexRadius: 6,
    lineColor: '#1ea703',
    fillColor: '#37f71139',
    vertexColor: '#ff0000',
  });
  return (
    <>
      <PolygonAnnotation
        bgImage={videoSource}
        maxPolygons={maxPolygons}
        config={config}
      >
        <Toolbar
          maxPolygons={maxPolygons}
          setMaxPolygons={setMaxPolygons}
          config={config}
          setConfig={setConfig}
        />
      </PolygonAnnotation>
    </>
  );
};

export default AnnotationDraw;
