import { KonvaEventObject } from 'konva/lib/Node';

export type PolygonStyleProps = {
  lineColor?: string;
  fillColor?: string;
  vertexColor?: string;
  vertexRadius?: number;
  vertexStrokeWidth?: number;
};

export type CanvasProps = {
  imageSource: string;
  maxPolygons?: number;
  polygonStyle?: PolygonStyleProps;
  imageSize?: {
    width: number;
    height: number;
  };
};

export type PolygonProps = {
  points: number[][];
  flattenedPoints: number[] | undefined;
  isFinished: boolean;
  polygonStyle?: PolygonStyleProps;
  handlePointDragMove: (e: KonvaEventObject<DragEvent>) => void;
  handlePointDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  handleGroupDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  handleMouseOverStartPoint: (e: KonvaEventObject<MouseEvent>) => void;
  handleMouseOutStartPoint: (e: KonvaEventObject<MouseEvent>) => void;
};
