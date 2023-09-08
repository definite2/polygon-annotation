import { ReactNode } from 'react';
import Canvas from './Canvas';
import { Provider } from 'react-redux';
import { store } from 'store';

export const PolygonAnnotation = ({
  bgImage,
  maxPolygons,
  children,
}: {
  bgImage: string;
  children: ReactNode;
  maxPolygons?: number;
}) => {
  return (
    <Provider store={store}>
      <Canvas imageSource={bgImage} maxPolygons={maxPolygons} />
      {children}
    </Provider>
  );
};
