import { KonvaEventObject } from 'konva/lib/Node';

export type PolygonConfigProps = {
  lineColor?: string;
  fillColor?: string;
  vertexColor?: string;
  vertexRadius?: number;
};

export type CanvasProps = {
  imageSource: string;
  maxPolygons?: number;
  config?: PolygonConfigProps;
};

export type PolygonProps = {
  points: number[][];
  flattenedPoints: number[] | undefined;
  isFinished: boolean;
  config?: PolygonConfigProps;
  handlePointDragMove: (e: KonvaEventObject<DragEvent>) => void;
  handlePointDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  handleGroupDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  handleMouseOverStartPoint: (e: KonvaEventObject<MouseEvent>) => void;
  handleMouseOutStartPoint: (e: KonvaEventObject<MouseEvent>) => void;
};
