import { useState } from 'react';
import { PolygonAnnotation } from 'lib';
import Toolbar from './Toolbar';

const videoSource = './space_landscape.jpg';

const AnnotationDraw = () => {
  const [maxPolygons, setMaxPolygons] = useState<number>(1);
  return (
    <>
      <PolygonAnnotation bgImage={videoSource} maxPolygons={maxPolygons}>
        <Toolbar maxPolygons={maxPolygons} setMaxPolygons={setMaxPolygons} />
      </PolygonAnnotation>
    </>
  );
};

export default AnnotationDraw;
