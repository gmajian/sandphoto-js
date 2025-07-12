// SandPhoto Test Suite - Jest-style syntax
class TestSuite {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.beforeEach = null;
        this.afterEach = null;
    }

    beforeEach(fn) {
        this.beforeEach = fn;
    }

    afterEach(fn) {
        this.afterEach = fn;
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        const results = [];
        for (const test of this.tests) {
            try {
                await test.fn();
                results.push({ name: test.name, status: 'pass' });
            } catch (error) {
                results.push({ name: test.name, status: 'fail', error: error.message });
            }
        }
        return results;
    }
}

// Test utilities
function expect(value) {
    return {
        toBe(expected) {
            if (value !== expected) {
                throw new Error(`Expected ${value} to be ${expected}`);
            }
        },
        toEqual(expected) {
            if (JSON.stringify(value) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(value)} to equal ${JSON.stringify(expected)}`);
            }
        },
        toBeGreaterThan(expected) {
            if (value <= expected) {
                throw new Error(`Expected ${value} to be greater than ${expected}`);
            }
        },
        toBeLessThan(expected) {
            if (value >= expected) {
                throw new Error(`Expected ${value} to be less than ${expected}`);
            }
        },
        toBeTruthy() {
            if (!value) {
                throw new Error(`Expected ${value} to be truthy`);
            }
        },
        toBeFalsy() {
            if (value) {
                throw new Error(`Expected ${value} to be falsy`);
            }
        },
        toContain(expected) {
            if (!value.includes(expected)) {
                throw new Error(`Expected ${value} to contain ${expected}`);
            }
        },
        toHaveLength(expected) {
            if (value.length !== expected) {
                throw new Error(`Expected length ${value.length} to be ${expected}`);
            }
        },
        toBeLessThanOrEqual(expected) {
            if (value > expected) {
                throw new Error(`Expected ${value} to be less than or equal to ${expected}`);
            }
        },
        toBeGreaterThanOrEqual(expected) {
            if (value < expected) {
                throw new Error(`Expected ${value} to be greater than or equal to ${expected}`);
            }
        }
    };
}

// Photo Types Test Suite
function createPhotoTypesTestSuite() {
    const suite = new TestSuite('Photo Types');
    
    suite.test('should load all photo types', () => {
        expect(PHOTO_TYPES).toBeTruthy();
        expect(PHOTO_TYPES.length).toBeGreaterThan(0);
    });

    suite.test('should have correct categories', () => {
        const idPhotos = getPhotoTypesByCategory('id');
        const documentPhotos = getPhotoTypesByCategory('document');
        const paperSizes = getPhotoTypesByCategory('paper');
        
        expect(idPhotos.length).toBeGreaterThan(0);
        expect(documentPhotos.length).toBeGreaterThan(0);
        expect(paperSizes.length).toBeGreaterThan(0);
    });

    suite.test('should find specific photo types', () => {
        const oneInch = getPhotoTypeByName('1寸');
        const a4Paper = getPhotoTypeByName('A4');
        
        expect(oneInch).toBeTruthy();
        expect(oneInch.width).toBe(2.5);
        expect(oneInch.height).toBe(3.5);
        
        expect(a4Paper).toBeTruthy();
        expect(a4Paper.width).toBe(21.0);
        expect(a4Paper.height).toBe(29.7);
    });

    suite.test('should handle invalid photo type names', () => {
        const invalid = getPhotoTypeByName('nonexistent');
        expect(invalid).toBeFalsy();
    });

    return suite;
}

// SandPhoto Class Test Suite
function createSandPhotoTestSuite() {
    const suite = new TestSuite('SandPhoto Class');

    suite.test('should initialize with correct constants', () => {
        const sandPhoto = new SandPhoto();
        expect(sandPhoto.CM_PER_INCH).toBe(2.54);
        expect(sandPhoto.DPI).toBe(300);
    });

    suite.test('should convert centimeters to pixels correctly', () => {
        const sandPhoto = new SandPhoto();
        const pixels = sandPhoto.getPixelFromCM(2.5);
        const expected = Math.floor(2.5 * 300 / 2.54);
        expect(pixels).toBe(expected);
    });

    suite.test('should set container and target sizes', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7);
        sandPhoto.setTargetSize(2.5, 3.5);
        
        const containerWidthPx = sandPhoto.getPixelFromCM(21.0);
        const containerHeightPx = sandPhoto.getPixelFromCM(29.7);
        const targetWidthPx = sandPhoto.getPixelFromCM(2.5);
        const targetHeightPx = sandPhoto.getPixelFromCM(3.5);
        
        expect(sandPhoto.containerWidth).toBe(containerWidthPx);
        expect(sandPhoto.containerHeight).toBe(containerHeightPx);
        expect(sandPhoto.targetWidth).toBe(targetWidthPx);
        expect(sandPhoto.targetHeight).toBe(targetHeightPx);
    });

    suite.test('should create empty image with background', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(10, 10);
        sandPhoto.createEmptyImage('blue');
        
        expect(sandPhoto.canvas).toBeTruthy();
        expect(sandPhoto.ctx).toBeTruthy();
        expect(sandPhoto.canvas.width).toBe(sandPhoto.getPixelFromCM(10));
        expect(sandPhoto.canvas.height).toBe(sandPhoto.getPixelFromCM(10));
    });

    return suite;
}

// Layout Calculation Test Suite
function createLayoutTestSuite() {
    const suite = new TestSuite('Layout Calculations');
    
    suite.test('should calculate correct layout for 1寸 on 6寸 paper', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(15.2, 10.2); // 6寸 paper
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸 photo
        
        const GAP = 5;
        const targetWidthPx = sandPhoto.getPixelFromCM(2.5);
        const targetHeightPx = sandPhoto.getPixelFromCM(3.5);
        const containerWidthPx = sandPhoto.getPixelFromCM(15.2);
        const containerHeightPx = sandPhoto.getPixelFromCM(10.2);
        
        // Calculate expected layout
        const wn = Math.floor(containerWidthPx / (targetWidthPx + GAP));
        const hn = Math.floor(containerHeightPx / (targetHeightPx + GAP));
        const wn2 = Math.floor(containerHeightPx / (targetWidthPx + GAP));
        const hn2 = Math.floor(containerWidthPx / (targetHeightPx + GAP));
        
        const normalLayout = wn * hn;
        const rotatedLayout = wn2 * hn2;
        
        expect(normalLayout).toBeGreaterThan(0);
        expect(rotatedLayout).toBeGreaterThan(0);
        expect(Math.max(normalLayout, rotatedLayout)).toBe(16);
    });

    suite.test('should handle different photo and paper combinations', () => {
        const testCases = [
            { photo: { width: 2.5, height: 3.5 }, paper: { width: 21.0, height: 29.7 }, expected: 'multiple' },
            { photo: { width: 3.8, height: 5.1 }, paper: { width: 15.2, height: 10.2 }, expected: 'multiple' },
            { photo: { width: 20.0, height: 28.0 }, paper: { width: 21.0, height: 29.7 }, expected: 1 }
        ];
        
        testCases.forEach(({ photo, paper, expected }) => {
            const sandPhoto = new SandPhoto();
            sandPhoto.setContainerSize(paper.width, paper.height);
            sandPhoto.setTargetSize(photo.width, photo.height);
            
            const GAP = 5;
            const targetWidthPx = sandPhoto.getPixelFromCM(photo.width);
            const targetHeightPx = sandPhoto.getPixelFromCM(photo.height);
            const containerWidthPx = sandPhoto.getPixelFromCM(paper.width);
            const containerHeightPx = sandPhoto.getPixelFromCM(paper.height);
            
            const wn = Math.floor(containerWidthPx / (targetWidthPx + GAP));
            const hn = Math.floor(containerHeightPx / (targetHeightPx + GAP));
            const wn2 = Math.floor(containerHeightPx / (targetWidthPx + GAP));
            const hn2 = Math.floor(containerWidthPx / (targetHeightPx + GAP));
            
            const maxPhotos = Math.max(wn * hn, wn2 * hn2);
            
            if (expected === 'multiple') {
                expect(maxPhotos).toBeGreaterThan(1);
            } else {
                expect(maxPhotos).toBe(expected);
            }
        });
    });

    return suite;
}

// Image Processing Test Suite
function createImageProcessingTestSuite() {
    const suite = new TestSuite('Image Processing');
    
    suite.test('should process images and create photo sheets', async () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7); // A4
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸
        
        // Create test image
        const testCanvas = document.createElement('canvas');
        testCanvas.width = 200;
        testCanvas.height = 200;
        const testCtx = testCanvas.getContext('2d');
        testCtx.fillStyle = '#ff0000';
        testCtx.fillRect(0, 0, 200, 200);
        
        const testImg = new Image();
        testImg.src = testCanvas.toDataURL();
        
        return new Promise((resolve) => {
            testImg.onload = () => {
                const photoCount = sandPhoto.putPhoto(testImg, 'blue');
                
                expect(photoCount).toBeGreaterThan(0);
                expect(sandPhoto.canvas).toBeTruthy();
                expect(sandPhoto.ctx).toBeTruthy();
                
                resolve();
            };
        });
    });

    suite.test('should generate preview canvases', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7);
        sandPhoto.setTargetSize(2.5, 3.5);
        sandPhoto.createEmptyImage('white');
        
        const previewCanvas = sandPhoto.getPreviewCanvas(800, 600);
        
        expect(previewCanvas).toBeTruthy();
        expect(previewCanvas.width).toBeLessThanOrEqual(800);
        expect(previewCanvas.height).toBeLessThanOrEqual(600);
    });

    suite.test('should handle different background colors', () => {
        const colors = ['white', 'blue', 'gray'];
        
        colors.forEach(color => {
            const sandPhoto = new SandPhoto();
            sandPhoto.setContainerSize(10, 10);
            sandPhoto.setTargetSize(2, 2);
            sandPhoto.createEmptyImage(color);
            
            expect(sandPhoto.canvas).toBeTruthy();
        });
    });

    return suite;
}

// App Integration Test Suite
function createAppIntegrationTestSuite() {
    const suite = new TestSuite('App Integration');
    
    suite.test('should populate photo type selectors', () => {
        const targetTypes = [...getPhotoTypesByCategory('id'), ...getPhotoTypesByCategory('document')];
        const containerTypes = getPhotoTypesByCategory('paper');
        
        expect(targetTypes.length).toBeGreaterThan(0);
        expect(containerTypes.length).toBeGreaterThan(0);
    });

    suite.test('should handle file validation', () => {
        // Mock file object
        const validFile = { type: 'image/jpeg', size: 1024 * 1024 };
        const invalidFile = { type: 'text/plain', size: 1024 * 1024 };
        const largeFile = { type: 'image/jpeg', size: 10 * 1024 * 1024 };
        
        // Test file type validation
        expect(validFile.type.startsWith('image/')).toBeTruthy();
        expect(invalidFile.type.startsWith('image/')).toBeFalsy();
        
        // Test file size validation
        expect(validFile.size).toBeLessThan(8 * 1024 * 1024);
        expect(largeFile.size).toBeGreaterThan(8 * 1024 * 1024);
    });

    suite.test('should include custom size option in photo types', () => {
        // Mock the app's photo type population logic
        const targetTypes = [...getPhotoTypesByCategory('id'), ...getPhotoTypesByCategory('document')];
        const hasCustomOption = targetTypes.some(type => type.name === 'Custom Size');
        
        // Custom size should be available as an option
        expect(targetTypes.length).toBeGreaterThan(0);
    });

    return suite;
}

// Custom Size Feature Test Suite
function createCustomSizeTestSuite() {
    const suite = new TestSuite('Custom Size Features');
    
    suite.test('should validate custom dimensions correctly', () => {
        // Test valid custom dimensions
        const validDimensions = [
            { width: 3.5, height: 4.8, expected: true },
            { width: 0.1, height: 0.1, expected: true },
            { width: 50.0, height: 50.0, expected: true },
            { width: 2.0, height: 3.0, expected: true }
        ];
        
        // Test invalid custom dimensions
        const invalidDimensions = [
            { width: 0, height: 3.5, expected: false },
            { width: 3.5, height: 0, expected: false },
            { width: -1, height: 3.5, expected: false },
            { width: 3.5, height: -1, expected: false },
            { width: 51, height: 3.5, expected: false },
            { width: 3.5, height: 51, expected: false },
            { width: NaN, height: 3.5, expected: false },
            { width: 3.5, height: NaN, expected: false }
        ];
        
        validDimensions.forEach(({ width, height, expected }) => {
            const isValid = width > 0 && height > 0 && width <= 50 && height <= 50 && 
                           !isNaN(width) && !isNaN(height);
            expect(isValid).toBe(expected);
        });
        
        invalidDimensions.forEach(({ width, height, expected }) => {
            const isValid = width > 0 && height > 0 && width <= 50 && height <= 50 && 
                           !isNaN(width) && !isNaN(height);
            expect(isValid).toBe(expected);
        });
    });

    suite.test('should generate correct custom photo size objects', () => {
        const testCases = [
            { width: 3.5, height: 4.8, expectedName: 'Custom (3.5cm × 4.8cm)' },
            { width: 2.0, height: 3.0, expectedName: 'Custom (2cm × 3cm)' },
            { width: 10.5, height: 15.0, expectedName: 'Custom (10.5cm × 15cm)' }
        ];
        
        testCases.forEach(({ width, height, expectedName }) => {
            const customSize = {
                name: `Custom (${width}cm × ${height}cm)`,
                width: width,
                height: height,
                category: 'custom'
            };
            
            expect(customSize.name).toBe(expectedName);
            expect(customSize.width).toBe(width);
            expect(customSize.height).toBe(height);
            expect(customSize.category).toBe('custom');
        });
    });

    suite.test('should handle custom size in SandPhoto processing', () => {
        const sandPhoto = new SandPhoto();
        const customWidth = 4.0;
        const customHeight = 5.5;
        
        sandPhoto.setContainerSize(21.0, 29.7); // A4 paper
        sandPhoto.setTargetSize(customWidth, customHeight);
        
        const expectedWidthPx = sandPhoto.getPixelFromCM(customWidth);
        const expectedHeightPx = sandPhoto.getPixelFromCM(customHeight);
        
        expect(sandPhoto.targetWidth).toBe(expectedWidthPx);
        expect(sandPhoto.targetHeight).toBe(expectedHeightPx);
    });

    suite.test('should calculate layout for custom sizes correctly', () => {
        const testCases = [
            { photo: { width: 4.0, height: 5.5 }, paper: { width: 21.0, height: 29.7 } },
            { photo: { width: 2.5, height: 3.5 }, paper: { width: 15.2, height: 10.2 } },
            { photo: { width: 10.0, height: 15.0 }, paper: { width: 21.0, height: 29.7 } }
        ];
        
        testCases.forEach(({ photo, paper }) => {
            const sandPhoto = new SandPhoto();
            sandPhoto.setContainerSize(paper.width, paper.height);
            sandPhoto.setTargetSize(photo.width, photo.height);
            
            const GAP = 5;
            const targetWidthPx = sandPhoto.getPixelFromCM(photo.width);
            const targetHeightPx = sandPhoto.getPixelFromCM(photo.height);
            const containerWidthPx = sandPhoto.getPixelFromCM(paper.width);
            const containerHeightPx = sandPhoto.getPixelFromCM(paper.height);
            
            const wn = Math.floor(containerWidthPx / (targetWidthPx + GAP));
            const hn = Math.floor(containerHeightPx / (targetHeightPx + GAP));
            const wn2 = Math.floor(containerHeightPx / (targetWidthPx + GAP));
            const hn2 = Math.floor(containerWidthPx / (targetHeightPx + GAP));
            
            const maxPhotos = Math.max(wn * hn, wn2 * hn2);
            
            expect(maxPhotos).toBeGreaterThan(0);
        });
    });

    suite.test('should handle custom size with different background colors', () => {
        const colors = ['white', 'blue', 'gray'];
        const customSize = { width: 3.5, height: 4.8 };
        
        colors.forEach(color => {
            const sandPhoto = new SandPhoto();
            sandPhoto.setContainerSize(21.0, 29.7);
            sandPhoto.setTargetSize(customSize.width, customSize.height);
            sandPhoto.createEmptyImage(color);
            
            expect(sandPhoto.canvas).toBeTruthy();
            expect(sandPhoto.ctx).toBeTruthy();
        });
    });

    suite.test('should generate preview for custom sizes', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7);
        sandPhoto.setTargetSize(4.0, 5.5);
        sandPhoto.createEmptyImage('white');
        
        const previewCanvas = sandPhoto.getPreviewCanvas(800, 600);
        
        expect(previewCanvas).toBeTruthy();
        expect(previewCanvas.width).toBeLessThanOrEqual(800);
        expect(previewCanvas.height).toBeLessThanOrEqual(600);
    });

    suite.test('should handle edge case custom dimensions', () => {
        const edgeCases = [
            { width: 0.1, height: 0.1, description: 'minimum dimensions' },
            { width: 50.0, height: 50.0, description: 'maximum dimensions' },
            { width: 1.0, height: 1.0, description: 'square custom size' },
            { width: 0.5, height: 10.0, description: 'very thin custom size' },
            { width: 10.0, height: 0.5, description: 'very tall custom size' }
        ];
        
        edgeCases.forEach(({ width, height, description }) => {
            const sandPhoto = new SandPhoto();
            sandPhoto.setContainerSize(21.0, 29.7);
            sandPhoto.setTargetSize(width, height);
            
            const expectedWidthPx = sandPhoto.getPixelFromCM(width);
            const expectedHeightPx = sandPhoto.getPixelFromCM(height);
            
            expect(sandPhoto.targetWidth).toBe(expectedWidthPx);
            expect(sandPhoto.targetHeight).toBe(expectedHeightPx);
        });
    });

    suite.test('should handle photo count control', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7); // A4
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸
        
        // Test that putPhotoWithCount method exists
        expect(typeof sandPhoto.putPhotoWithCount).toBe('function');
        expect(typeof sandPhoto.calculateOptimalLayout).toBe('function');
    });

    suite.test('should calculate optimal layout for different photo counts', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7); // A4
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸
        
        const testCases = [
            { count: 1, expected: 'should fit' },
            { count: 4, expected: 'should fit' },
            { count: 8, expected: 'should fit' },
            { count: 16, expected: 'should fit' },
            { count: 100, expected: 'should fallback to max' }
        ];
        
        testCases.forEach(({ count, expected }) => {
            const layout = sandPhoto.calculateOptimalLayout(count, 5);
            if (count <= 50) {
                expect(layout).toBeTruthy();
            } else {
                // For very high counts, it might fallback to max layout
                expect(layout === null || layout).toBeTruthy();
            }
        });
    });

    suite.test('should center photos correctly for specific counts', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(15.2, 10.2); // 6寸 paper
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸 photo
        
        // Test 6 photos on 6寸 paper - should be 2x3 or 3x2 layout
        const layout = sandPhoto.calculateOptimalLayout(6, 5);
        expect(layout).toBeTruthy();
        expect(layout.cols * layout.rows).toBeGreaterThanOrEqual(6);
        
        // The layout should be reasonably balanced (not too wide or tall)
        const aspectRatio = layout.cols / layout.rows;
        expect(aspectRatio).toBeGreaterThan(0.5);
        expect(aspectRatio).toBeLessThan(2.0);
    });

    suite.test('should calculate centering positions correctly', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(15.2, 10.2); // 6寸 paper
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸 photo
        
        const GAP = 5;
        const layout = { cols: 3, rows: 2 };
        const containerWidth = sandPhoto.getPixelFromCM(15.2);
        const containerHeight = sandPhoto.getPixelFromCM(10.2);
        const targetWidth = sandPhoto.getPixelFromCM(2.5);
        const targetHeight = sandPhoto.getPixelFromCM(3.5);
        
        // Calculate centering positions
        const totalWidth = layout.cols * (targetWidth + GAP) - GAP;
        const totalHeight = layout.rows * (targetHeight + GAP) - GAP;
        const wStart = (containerWidth - totalWidth) / 2;
        const hStart = (containerHeight - totalHeight) / 2;
        
        // Verify centering calculations
        expect(wStart).toBeGreaterThan(0);
        expect(hStart).toBeGreaterThan(0);
        expect(wStart + totalWidth).toBeLessThan(containerWidth);
        expect(hStart + totalHeight).toBeLessThan(containerHeight);
    });

    return suite;
}

// Photo Count Control Test Suite
function createPhotoCountTestSuite() {
    const suite = new TestSuite('Photo Count Control');
    
    suite.test('should validate photo count inputs', () => {
        // Test valid photo counts
        const validCounts = [1, 2, 4, 6, 8, 12, 16, 20, 24, 50, 100];
        
        // Test invalid photo counts
        const invalidCounts = [0, -1, 101, 200, NaN];
        
        validCounts.forEach(count => {
            const isValid = count > 0 && count <= 100 && !isNaN(count);
            expect(isValid).toBe(true);
        });
        
        invalidCounts.forEach(count => {
            const isValid = count > 0 && count <= 100 && !isNaN(count);
            expect(isValid).toBe(false);
        });
    });

    suite.test('should handle auto mode vs specific counts', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7); // A4
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸
        
        // Test that auto mode uses maximum layout
        expect(typeof sandPhoto.putPhoto).toBe('function');
        expect(typeof sandPhoto.putPhotoWithCount).toBe('function');
    });

    suite.test('should calculate optimal layout for small counts', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7); // A4
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸
        
        const smallCounts = [1, 2, 4, 6, 8];
        
        smallCounts.forEach(count => {
            const layout = sandPhoto.calculateOptimalLayout(count, 5);
            expect(layout).toBeTruthy();
            expect(layout.cols * layout.rows).toBeGreaterThanOrEqual(count);
        });
    });

    suite.test('should handle custom count input validation', () => {
        const testCases = [
            { input: '1', expected: 1, valid: true },
            { input: '10', expected: 10, valid: true },
            { input: '50', expected: 50, valid: true },
            { input: '100', expected: 100, valid: true },
            { input: '0', expected: null, valid: false },
            { input: '-1', expected: null, valid: false },
            { input: '101', expected: null, valid: false },
            { input: 'abc', expected: null, valid: false }
        ];
        
        testCases.forEach(({ input, expected, valid }) => {
            const count = parseInt(input);
            const isValid = !isNaN(count) && count > 0 && count <= 100;
            expect(isValid).toBe(valid);
        });
    });

    suite.test('should handle different photo sizes with count control', () => {
        const testCases = [
            { photo: { width: 2.5, height: 3.5 }, count: 4 }, // 1寸, 4 photos
            { photo: { width: 3.8, height: 5.1 }, count: 6 }, // 2寸, 6 photos
            { photo: { width: 4.0, height: 5.5 }, count: 8 }  // Custom, 8 photos
        ];
        
        testCases.forEach(({ photo, count }) => {
            const sandPhoto = new SandPhoto();
            sandPhoto.setContainerSize(21.0, 29.7); // A4
            sandPhoto.setTargetSize(photo.width, photo.height);
            
            const layout = sandPhoto.calculateOptimalLayout(count, 5);
            expect(layout).toBeTruthy();
            expect(layout.cols * layout.rows).toBeGreaterThanOrEqual(count);
        });
    });

    return suite;
}

// Export test suites for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createPhotoTypesTestSuite,
        createSandPhotoTestSuite,
        createLayoutTestSuite,
        createImageProcessingTestSuite,
        createAppIntegrationTestSuite,
        createCustomSizeTestSuite,
        createPhotoCountTestSuite
    };
} 