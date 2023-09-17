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

While tools like LabelMe offer label-based annotation, this project focuses on polygon annotations.

Unlike standalone solutions, this component is a reusable React component, making it the ideal choice for those seeking to create their annotation workflows.

- [x] Polygon annotation on image.
- [x] Multiple support: Draw multiple polygons.
- [x] Drag and Drop: Easily edit your annotations by dragging and dropping vertices or entire polygons.
- [x] Flexible Usage: Restrict drag and drop within image, set a maximum limit on the number of polygons.
- [x] Custom Styling: Customize the appearance of your annotations, including colors and vertex properties.
- [x] Undo and Redo: Effortlessly manage your annotation history with built-in undo and redo functionality.
- [ ] Polygon annotation on video.

## Installation

```bash
npm install polygon-annotation
```

or

```bash
yarn add polygon-annotation
```

## Props

| Prop           | Type                          | Description                                                                                                                                               | Default |
| -------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `bgImage`      | `String`                      | Image path.                                                                                                                                               | `''`    |
| `children`     | `ReactNode`                   | The PolygonAnnotation component is a provider component, you can access coordiantes(points) and undo/redo within child component. i.e. Toolbar component. | `<></>` |
| `maxPolygons`  | `number`                      | The maximum number of polygons allowed to be drawn.                                                                                                       | `1`     |
| `imageSize`    | [ImageSize](#imageSize)       | Width and height of the image (if it's not provided, it uses original width and height of the image).                                                     |         |
| `polygonStyle` | [PolygonStyle](#polygonstyle) | Polygon style.                                                                                                                                            |         |

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

## Usage

```jsx
const videoSource = './space_landscape.jpg';

const Example = () => {
  const maxPolygons = 2;
  const polygonStyle = {
    vertexRadius: 6,
    lineColor: '#1ea703',
    fillColor: '#37f71139',
    vertexColor: '#ff0000',
  };

  return (
    <PolygonAnnotation
      bgImage={videoSource}
      maxPolygons={maxPolygons}
      polygonStyle={polygonStyle}
    />
  );
};
```

## Contributing

You are welcome to open issue, pull request or feature requests.
