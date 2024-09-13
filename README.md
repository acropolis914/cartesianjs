# Cartesian Plane Implementation

A dynamic Cartesian plane implementation using D3.js and vanilla JavaScript.

## Features

- Interactive SVG-based Cartesian plane
- Dynamic resizing based on container size
- Ability to add and remove points
- Persistent storage of points using local storage
- Grid and axes automatically adjust to available space
- Support for various geometric transformations (reflection, rotation, scaling)

## Getting Started

1. Clone the repository:

2. Open the  file in a web browser to view and interact with the Cartesian plane.

## Directory Structure

C:.
|   index.html
|   README.md
|   setup.sh
+---scripts
|       axis.js
|       graph-setup.js
|       grid.js
|       main.js
|       points.js
|       shapes.js
|       storeData.js
|       transformations.js
|       utils.js
|
\---styles
        cartesian-plane.css

## Usage

- Click anywhere on the plane to add a point.
- Click on an existing point to remove it.
- Use the "Add Point" button to randomly add a point.
- View the list of all points below the plane.
- Resize the window to see the plane adjust dynamically.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [D3.js](https://d3js.org/) for powerful SVG manipulation capabilities.
- Stack Overflow community for various implementation insights.

## TODO

- Implement more advanced geometric transformations
- Add support for drawing different shapes (lines, circles, rectangles)
- Improve user interface for better accessibility
- Optimize performance for large numbers of points
