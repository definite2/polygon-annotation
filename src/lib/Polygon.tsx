import React, { useState } from 'react';
import Konva from 'konva';
import { Line, Circle, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { minMax } from 'utils';
import { PolygonProps } from './types';

const LineColor = '#00F1FF';
const FillColor = 'rgb(140,30,255,0.5)';
const VertexColor = '#FF019A';
const VertexRadius = 6;

const Polygon = ({
  points,
  flattenedPoints,
  isFinished,
  polygonStyle = {
    vertexRadius: VertexRadius,
    lineColor: LineColor,
    fillColor: FillColor,
    vertexColor: VertexColor,
  },
  handlePointDragEnd,
  handleGroupDragEnd,
  handleMouseOverStartPoint,
  handleMouseOutStartPoint,
  handlePointDragMove,
}: PolygonProps) => {
  const {
    vertexRadius = VertexRadius,
    lineColor,
    fillColor,
    vertexColor,
  } = polygonStyle;
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
    const arrX = points.map((p) => p[0]);
    const arrY = points.map((p) => p[1]);
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
        stroke={lineColor}
        strokeWidth={3}
        closed={isFinished}
        fill={fillColor}
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
            fill={vertexColor}
            stroke={lineColor}
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
