import { KonvaEventObject } from 'konva/lib/Node';
import { ReactNode } from 'react';
import { StageProps } from 'react-konva';
import { Canvas } from './Canvas';
import { PolygonProvider } from './context/PolygonContext';
import { PolygonInputProps, PolygonStyleProps } from './types';

export const PolygonAnnotation = ({
  bgImage,
  maxPolygons,
  initialPolygons,
  polygonStyle,
  imageSize,
  showLabel,
  children,
  className,
  onContextMenu,
  isLineMode = false,
  stageProps,
}: {
  bgImage?: string;
  children?: ReactNode;
  maxPolygons?: number;
  imageSize?: { width: number; height: number };
  polygonStyle?: PolygonStyleProps;
  showLabel?: boolean;
  initialPolygons?: PolygonInputProps[];
  className?: string;
  onContextMenu?(evt: KonvaEventObject<PointerEvent>): void;
  isLineMode?: boolean;
  stageProps?: StageProps;
}) => {
  return (
    <PolygonProvider isLineMode={isLineMode} initialPolygons={initialPolygons}>
      <Canvas
        imageSource={bgImage}
        maxPolygons={maxPolygons}
        polygonStyle={polygonStyle}
        imageSize={imageSize}
        showLabel={showLabel}
        className={className}
        onContextMenu={onContextMenu}
        isLineMode={isLineMode}
        stageProps={stageProps}
      />
      {children}
    </PolygonProvider>
  );
};
