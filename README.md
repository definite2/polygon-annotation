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

| Prop              | Type                                    | Description                                                                                                                                               | Default |
| ----------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `bgImage`         | `string`                                | Image path.                                                                                                                                               | `''`    |
| `maxPolygons`     | `number`                                | The maximum number of polygons allowed to be drawn.                                                                                                       | `1`     |
| `imageSize`       | [ImageSize](#imageSize)                 | Width and height of the image (if it's not provided, it uses original width and height of the image).                                                     |         |
| `polygonStyle`    | [PolygonStyle](#polygonstyle)           | Polygon style.                                                                                                                                            |         |
| `showLabel`       | `boolean`                               | Boolean value that you can see the label                                                                                                                  |         |
| `initialPolygons` | [PolygonInputProps](#polygonInputProps) | If you use another tool, like LabelMe, you can export the data and use here as initial data.                                                              |         |
| `children`        | `ReactNode`                             | The PolygonAnnotation component is a provider component, you can access coordiantes(points) and undo/redo within child component. i.e. Toolbar component. | `<></>` |

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

Below is an example toolbar which displays how you can customize the data setting, i.e. set polygonStyle, set max polygon number to draw, edit labels, export data, and perform undo/redo actions.

This toolbar component should be the children of the PolygonAnnotation component to use the hooks.

```jsx
// Toolbar.tsx
const Toolbar = ({
  maxPolygons,
  showLabel,
  setMaxPolygons,
  setShowLabel,
  config,
  setConfig,
}: {
  maxPolygons: number;
  config: PolygonStyleProps;
  showLabel: boolean;
  setMaxPolygons: (maxPolygons: number) => void;
  setConfig: (config: PolygonStyleProps) => void;
  setShowLabel: (showLabel: boolean) => void;
}) => {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const { polygons, updateLabel } = useGetPolygons();

  const exportData = () => {
    const data = JSON.stringify(polygons);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'polygon-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="toolbar-wrapper">
      <div>
        <label htmlFor="maxPolygons">Max Polygon Number: </label>
        <input
          id="maxPolygons"
          type="number"
          placeholder="Enter max number of polygons"
          value={maxPolygons}
          onChange={(e) => setMaxPolygons(+e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lineColor">Polygon Line Color: </label>
        <input
          id="lineColor"
          type="color"
          placeholder="Enter polygon line color"
          value={config.lineColor}
          onChange={(e) => setConfig({ ...config, lineColor: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="vertexColor">Vertex Fill Color: </label>
        <input
          id="vertexColor"
          type="color"
          placeholder="Enter polygon vertex color"
          value={config.vertexColor}
          onChange={(e) => setConfig({ ...config, vertexColor: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="vertexColor">Polygon Fill Color: </label>
        <input
          id="fillColor"
          type="text"
          placeholder="Enter polygon fill color"
          value={config.fillColor}
          onChange={(e) => setConfig({ ...config, fillColor: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="vertexRad">Vertex Radius: </label>
        <input
          id="vertexRad"
          type="number"
          placeholder="Enter a value"
          value={config.vertexRadius}
          onChange={(e) => setConfig({ ...config, vertexRadius: +e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="vertexStroke">Vertex Stroke Width: </label>
        <input
          id="vertexStroke"
          type="number"
          placeholder="Enter a value"
          value={config.vertexStrokeWidth}
          onChange={(e) => setConfig({ ...config, vertexStrokeWidth: +e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="showLabel">Show Labels: </label>
        <input
          id="showLabel"
          type="checkbox"
          checked={showLabel}
          onChange={(e) => setShowLabel(e.target.checked)}
        />
      </div>
      {showLabel &&
        polygons.map((p) => (
          <div key={p.id}>
            <label htmlFor={`label-${p.id}`}>Label </label>
            <input
              id={`label-${p.id}`}
              type="text"
              placeholder="Enter a value"
              value={p.label}
              onChange={(e) => {
                updateLabel({ id: p.id, label: e.target.value });
              }}
            />
          </div>
        ))}
      <div>
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
      </div>
      <div>
        <button disabled={!polygons.length} onClick={exportData}>
          Export Data
        </button>
      </div>
      <div className="points-wrapper">
        {polygons.map((polygon) => (
          <div key={polygon.id}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              label:{JSON.stringify(polygon.label)}
              <br />
              points:{JSON.stringify(polygon.points)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

```

```jsx
const AnnotationDraw = () => {
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
      bgImage={videoSource}
      maxPolygons={maxPolygons}
      polygonStyle={polygonStyle}
      showLabel={showLabel}
      initialPolygons={initialData}
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
