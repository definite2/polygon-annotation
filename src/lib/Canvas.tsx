import React, { useMemo, useState, useEffect, ReactNode } from 'react';
import { useSelector, useDispatch, shallowEqual, Provider } from 'react-redux';
import { Layer, Image, Stage } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { v4 as uuidv4 } from 'uuid';
import { setActivePolygonIndex, setPolygons } from 'store/slices/polygonSlice';
import { RootState, store } from 'store';
import Polygon from './Polygon';
import { CanvasProps, PolygonStyleProps } from './types';

const Canvas = ({
  imageSource,
  maxPolygons = 1,
  polygonStyle,
  imageSize,
}: CanvasProps) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState<HTMLImageElement>();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { polygons, activePolygonIndex } = useSelector(
    (state: RootState) => state.polygon.present,
    shallowEqual
  );

  const imageElement = useMemo(() => {
    const element = new window.Image();
    element.src = imageSource;
    return element;
  }, [imageSource]);

  useEffect(() => {
    const onload = function () {
      if (imageSize?.width && imageSize?.height) {
        setSize({
          width: imageSize.width,
          height: imageSize.height,
        });
      } else {
        setSize({
          width: imageElement.width,
          height: imageElement.height,
        });
      }
      setImage(imageElement);
    };
    imageElement.addEventListener('load', onload);
    return () => {
      imageElement.removeEventListener('load', onload);
    };
  }, [imageElement, imageSize?.height, imageSize?.width]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getMousePos = (stage: any): number[] => {
    return [
      stage.getPointerPosition()?.x ?? 0,
      stage.getPointerPosition()?.y ?? 0,
    ];
  };
  // const debouncedHandleMouseMove = debounce((e) => handleMouseClick(e), 100);
  const handleMouseClick = (e: KonvaEventObject<MouseEvent>) => {
    let activeKey = activePolygonIndex;
    const copy = [...polygons];
    // prevent adding new polygon if maxPolygons is reached
    if (copy.filter((p) => p.isFinished).length === maxPolygons) return;

    let polygon = copy[activeKey];
    const { isFinished, isMouseOverPoint } = polygon;
    // prevent adding new point on vertex if it is not mouse over
    if (e.target.name() === 'vertex' && !isMouseOverPoint) {
      console.log('not mouse over point', polygons, polygon);
      return;
    }
    if (isFinished) {
      // create new polygon
      polygon = {
        id: uuidv4(),
        points: [],
        flattenedPoints: [],
        isFinished: false,
        isMouseOverPoint: false,
      };
      activeKey += 1;
      dispatch(setActivePolygonIndex(activeKey));
    }
    const { points } = polygon;
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    if (isMouseOverPoint && points.length >= 3) {
      polygon = {
        ...polygon,
        isFinished: true,
      };
      console.log('polygon is finished', polygon);
    } else {
      polygon = {
        ...polygon,
        points: [...points, mousePos],
      };
      console.log('polygon is not finished', polygon);
    }
    copy[activeKey] = polygon;
    dispatch(setPolygons({ polygons: copy, shouldUpdateHistory: true }));
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const mousePos = getMousePos(stage);
    // set flattened points for active polygon
    const copy = [...polygons];
    let polygon = copy[activePolygonIndex];
    const { points, isFinished, isMouseOverPoint } = polygon;
    if (isFinished) return;
    if (isMouseOverPoint && points.length >= 3) {
      const _flattenedPoints = points.reduce((a, b) => a.concat(b), []);
      polygon = {
        ...polygon,
        flattenedPoints: _flattenedPoints,
      };
    } else {
      const _flattenedPoints = points
        .concat(mousePos)
        .reduce((a, b) => a.concat(b), []);
      polygon = {
        ...polygon,
        flattenedPoints: _flattenedPoints,
      };
    }
    copy[activePolygonIndex] = polygon;
    dispatch(setPolygons({ polygons: copy, shouldUpdateHistory: false }));
  };

  const handleMouseOverStartPoint = (
    e: KonvaEventObject<MouseEvent>,
    polygonKey: number
  ) => {
    const copy = [...polygons];
    let polygon = copy[polygonKey];
    const { points, isFinished } = polygon;
    if (isFinished || points.length < 3) return;
    e.target.scale({ x: 3, y: 3 });
    polygon = {
      ...polygon,
      isMouseOverPoint: true,
    };
    console.log('mouse over point', copy, polygon);
    copy[polygonKey] = polygon;
    dispatch(setPolygons({ polygons: copy, shouldUpdateHistory: false }));
  };

  const handleMouseOutStartPoint = (
    e: KonvaEventObject<MouseEvent>,
    polygonKey: number
  ) => {
    e.target.scale({ x: 1, y: 1 });
    const copy = [...polygons];
    let polygon = copy[polygonKey];
    polygon = {
      ...polygon,
      isMouseOverPoint: false,
    };
    copy[polygonKey] = polygon;
    dispatch(setPolygons({ polygons: copy, shouldUpdateHistory: false }));
  };

  const handlePointDragMove = (
    e: KonvaEventObject<DragEvent>,
    polygonKey: number
  ) => {
    const copy = [...polygons];
    let polygon = copy[polygonKey];
    const { isFinished } = polygon;
    if (!isFinished) {
      // prevent drag:
      e.target.stopDrag();
      return;
    }
    const stage = e.target.getStage();
    const index = e.target.index - 1;
    const pos = [e.target.x(), e.target.y()];
    if (stage) {
      if (pos[0] < 0) pos[0] = 0;
      if (pos[1] < 0) pos[1] = 0;
      if (pos[0] > stage.width()) pos[0] = stage.width();
      if (pos[1] > stage.height()) pos[1] = stage.height();
    }

    const { points } = polygon;
    const newPoints = [
      ...points.slice(0, index),
      pos,
      ...points.slice(index + 1),
    ];
    const flattenedPoints = newPoints.reduce((a, b) => a.concat(b), []);
    polygon = {
      ...polygon,
      points: newPoints,
      flattenedPoints,
    };
    copy[polygonKey] = polygon;
    dispatch(setPolygons({ polygons: copy, shouldUpdateHistory: false }));
  };

  const handlePointDragEnd = (
    e: KonvaEventObject<DragEvent>,
    polygonKey: number
  ) => {
    const index = e.target.index - 1;
    const pos = [e.target.x(), e.target.y()];
    const copy = [...polygons];
    let polygon = copy[polygonKey];
    const { points } = polygon;
    const newPoints = [
      ...points.slice(0, index),
      pos,
      ...points.slice(index + 1),
    ];
    const flattenedPoints = newPoints.reduce((a, b) => a.concat(b), []);
    polygon = {
      ...polygon,
      points: newPoints,
      flattenedPoints,
    };
    copy[polygonKey] = polygon;
    dispatch(setPolygons({ polygons: copy, shouldUpdateHistory: true }));
  };

  const handleGroupDragEnd = (
    e: KonvaEventObject<DragEvent>,
    polygonKey: number
  ) => {
    //drag end listens other children circles' drag end event
    //...for this 'name' attr is added
    const copy = [...polygons];
    let polygon = copy[polygonKey];
    const { points } = polygon;
    if (e.target.name() === 'polygon') {
      const result: number[][] = [];
      const copyPoints = [...points];
      copyPoints.forEach((point) =>
        result.push([point[0] + e.target.x(), point[1] + e.target.y()])
      );
      e.target.position({ x: 0, y: 0 }); //reset group position
      polygon = {
        ...polygon,
        points: result,
        flattenedPoints: result.reduce((a, b) => a.concat(b), []),
      };
      copy[polygonKey] = polygon;
      dispatch(setPolygons({ polygons: copy, shouldUpdateHistory: true }));
    }
  };

  return (
    <Stage
      width={size.width}
      height={size.height}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseClick}
    >
      <Layer>
        <Image
          image={image}
          x={0}
          y={0}
          width={size.width}
          height={size.height}
        />
        {polygons?.map((polygon, index) => (
          <Polygon
            key={polygon.id}
            isFinished={polygon.isFinished}
            points={polygon.points}
            flattenedPoints={polygon.flattenedPoints}
            handlePointDragMove={(e) => handlePointDragMove(e, index)}
            handlePointDragEnd={(e) => handlePointDragEnd(e, index)}
            handleMouseOverStartPoint={(e) =>
              handleMouseOverStartPoint(e, index)
            }
            handleMouseOutStartPoint={(e) => handleMouseOutStartPoint(e, index)}
            handleGroupDragEnd={(e) => handleGroupDragEnd(e, index)}
            polygonStyle={polygonStyle}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export const PolygonAnnotation = ({
  bgImage,
  maxPolygons,
  polygonStyle,
  imageSize,
  children,
}: {
  bgImage: string;
  children?: ReactNode;
  maxPolygons?: number;
  imageSize?: { width: number; height: number };
  polygonStyle?: PolygonStyleProps;
}) => {
  return (
    <Provider store={store}>
      <Canvas
        imageSource={bgImage}
        maxPolygons={maxPolygons}
        polygonStyle={polygonStyle}
        imageSize={imageSize}
      />
      {children}
    </Provider>
  );
};
