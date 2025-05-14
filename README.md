# Polygon Annotation

1. [Introduction](#intruduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Props](#props)
6. [Contributing](#contributing)

## Introduction

This react polygon annotation component helps you for annotating objects or regions of interest within images (video support is going to be added).
Polygon annotation is a crucial part of many computer vision and image processing applications, and this component simplifies the integration of this functionality into your React projects.

### What is Polygon Annotation?

Polygon annotation is a technique used in computer vision to define the boundaries of objects or regions within an image or video by specifying a series of connected vertices.

## Features

This library is an ideal choice for those seeking to create their annotation workflows.

- [x] Polygon annotation on image.
- [x] Multiple support: Draw multiple polygons.
- [x] Drag and Drop: Easily edit your points by dragging and dropping vertices or entire polygons.
- [x] Flexible Usage: Restrict drag and drop within image, set a maximum limit on the number of polygons.
- [x] Custom Styling: Customize the appearance of your annotations, including colors and vertex properties.
- [x] Undo and Redo: Effortlessly manage your annotation history with built-in undo and redo functionality.
- [x] Initial data: You can bring your own polygon data and use it as initial polygons.
- [x] Edit label: updateLabel function allows you to edit label, it is just the function you can use your custom input elements.
- [ ] Delete: Delete selected polygon, or clear all data.
- [ ] Polygon annotation on video (who wants to use it in a live cam, i.e. workplace safety AIs)

## Installation

```bash
npm install polygon-annotation
```

or

```bash
yarn add polygon-annotation
```

## Props

| Prop              | Type                                            | Description                                                                                                                                               | Default |
| ----------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `bgImage`         | `string`                                        | Image path.                                                                                                                                               | `''`    |
| `maxPolygons`     | `number`                                        | The maximum number of polygons allowed to be drawn.                                                                                                       | `1`     |
| `imageSize`       | [ImageSize](#imageSize)                         | Width and height of the image (if it's not provided, it uses original width and height of the image).                                                     |         |
| `polygonStyle`    | [PolygonStyle](#polygonstyle)                   | Polygon style.                                                                                                                                            |         |
| `showLabel`       | `boolean`                                       | Boolean value that you can see the label                                                                                                                  |         |
| `initialPolygons` | [PolygonInputProps](#polygonInputProps)         | If you use another tool, like LabelMe, you can export the data and use here as initial data.                                                              |         |
| `children`        | `ReactNode`                                     | The PolygonAnnotation component is a provider component, you can access coordiantes(points) and undo/redo within child component. i.e. Toolbar component. | `<></>` |
| `className`       | `string`                                        | Custom CSS class name for the PolygonAnnotation container.                                                                                                |         |
| `onContextMenu`   | `(evt: KonvaEventObject<PointerEvent>) => void` | Callback for context menu events (right-click) on the annotation stage.                                                                                   |         |
| `isLineMode`      | `boolean`                                       | Enable line drawing mode instead of polygon mode.                                                                                                         | `false` |
| `stageProps`      | `StageProps`                                    | Additional props to pass to the underlying Konva Stage component.                                                                                         |         |

### ImageSize

| Prop   | Type   |
| ------ | ------ |
| width  | number |
| height | number |

### PolygonStyle

| Prop         | Type   |
| ------------ | ------ |
| vertexRadius | number |
| lineColor    | string |
| fillColor    | string |
| vertexColor  | string |

### PolygonInputProps

| Prop   | Type       |
| ------ | ---------- |
| id?    | string     |
| label? | string     |
| points | number[][] |

## Usage

### 1. Only Drawing Polygons

```jsx
const imageSource = './space_landscape.jpg';
const maxPolygons = 2;
const polygonStyle = {
  vertexRadius: 6,
  lineColor: '#1ea703',
  fillColor: '#37f71139',
  vertexColor: '#ff0000',
};
const initialData = [
  {
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
const Example = () => {
  return (
    <PolygonAnnotation
      bgImage={imageSource}
      maxPolygons={maxPolygons}
      polygonStyle={polygonStyle}
      showLabel
      initialPolygons={initialData}
    />
  );
};
```

### 2. Export Data, Update Label and Manipulate History

To export the drawn data you need to use `useGetPolygons` hook exported from the library. This hook returns polygons data and also a function to enable to update polygon's label.

There is another hook exported from the library called `useUndoRedo`. It returns `undo` and `redo` actions.

See an example toolbar in demo app [here](https://github.com/definite2/polygon-annotation/blob/main/demo/Toolbar.tsx) which displays how you can customize the data setting, i.e. set polygonStyle, set max polygon number to draw, edit labels, export data, and perform undo/redo actions.

NOTE: This toolbar component should be the children of the PolygonAnnotation component to use the hooks.

### 3. Video Annotation Mode

```jsx

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
```

### 4. Line Drawing Mode

```jsx

const initialData = [
  {
    id: 'd3ab238e-c2fd-4337-a397-3d813f575894',
    label: 'planet',
    points: [
      [634.5, 177],
      [387.5, 32],
    ],
  },
  {
    id: '10f65935-596a-4447-8ea5-3b2a24b5e73c',
    label: 'planet2',
    points: [
      [93.5, 34],
      [248.5, 160],
    ],
  },
];

const imageSource = './space_landscape.jpg';

const LineDrawExample = () => {
  const [maxPolygons, setMaxPolygons] = useState<number>(initialData.length || 1);
  const [showLabel, setShowLabel] = useState<boolean>(false);
  const [polygonStyle, setPolygonStyle] = useState<PolygonStyleProps>({
    vertexRadius: 6,
    lineColor: '#1ea703',
    fillColor: '#37f71139',
    vertexColor: '#ff0000',
    vertexStrokeWidth: 2,
  });

  return (
    <PolygonAnnotation
      bgImage={imageSource}
      maxPolygons={maxPolygons}
      polygonStyle={polygonStyle}
      showLabel={showLabel}
      initialPolygons={initialData}
      className={`polygon-annotation`}
      isLineMode
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
  );
};
```

## Contributing

You are welcome to open issues, pull requests or feature requests.
