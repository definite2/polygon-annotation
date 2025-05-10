import { KonvaEventObject } from 'konva/lib/Node';
import { ReactNode, useMemo } from 'react';
import { StageProps } from 'react-konva';
import { Provider } from 'react-redux';
import { initStore } from '../store';
import { Canvas } from './Canvas';
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
  isLineMode,
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
    return initStore(initialPolygons);
  }, [initialPolygons]);

  return (
    <Provider store={store}>
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
    </Provider>
  );
};
