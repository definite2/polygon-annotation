import React, { useMemo, useState, useEffect, ReactNode } from 'react';
import { useSelector, useDispatch, shallowEqual, Provider } from 'react-redux';
import { Layer, Image, Stage } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import {
  setActivePolygonIndex,
  setMousePosition,
  setPolygons,
} from 'store/slices/polygonSlice';
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
  const { position, polygons, activePolygonIndex } = useSelector(
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

  const handleMouseClick = (e: KonvaEventObject<MouseEvent>) => {
    let activeKey = activePolygonIndex;
    const copy = [...polygons];
    let polygon = copy[activeKey];
    const { isFinished, isMouseOverPoint } = polygon;
    if (e.target.name() === 'vertex' && !isMouseOverPoint) {
      return;
    }
    if (activeKey + 1 > maxPolygons) return;
    if (isFinished) {
      activeKey++;
      if (activeKey + 1 > maxPolygons) return;
      polygon = {
        points: [],
        flattenedPoints: [],
        isFinished: false,
        isMouseOverPoint: false,
      };
      dispatch(setActivePolygonIndex(activeKey));
    }

    const { points } = polygon;
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);

    if (isMouseOverPoint && points.length >= 3) {
      const _flattenedPoints = points.reduce((a, b) => a.concat(b), []);
      polygon = {
        ...polygon,
        isFinished: true,
        flattenedPoints: _flattenedPoints,
      };
    } else {
      const _flattenedPoints = points
        .concat(position)
        .reduce((a, b) => a.concat(b), []);
      polygon = {
        ...polygon,
        points: [...points, mousePos],
        flattenedPoints: _flattenedPoints,
      };
    }
    copy[activeKey] = polygon;
    dispatch(setPolygons({ polygons: copy, shouldUpdate: true }));
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const mousePos = getMousePos(stage);
    dispatch(setMousePosition(mousePos));
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
    copy[polygonKey] = polygon;
    dispatch(setPolygons({ polygons: copy, shouldUpdate: true }));
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
    dispatch(setPolygons({ polygons: copy, shouldUpdate: true }));
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
    dispatch(setPolygons({ polygons: copy, shouldUpdate: false }));
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
    dispatch(setPolygons({ polygons: copy, shouldUpdate: true }));
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
      dispatch(setPolygons({ polygons: copy, shouldUpdate: true }));
    }
  };

  return (
    <Stage
      width={size.width}
      height={size.height}
      onMouseMove={handleMouseMove}
      onClick={handleMouseClick}
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
            key={index}
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
