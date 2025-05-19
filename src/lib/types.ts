import { KonvaEventObject } from 'konva/lib/Node';
import { StageProps } from 'react-konva';

export type Polygon = {
  id: string;
  points: number[][];
  flattenedPoints: number[];
  isFinished: boolean;
  label?: string;
};

export type PolygonStyleProps = {
  lineColor?: string;
  fillColor?: string;
  vertexColor?: string;
  vertexRadius?: number;
  vertexStrokeWidth?: number;
};

export type CanvasProps = {
  imageSource?: string;
  maxPolygons?: number;
  polygonStyle?: PolygonStyleProps;
  showLabel?: boolean;
  imageSize?: {
    width: number;
    height: number;
  };
  className?: string;
  onContextMenu?(evt: KonvaEventObject<PointerEvent>): void;
  isLineMode?: boolean;
  stageProps?: StageProps;
};
export type PolygonInputProps = {
  id?: string;
  label?: string;
  points: number[][];
};
export type PolygonProps = {
  points: number[][];
  flattenedPoints: number[] | undefined;
  isFinished: boolean;
  showLabel?: boolean;
  label?: string;
  polygonStyle?: PolygonStyleProps;
  isLineMode: boolean;
  handlePointDragMove: (e: KonvaEventObject<DragEvent>) => void;
  handlePointDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  handleGroupDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  handleMouseOverStartPoint: (e: KonvaEventObject<MouseEvent>) => void;
  handleMouseOutStartPoint: (e: KonvaEventObject<MouseEvent>) => void;
};
