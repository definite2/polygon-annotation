import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Layer, Stage } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import { usePolygonContext } from './context/PolygonContext';
import Polygon from './Polygon';
import { CanvasProps } from './types';

export const Canvas = ({
  imageSource,
  maxPolygons = 1,
  polygonStyle,
  imageSize,
  showLabel = false,
  className,
  onContextMenu,
  isLineMode = false,
  stageProps,
}: CanvasProps) => {
  const { state, setPolygons, setActivePolygonIndex } = usePolygonContext();
  const { polygons, activePolygonIndex } = state.present;

  const [image, setImage] = useState<HTMLImageElement>();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isMouseOverPoint, setIsMouseOverPoint] = useState(false);

  const imageElement = useMemo(() => {
    if (!imageSource) return null;
    const element = new window.Image();
    element.src = imageSource;
    return element;
  }, [imageSource]);

  useEffect(() => {
    if (imageSize?.width && imageSize?.height)
      setSize({
        width: imageSize.width,
        height: imageSize.height,
      });
  }, [imageSize?.height, imageSize?.width]);

  useEffect(() => {
    if (!imageElement) return;
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

  const getMousePos = (stage: any): number[] => {
    return [stage.getPointerPosition()?.x ?? 0, stage.getPointerPosition()?.y ?? 0];
  };

  const handleMouseClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      // Prevent function execution on right-click (button 2)
      if (e.evt.button === 2) return;

      let activeKey = activePolygonIndex;
      const copy = [...polygons];

      // prevent adding new polygon if maxPolygons is reached
      if (copy.filter((p) => p.isFinished).length >= maxPolygons) return;

      let polygon = copy[activeKey];
      const { isFinished } = polygon;

      // prevent adding new point on vertex if it is not mouse over
      if (e.target.name() === 'vertex' && !isMouseOverPoint) {
        return;
      }

      if (isFinished) {
        // create new polygon
        polygon = {
          id: uuidv4(),
          points: [],
          flattenedPoints: [],
          isFinished: false,
          label: `Polygon ${copy.length + 1}`,
        };
        setIsMouseOverPoint(false);
        activeKey += 1;
        setActivePolygonIndex(activeKey);
      }
      const { points } = polygon;
      const stage = e.target.getStage();
      const mousePos = getMousePos(stage);

      if (isMouseOverPoint && points.length >= 3) {
        polygon = {
          ...polygon,
          isFinished: true,
        };
      } else {
        polygon = {
          ...polygon,
          points: [...points, mousePos],
        };
      }

      if (isLineMode && points.length >= 1) {
        polygon = {
          ...polygon,
          points: [...points, mousePos],
          isFinished: true,
        };
      }

      copy[activeKey] = polygon;
      setPolygons(copy, true);
    },
    [
      activePolygonIndex,
      setPolygons,
      setActivePolygonIndex,
      isMouseOverPoint,
      maxPolygons,
      polygons,
      isLineMode,
    ],
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) {
        return;
      }
      const mousePos = getMousePos(stage);
      // // set flattened points for active polygon
      const copy = [...polygons];
      let polygon = copy[activePolygonIndex];
      const { points, isFinished } = polygon;
      if (isFinished) {
        return;
      }
      const _flattenedPoints = points.concat(mousePos).reduce((a, b) => a.concat(b), []);
      polygon = {
        ...polygon,
        flattenedPoints: _flattenedPoints,
      };
      copy[activePolygonIndex] = polygon;
      setPolygons(copy, false);
    },
    [activePolygonIndex, setPolygons, polygons],
  );

  const handleMouseOverStartPoint = useCallback(
    (e: KonvaEventObject<MouseEvent>, polygonKey: number) => {
      const polygon = polygons[polygonKey];

      const { points, isFinished } = polygon;
      if (isFinished || points.length < 3) {
        return;
      }
      e.target.scale({ x: 3, y: 3 });
      setIsMouseOverPoint(true);
    },
    [polygons],
  );

  const handleMouseOutStartPoint = useCallback((e: KonvaEventObject<MouseEvent>) => {
    e.target.scale({ x: 1, y: 1 });
    setIsMouseOverPoint(false);
  }, []);

  const handlePointDragMove = useCallback(
    (e: KonvaEventObject<DragEvent>, polygonKey: number) => {
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
      const newPoints = [...points.slice(0, index), pos, ...points.slice(index + 1)];
      const flattenedPoints = newPoints.reduce((a, b) => a.concat(b), []);
      polygon = {
        ...polygon,
        points: newPoints,
        flattenedPoints,
      };
      copy[polygonKey] = polygon;
      setPolygons(copy, false);
    },
    [setPolygons, polygons],
  );

  const handlePointDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>, polygonKey: number) => {
      const index = e.target.index - 1;
      const pos = [e.target.x(), e.target.y()];
      const copy = [...polygons];
      let polygon = copy[polygonKey];
      const { points } = polygon;
      const newPoints = [...points.slice(0, index), pos, ...points.slice(index + 1)];
      const flattenedPoints = newPoints.reduce((a, b) => a.concat(b), []);
      polygon = {
        ...polygon,
        points: newPoints,
        flattenedPoints,
      };
      copy[polygonKey] = polygon;
      setPolygons(copy, true);
    },
    [setPolygons, polygons],
  );

  const handleGroupDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>, polygonKey: number) => {
      //drag end listens other children circles' drag end event
      //...for this 'name' attr is added
      const copy = [...polygons];
      let polygon = copy[polygonKey];
      const { points } = polygon;
      if (e.target.name() === 'polygon') {
        const result: number[][] = [];
        const copyPoints = [...points];
        copyPoints.forEach((point) =>
          result.push([point[0] + e.target.x(), point[1] + e.target.y()]),
        );
        e.target.position({ x: 0, y: 0 }); //reset group position
        polygon = {
          ...polygon,
          points: result,
          flattenedPoints: result.reduce((a, b) => a.concat(b), []),
        };
        copy[polygonKey] = polygon;
        setPolygons(copy, true);
      }
    },
    [setPolygons, polygons],
  );

  return (
    <Stage
      width={size.width}
      height={size.height}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseClick}
      className={className}
      onContextMenu={onContextMenu}
      {...stageProps}
    >
      <Layer>
        {image ? <Image image={image} x={0} y={0} width={size.width} height={size.height} /> : null}
        {polygons?.map((polygon, index) => (
          <Polygon
            key={polygon.id}
            isFinished={polygon.isFinished}
            points={polygon.points}
            isLineMode={isLineMode}
            flattenedPoints={polygon.flattenedPoints}
            handlePointDragMove={(e) => handlePointDragMove(e, index)}
            handlePointDragEnd={(e) => handlePointDragEnd(e, index)}
            handleMouseOverStartPoint={(e) => handleMouseOverStartPoint(e, index)}
            handleMouseOutStartPoint={handleMouseOutStartPoint}
            handleGroupDragEnd={(e) => handleGroupDragEnd(e, index)}
            polygonStyle={polygonStyle}
            showLabel={showLabel}
            label={polygon.label}
          />
        ))}
      </Layer>
    </Stage>
  );
};
