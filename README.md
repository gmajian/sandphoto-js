# SandPhoto - ID Photo Generator

A JavaScript implementation of the SandPhoto ID photo generator application, originally a PHP version. This tool helps users create ID photos by arranging multiple photos on a single sheet for cost-effective printing.

## Features

- **Custom Photo Sizes**: Specify custom dimensions for your photos
- **Photo Count Control**: Choose how many photos to place on a sheet
- **Drag & Drop Upload**: Easy file upload with drag and drop support
- **Real-time Preview**: See your photo layout before downloading
- **Client-side Processing**: All processing happens in your browser for privacy
- **Multiple Languages**: Support for English and Chinese interfaces
- **Modular Architecture**: Reusable components for easy customization

## Modular UI System

The application now uses a modular architecture that eliminates code duplication and makes it easy to create different interfaces:

### Core Components

- **`SandPhotoApp`**: Main application class with configurable behavior
- **`UIGenerator`**: Dynamic UI generator for creating form components
- **`SandPhoto`**: Core photo processing engine
- **`phototypes.js`**: Photo type definitions and categories

### Benefits

1. **Code Reuse**: Same logic works across different pages
2. **Easy Localization**: Switch languages with simple configuration
3. **Flexible UI**: Generate different layouts dynamically
4. **Maintainable**: Changes in one place affect all instances
5. **Testable**: Each component can be tested independently

### Usage Examples

#### Basic Usage (English)
```javascript
// Create app with default English configuration
new SandPhotoApp();
```

#### Chinese Configuration
```javascript
// Create app with Chinese configuration
const chineseConfig = {
    language: 'zh',
    elementIds: {
        uploadArea: 'uploadArea',
        photoInput: 'filename',
        // ... other element IDs
    },
    texts: UIGenerator.getChineseConfig().texts
};

new SandPhotoApp(chineseConfig);
```

#### Dynamic Form Generation
```javascript
// Generate complete form dynamically
const uiGenerator = new UIGenerator(UIGenerator.getEnglishConfig());
const form = uiGenerator.generateCompleteForm('my-form');
document.body.appendChild(form);
```

### Available Pages

- **`index.html`**: Main English interface
- **`blog-integration.html`**: Chinese blog-style interface
- **`dynamic-demo.html`**: Demo showing dynamic UI generation
- **`tests.html`**: Simple test framework
- **`test-runner.html`**: Comprehensive test suite

## Custom Photo Size Feature

Users can now specify custom dimensions for their photos:

1. Select "Custom Size" from the photo size dropdown
2. Enter width and height in centimeters
3. The system validates input (0.1-50cm range)
4. Preview updates automatically with custom dimensions

### Validation Rules
- Width and height must be greater than 0
- Maximum dimension is 50cm
- Values are rounded to 0.1cm precision

## Photo Count Control

Control how many photos to place on a sheet:

1. Select from preset options (1, 2, 4, 6, 8, 12, 16, 20, 24)
2. Choose "Auto" for maximum possible photos
3. Use "Custom" to specify any number (1-100)

### Layout Algorithm
The system uses an intelligent layout algorithm that:
- Calculates optimal rows and columns
- Prefers square-like arrangements
- Centers photos properly
- Handles edge cases gracefully

## File Structure

```
sandphoto-js/
├── index.html              # Main English interface
├── blog-integration.html   # Chinese blog interface
├── dynamic-demo.html       # Dynamic UI demo
├── app.js                  # Main application logic
├── ui-generator.js         # UI generation utilities
├── sandphoto.js           # Core photo processing
├── phototypes.js          # Photo type definitions
├── styles.css             # Styling
├── test-suite.js          # Test definitions
├── tests.html             # Simple test framework
├── test-runner.html       # Comprehensive test suite
└── README.md              # This file
```

## Testing

The application includes comprehensive testing:

- **`tests.html`**: Quick validation with basic assertions
- **`test-runner.html`**: Full Jest-style test suite with detailed reporting

Run tests by opening either test file in your browser.

## Browser Compatibility

- Modern browsers with ES6+ support
- Canvas API for image processing
- File API for upload functionality
- Drag and Drop API for enhanced UX

## Privacy

All processing happens client-side. No images are uploaded to any server, ensuring complete privacy.

## License

This project is open source and available under the same license as the original PHP version.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application. 