import { KonvaEventObject } from 'konva/lib/Node';
import { ReactNode, useMemo } from 'react';
import { StageProps } from 'react-konva';
import { Provider } from 'react-redux';
import { initStore } from '../store';
import { Canvas } from './Canvas';
import { PolygonInputProps, PolygonStyleProps } from './types';
import { PolygonProvider } from './context/PolygonContext';

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
  const store = useMemo(() => {
    return initStore(initialPolygons, isLineMode);
  }, [initialPolygons, isLineMode]);

  return (
    <PolygonProvider initialPolygons={initialPolygons}>
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
