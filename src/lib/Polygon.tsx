import React, { useState } from 'react';
import Konva from 'konva';
import { Line, Circle, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { minMax } from 'utils';

// todo: move to config
const LineColor = '#00F1FF';
const FillColor = 'rgb(140,30,255,0.5)';
const VertexColor = '#FF019A';

type PolygonAnnotationProps = {
  points: number[][];
  flattenedPoints: number[] | undefined;
  isFinished: boolean;
  handlePointDragMove: (e: KonvaEventObject<DragEvent>) => void;
  handlePointDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  handleGroupDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  handleMouseOverStartPoint: (e: KonvaEventObject<MouseEvent>) => void;
  handleMouseOutStartPoint: (e: KonvaEventObject<MouseEvent>) => void;
  vertexRadius?: number;
};

const Polygon = ({
  points,
  flattenedPoints,
  isFinished,
  vertexRadius = 6,
  handlePointDragEnd,
  handleGroupDragEnd,
  handleMouseOverStartPoint,
  handleMouseOutStartPoint,
  handlePointDragMove,
}: PolygonAnnotationProps) => {
  const [stageObject, setStageObject] = useState<Konva.Stage | null>(null);
  const [minMaxX, setMinMaxX] = useState([0, 0]); //min and max in x axis
  const [minMaxY, setMinMaxY] = useState([0, 0]); //min and max in y axis

  const handleGroupMouseOver = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!isFinished || !stage) return;
    stage.container().style.cursor = 'pointer';
    setStageObject(stage);
  };

  const handleGroupMouseOut = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    stage.container().style.cursor = 'default';
  };

  const handleGroupDragStart = () => {
    let arrX = points.map((p) => p[0]);
    let arrY = points.map((p) => p[1]);
    setMinMaxX(minMax(arrX));
    setMinMaxY(minMax(arrY));
  };

  const groupDragBoundFunc = (pos: Vector2d) => {
    let { x, y } = pos;
    if (!stageObject) return { x, y };
    const sw = stageObject.width();
    const sh = stageObject.height();
    if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];
    if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
    if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
    if (minMaxX[1] + x > sw) x = sw - minMaxX[1];
    return { x, y };
  };

  const vertexDragBoundFunc = (pos: Vector2d) => {
    let { x, y } = pos;
    if (!stageObject) return { x, y };
    const sw = stageObject.width();
    const sh = stageObject.height();
    if (x + vertexRadius > sw) x = sw - vertexRadius;
    if (x - vertexRadius < 0) x = vertexRadius;
    if (y + vertexRadius > sh) y = sh - vertexRadius;
    if (y - vertexRadius < 0) y = vertexRadius;
    return { x, y };
  };

  return (
    <Group
      name="polygon"
      draggable={isFinished}
      onDragStart={handleGroupDragStart}
      onDragEnd={handleGroupDragEnd}
      dragBoundFunc={groupDragBoundFunc}
      onMouseOver={handleGroupMouseOver}
      onMouseOut={handleGroupMouseOut}
    >
      <Line
        name="line"
        points={flattenedPoints}
        stroke={LineColor}
        strokeWidth={3}
        closed={isFinished}
        fill={FillColor}
      />
      {points.map((point, index) => {
        const x = point[0] - vertexRadius / 2;
        const y = point[1] - vertexRadius / 2;
        const startPointAttr =
          index === 0
            ? {
                hitStrokeWidth: 12,
                onMouseOver: handleMouseOverStartPoint,
                onMouseOut: handleMouseOutStartPoint,
              }
            : null;
        return (
          <Circle
            name="vertex"
            key={index}
            x={x}
            y={y}
            radius={vertexRadius}
            fill={VertexColor}
            stroke={LineColor}
            strokeWidth={2}
            draggable
            onDragMove={handlePointDragMove}
            onDragEnd={handlePointDragEnd}
            dragBoundFunc={vertexDragBoundFunc}
            {...startPointAttr}
          />
        );
      })}
    </Group>
  );
};

export default Polygon;
