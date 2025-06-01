import { useRef, useState } from 'react';
import { PolygonAnnotation, PolygonStyleProps } from '../src/lib';
import Toolbar from './Toolbar';

const initialData = [
  {
    id: 'd3ab238e-c2fd-4337-a397-3d813f575894',
    label: 'planet',
    points: [
      [79.5, 35],
      [84.5, 68],
      [108.5, 82],
      [137.5, 77],
      [150.5, 52],
      [144.5, 28],
      [127.5, 17],
      [100.5, 19],
    ],
  },
  {
    id: '10f65935-596a-4447-8ea5-3b2a24b5e73c',
    label: 'planet',
    points: [
      [456.5, 53],
      [442.5, 102],
      [477.5, 165],
      [536.5, 176],
      [593.5, 132],
      [593.5, 71],
      [560.5, 29],
      [517.5, 25],
    ],
  },
];

const VideoExample = () => {
  const [maxPolygons, setMaxPolygons] = useState<number>(initialData.length || 1);
  const [showLabel, setShowLabel] = useState<boolean>(false);
  const [polygonStyle, setPolygonStyle] = useState<PolygonStyleProps>({
    vertexRadius: 6,
    lineColor: '#1ea703',
    fillColor: '#37f71139',
    vertexColor: '#ff0000',
    vertexStrokeWidth: 2,
  });

  const [videoDimentions, setVideoDimentions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSource = 'https://www.w3schools.com/html/mov_bbb.mp4';

  return (
    <div className="video-example__container">
      <video
        ref={videoRef}
        onLoadedData={() => {
          const video = videoRef.current;
          if (video) {
            const videoOrginalWidth = video.videoWidth;
            const videoOrginalheight = video.videoHeight;
            const videoRect = video.getBoundingClientRect();
            const computedWidth = videoRect.width;
            const computedHeight = videoRect.height;
            if (videoOrginalWidth && videoOrginalheight)
              setVideoDimentions({
                width: computedWidth,
                height: computedHeight,
              });
          }
        }}
        className="demo-video"
        autoPlay
        muted
        loop
      >
        <source src={videoSource} type="video/mp4" />
        <track kind="captions" src="" label="No captions" default />
        Your browser does not support the video tag.
      </video>
      <PolygonAnnotation
        imageSize={videoDimentions || { width: 600, height: 300 }} //rename to mediaSize
        maxPolygons={maxPolygons}
        polygonStyle={polygonStyle}
        showLabel={showLabel}
        initialPolygons={initialData}
        className={`video-example__polygon-annotation polygon-annotation`}
      >
        <Toolbar
          maxPolygons={maxPolygons}
          setMaxPolygons={setMaxPolygons}
          config={polygonStyle}
          setConfig={setPolygonStyle}
          showLabel={showLabel}
          setShowLabel={setShowLabel}
        />
      </PolygonAnnotation>
    </div>
  );
};

export default VideoExample;
