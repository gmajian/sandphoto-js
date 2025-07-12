# SandPhoto JavaScript Implementation

A pure client-side implementation of the SandPhoto ID photo generator, converted from the original PHP version. This tool helps you save money on photo printing by efficiently arranging multiple ID photos on a single photo paper.

## Features

- **Pure Client-Side**: All processing happens in your browser - no server required
- **Privacy First**: Your photos never leave your device
- **Multiple Photo Sizes**: Support for various ID photo standards (Chinese, international)
- **Custom Photo Sizes**: Create custom dimensions for special requirements
- **Multiple Paper Sizes**: A4, 5x7, 6x4, and other standard photo paper sizes
- **Background Colors**: White, blue, or gray backgrounds
- **Drag & Drop**: Easy file upload with drag and drop support
- **Real-time Preview**: See exactly how your photos will be arranged
- **High Quality**: 300 DPI output for professional printing

## How to Use

1. **Open the Application**: Simply open `index.html` in any modern web browser
2. **Upload Your Photo**: Drag and drop your photo or click to browse
3. **Select Photo Size**: Choose the ID photo size you need (1寸, 2寸, passport, etc.) or select "Custom Size" for custom dimensions
4. **Enter Custom Dimensions** (if selected): Specify width and height in centimeters (0.1cm to 50cm)
5. **Select Paper Size**: Choose the photo paper size (A4, 5x7, 6x4, etc.)
6. **Choose Background**: Select white, blue, or gray background
7. **Preview**: See how many photos will fit and how they'll be arranged
8. **Download**: Get your high-quality photo sheet ready for printing

## Supported Photo Sizes

### ID Photos
- 1寸 (2.5cm × 3.5cm)
- 大一寸 (3.3cm × 4.8cm)
- 小一寸 (2.2cm × 3.2cm)
- 2寸 (3.8cm × 5.1cm)
- And many more...

### Custom Sizes
- **Custom Dimensions**: Enter any width and height between 0.1cm and 50cm
- **Perfect for Special Requirements**: When standard sizes don't meet your needs
- **Real-time Validation**: Input validation ensures reasonable dimensions

### Document Photos
- Chinese ID Card (身份证)
- Passport (中国护照)
- US Visa (赴美非移民签证)
- Driver's License (驾驶证)
- And many international document standards...

## Supported Paper Sizes

### Standard Paper
- A4 (21.0cm × 29.7cm)
- A3 (29.7cm × 42.0cm)
- Letter (21.59cm × 27.94cm)

### Photo Paper
- 5寸(3R) (12.7cm × 8.9cm)
- 6寸(4R) (15.2cm × 10.2cm)
- 7寸(5R) (17.8cm × 12.7cm)
- 8寸(6R) (20.3cm × 15.2cm)
- And more...

## Technical Details

### Architecture
- **HTML5 Canvas**: For image processing and rendering
- **Pure JavaScript**: No dependencies or frameworks required
- **File API**: For client-side file handling
- **Blob API**: For downloading generated images

### Key Components
- `index.html`: Main application interface
- `styles.css`: Modern, responsive styling
- `phototypes.js`: Photo size definitions
- `sandphoto.js`: Core photo processing logic
- `app.js`: Application logic and UI interactions

### Image Processing
- **Smart Cropping**: Automatically crops photos to fit target dimensions
- **Optimal Layout**: Calculates the best arrangement to fit maximum photos
- **High Resolution**: 300 DPI output for professional printing
- **Quality Preservation**: Maintains image quality during processing

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## File Structure

```
sandphoto-js/
├── index.html          # Main application page
├── styles.css          # CSS styling
├── phototypes.js       # Photo size definitions
├── sandphoto.js        # Core processing logic
├── app.js             # Application logic
├── README.md          # This file
├── tests.html         # Basic unit tests
├── test-runner.html   # Comprehensive test runner
├── test-suite.js      # Jest-style test suites
├── debug.html         # Debug page for troubleshooting
└── test.html          # Simple test page
```

## Usage Examples

### Basic Usage
1. Open `index.html` in your browser
2. Upload a photo
3. Select "1寸" for photo size
4. Select "A4" for paper size
5. Choose background color
6. Download the generated sheet

### Custom Size Usage
1. Open `index.html` in your browser
2. Upload a photo
3. Select "Custom Size" from the photo size dropdown
4. Enter your desired width and height (e.g., 4.0cm × 5.5cm)
5. Select paper size and background color
6. Preview and download the generated sheet

### For Passport Photos
1. Upload a high-quality portrait photo
2. Select "中国护照" (3.3cm × 4.8cm)
3. Select "A4" paper
4. Choose blue background
5. Download and print

## Advantages Over Server-Side Version

- **No Server Required**: Works completely offline
- **Privacy**: Photos never leave your device
- **Speed**: No network latency
- **Cost**: No hosting or server costs
- **Reliability**: No server downtime issues
- **Scalability**: No server load concerns

## Converting from PHP Version

This JavaScript implementation maintains the same core logic as the original PHP version:

- Same photo size calculations
- Same layout optimization algorithm
- Same background color options
- Same output quality (300 DPI)
- Same filename format

## Testing

The project includes comprehensive unit tests:

### Basic Tests (`tests.html`)
- Simple test page with basic functionality verification
- Tests photo types, SandPhoto class, and image processing
- Good for quick validation

### Comprehensive Test Runner (`test-runner.html`)
- Full test suite with Jest-style syntax
- Tests all components: Photo Types, SandPhoto Class, Layout Calculations, Image Processing, App Integration
- Progress tracking and detailed reporting
- Professional test results display

### Debug Tools
- `debug.html`: Debug page for troubleshooting layout calculations
- `test.html`: Simple test page for basic functionality

### Running Tests
1. Open `test-runner.html` in your browser
2. Click "Run All Test Suites"
3. View detailed results for each component
4. Check success rate and failed tests

## Development

To modify or extend the application:

1. **Add New Photo Types**: Edit `phototypes.js` to add new photo sizes
2. **Modify Layout Logic**: Edit `sandphoto.js` for different arrangement algorithms
3. **Customize UI**: Edit `styles.css` and `index.html` for different designs
4. **Add Features**: Extend `app.js` for additional functionality
5. **Add Tests**: Create new test suites in `test-suite.js` or add tests to existing suites

## License

This implementation maintains the same license as the original SandPhoto project.

## Credits

Original PHP implementation by SandComp. JavaScript conversion maintains the same core functionality while providing a modern, client-side experience. 