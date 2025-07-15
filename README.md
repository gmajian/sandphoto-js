# SandPhoto - ID Photo Generator

A JavaScript implementation of the SandPhoto ID photo generator application, originally a PHP version. This tool helps users create ID photos by arranging multiple photos on a single sheet for cost-effective printing.

## Features

- **Custom Photo Sizes**: Specify custom dimensions for your photos
- **Photo Count Control**: Choose how many photos to place on a sheet
- **Drag & Drop Upload**: Easy file upload with drag and drop support
- **Real-time Preview**: See your photo layout before downloading
- **Client-side Processing**: All processing happens in your browser for privacy
- **Multi-Language Support**: Support for 10 languages with automatic detection
- **Modular Architecture**: Reusable components for easy customization

## Multi-Language System

The application features a comprehensive multi-language system that supports 10 languages:

### Supported Languages
- 🇺🇸 **English** (en) - Default language
- 🇨🇳 **Chinese** (zh) - 中文
- 🇪🇸 **Spanish** (es) - Español
- 🇫🇷 **French** (fr) - Français
- 🇩🇪 **German** (de) - Deutsch
- 🇯🇵 **Japanese** (ja) - 日本語
- 🇰🇷 **Korean** (ko) - 한국어
- 🇷🇺 **Russian** (ru) - Русский
- 🇸🇦 **Arabic** (ar) - العربية (with RTL support)
- 🇵🇹 **Portuguese** (pt) - Português

### Language Features

#### Automatic Detection
```javascript
// Automatically detect user's browser language
const userLanguage = UIGenerator.detectUserLanguage();
const config = UIGenerator.getLanguageConfig(userLanguage);
```

#### Manual Language Selection
```javascript
// Choose specific language
const spanishConfig = UIGenerator.getLanguageConfig('es');
const uiGenerator = new UIGenerator(spanishConfig);
```

#### Dynamic Language Switching
```javascript
// Switch language at runtime
function switchLanguage(languageCode) {
    const config = UIGenerator.getLanguageConfig(languageCode);
    const uiGenerator = new UIGenerator(config);
    
    // Regenerate form with new language
    const form = uiGenerator.generateCompleteForm();
    container.innerHTML = '';
    container.appendChild(form);
    
    // Reinitialize app
    new SandPhotoApp(config);
}
```

### Adding New Languages

To add support for a new language (e.g., Italian):

1. **Add Language Configuration** in `ui-generator.js`:
```javascript
static getItalianConfig() {
    return {
        language: 'it',
        texts: {
            photoSizeTitle: 'Passo 1',
            selectPhotoSize: 'Seleziona Dimensione Foto',
            customSize: 'Dimensione Personalizzata',
            // ... all other text keys
        }
    };
}
```

2. **Add to Language Registry**:
```javascript
static getLanguageConfig(languageCode) {
    const configs = {
        'en': UIGenerator.getEnglishConfig(),
        'zh': UIGenerator.getChineseConfig(),
        'it': UIGenerator.getItalianConfig(), // Add new language
        // ... other languages
    };
    return configs[languageCode] || configs['en'];
}
```

3. **Add to Available Languages**:
```javascript
static getAvailableLanguages() {
    return [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'it', name: 'Italian', nativeName: 'Italiano' }, // Add new language
        // ... other languages
    ];
}
```

### Photo Type Localization

Photo types support multiple languages through the `name_en` and `name_zh` fields:

```javascript
// Get localized photo type names
const photoTypes = getPhotoTypesByCategoryLocalized('id', 'zh');
// Returns photo types with Chinese names

const photoTypes = getPhotoTypesByCategoryLocalized('document', 'en');
// Returns photo types with English names
```

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

#### Auto-Detection with Fallback
```javascript
// Auto-detect language with English fallback
const userLanguage = UIGenerator.detectUserLanguage();
const config = UIGenerator.getLanguageConfig(userLanguage);

new SandPhotoApp(config);
```

## Demo Pages

- **`index.html`**: Main user interface
- **`debug.html`**: Debug/testing interface
- **`tests.html`**: Test suite runner
- **`test-runner.html`**: Additional test runner

## File Structure

```
sandphoto-js/
├── app.js              # Main application logic
├── sandphoto.js        # Core photo processing
├── ui-generator.js     # Dynamic UI generation
├── phototypes.js       # Photo type definitions
├── styles.css          # Styling
├── index.html          # Main user page
├── debug.html          # Debug/testing page
├── test-suite.js       # Test suite logic
├── tests.html          # Test suite runner
├── test-runner.html    # Additional test runner
├── LICENSE             # License file
└── README.md           # This file
```

## Browser Support

- Modern browsers with ES6+ support
- Canvas API for image processing
- File API for upload functionality
- Drag and Drop API for enhanced UX

## Privacy

All processing happens client-side - your photos never leave your device!

## Contributing

To add support for a new language:

1. Add the language configuration to `UIGenerator`
2. Add photo type names in the new language to `phototypes.js`
3. Test the language with the demo pages
4. Update documentation

## License

This project is open source and available under the GNU General Public License v3.0 (GPL-3.0).

See the [LICENSE](LICENSE) file for details. 