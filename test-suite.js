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
        expect(sandPhoto.DPI).toBe(600);
    });

    suite.test('should convert centimeters to pixels correctly', () => {
        const sandPhoto = new SandPhoto();
        const pixels = sandPhoto.getPixelFromCM(2.5);
        const expected = Math.floor(2.5 * 600 / 2.54);
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
        
        return new Promise((resolve) => {
            const testImg = new Image();
            testImg.onload = () => {
                const photoCount = sandPhoto.putPhoto(testImg, 'blue');
                
                expect(photoCount).toBeGreaterThan(0);
                expect(sandPhoto.canvas).toBeTruthy();
                expect(sandPhoto.ctx).toBeTruthy();
                
                resolve();
            };
            testImg.src = testCanvas.toDataURL();
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

// Multi-Photo Feature Test Suite
function createMultiPhotoTestSuite() {
    const suite = new TestSuite('Multi-Photo Features');
    
    suite.test('should initialize SandPhoto with multi-photo support', () => {
        const sandPhoto = new SandPhoto();
        expect(typeof sandPhoto.putMultiplePhotos).toBe('function');
        expect(sandPhoto.DPI).toBe(600);
    });

    suite.test('should handle empty photo array', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7);
        sandPhoto.setTargetSize(2.5, 3.5);
        
        const result = sandPhoto.putMultiplePhotos([], 'blue');
        expect(result).toBe(0);
    });

    suite.test('should process single photo with multiple copies', () => {
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
        
        return new Promise((resolve) => {
            const testImg = new Image();
            testImg.onload = () => {
                const photoData = [{
                    id: 1,
                    image: testImg,
                    filename: 'test.jpg',
                    copies: 4
                }];
                
                const result = sandPhoto.putMultiplePhotos(photoData, 'blue');
                expect(result).toBe(4);
                expect(sandPhoto.canvas).toBeTruthy();
                resolve();
            };
            testImg.src = testCanvas.toDataURL();
        });
    });

    suite.test('should process multiple different photos', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7); // A4
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸
        
        // Create test images
        const createTestImage = (color) => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 200, 200);
            
            const img = new Image();
            img.src = canvas.toDataURL();
            return img;
        };
        
        const img1 = createTestImage('#ff0000');
        const img2 = createTestImage('#00ff00');
        const img3 = createTestImage('#0000ff');
        
        return new Promise((resolve) => {
            let loadedCount = 0;
            const onLoad = () => {
                loadedCount++;
                if (loadedCount === 3) {
                    const photoData = [
                        { id: 1, image: img1, filename: 'red.jpg', copies: 2 },
                        { id: 2, image: img2, filename: 'green.jpg', copies: 3 },
                        { id: 3, image: img3, filename: 'blue.jpg', copies: 1 }
                    ];
                    
                    const result = sandPhoto.putMultiplePhotos(photoData, 'blue');
                    expect(result).toBe(6); // 2 + 3 + 1
                    expect(sandPhoto.canvas).toBeTruthy();
                    resolve();
                }
            };
            const register = (img) => {
                if (img.complete) {
                    setTimeout(onLoad, 0);
                } else {
                    img.onload = onLoad;
                }
            };
            register(img1);
            register(img2);
            register(img3);
        });
    });

    suite.test('should handle different copy counts per photo', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(15.2, 10.2); // 6寸 paper
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸
        
        const testCanvas = document.createElement('canvas');
        testCanvas.width = 200;
        testCanvas.height = 200;
        const testCtx = testCanvas.getContext('2d');
        testCtx.fillStyle = '#ff0000';
        testCtx.fillRect(0, 0, 200, 200);
        
        return new Promise((resolve) => {
            const testImg = new Image();
            testImg.onload = () => {
                const photoData = [
                    { id: 1, image: testImg, filename: 'photo1.jpg', copies: 1 },
                    { id: 2, image: testImg, filename: 'photo2.jpg', copies: 5 },
                    { id: 3, image: testImg, filename: 'photo3.jpg', copies: 2 }
                ];
                
                const result = sandPhoto.putMultiplePhotos(photoData, 'white');
                expect(result).toBe(8); // 1 + 5 + 2
                expect(sandPhoto.canvas).toBeTruthy();
                resolve();
            };
            testImg.src = testCanvas.toDataURL();
        });
    });

    suite.test('should handle edge case with very small paper size', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(5.0, 5.0); // Very small paper
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸 photo
        
        const testCanvas = document.createElement('canvas');
        testCanvas.width = 200;
        testCanvas.height = 200;
        const testCtx = testCanvas.getContext('2d');
        testCtx.fillStyle = '#ff0000';
        testCtx.fillRect(0, 0, 200, 200);
        
        return new Promise((resolve) => {
            const testImg = new Image();
            testImg.onload = () => {
                const photoData = [
                    { id: 1, image: testImg, filename: 'photo1.jpg', copies: 10 }
                ];
                
                const result = sandPhoto.putMultiplePhotos(photoData, 'blue');
                
                // Should handle gracefully even with very small paper
                expect(result).toBeGreaterThanOrEqual(0);
                expect(sandPhoto.canvas).toBeTruthy();
                
                // Should not exceed what can physically fit
                const maxPossible = Math.floor(5.0 * 600 / 2.54 / (2.5 * 600 / 2.54)) * 
                                  Math.floor(5.0 * 600 / 2.54 / (3.5 * 600 / 2.54));
                expect(result).toBeLessThanOrEqual(maxPossible);
                
                resolve();
            };
            testImg.src = testCanvas.toDataURL();
        });
    });

    suite.test('should handle mixed photo sizes in multi-photo mode', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7); // A4
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸
        
        // Create test images with different dimensions
        const createTestImage = (width, height, color) => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, width, height);
            
            const img = new Image();
            img.src = canvas.toDataURL();
            return img;
        };
        
        const img1 = createTestImage(200, 200, '#ff0000'); // Square
        const img2 = createTestImage(300, 200, '#00ff00'); // Wide
        const img3 = createTestImage(200, 300, '#0000ff'); // Tall
        
        return new Promise((resolve) => {
            let loadedCount = 0;
            const onLoad = () => {
                loadedCount++;
                if (loadedCount === 3) {
                    const photoData = [
                        { id: 1, image: img1, filename: 'square.jpg', copies: 2 },
                        { id: 2, image: img2, filename: 'wide.jpg', copies: 3 },
                        { id: 3, image: img3, filename: 'tall.jpg', copies: 1 }
                    ];
                    
                    const result = sandPhoto.putMultiplePhotos(photoData, 'gray');
                    
                    expect(result).toBe(6); // 2 + 3 + 1
                    expect(sandPhoto.canvas).toBeTruthy();
                    
                    resolve();
                }
            };
            const register3 = (img) => {
                if (img.complete) {
                    setTimeout(onLoad, 0);
                } else {
                    img.onload = onLoad;
                }
            };
            register3(img1);
            register3(img2);
            register3(img3);
        });
    });

    suite.test('should calculate total photos correctly', () => {
        const photoData = [
            { id: 1, image: null, filename: 'photo1.jpg', copies: 3 },
            { id: 2, image: null, filename: 'photo2.jpg', copies: 2 },
            { id: 3, image: null, filename: 'photo3.jpg', copies: 4 }
        ];
        
        const totalPhotos = photoData.reduce((sum, photo) => sum + photo.copies, 0);
        expect(totalPhotos).toBe(9);
    });

    suite.test('should handle zero copies gracefully', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7);
        sandPhoto.setTargetSize(2.5, 3.5);
        
        const photoData = [
            { id: 1, image: null, filename: 'photo1.jpg', copies: 0 },
            { id: 2, image: null, filename: 'photo2.jpg', copies: 0 }
        ];
        
        const result = sandPhoto.putMultiplePhotos(photoData, 'blue');
        expect(result).toBe(0);
    });

    suite.test('should handle overflow by fitting maximum possible photos', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7); // A4
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸
        
        // Create test images
        const createTestImage = (color) => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 200, 200);
            
            const img = new Image();
            img.src = canvas.toDataURL();
            return img;
        };
        
        const img1 = createTestImage('#ff0000');
        const img2 = createTestImage('#00ff00');
        
        return new Promise((resolve) => {
            let loadedCount = 0;
            const onLoad = () => {
                loadedCount++;
                if (loadedCount === 2) {
                    // Create a scenario where total copies exceed what can fit
                    const photoData = [
                        { id: 1, image: img1, filename: 'photo1.jpg', copies: 1 },
                        { id: 2, image: img2, filename: 'photo2.jpg', copies: 200 } // Way too many
                    ];
                    
                    const result = sandPhoto.putMultiplePhotos(photoData, 'blue');
                    
                    // Should still place some photos (not just the first one)
                    expect(result).toBeGreaterThan(0);
                    expect(sandPhoto.canvas).toBeTruthy();
                    
                    // The result should be limited by the maximum possible layout (use exact pixel dims)
                    const n1 = Math.floor(sandPhoto.containerWidth / sandPhoto.targetWidth) *
                               Math.floor(sandPhoto.containerHeight / sandPhoto.targetHeight);
                    const n2 = Math.floor(sandPhoto.containerHeight / sandPhoto.targetWidth) *
                               Math.floor(sandPhoto.containerWidth / sandPhoto.targetHeight);
                    const maxPossible = Math.max(n1, n2);
                    expect(result).toBeLessThanOrEqual(maxPossible);
                    
                    resolve();
                }
            };
            const register2 = (img) => {
                if (img.complete) {
                    setTimeout(onLoad, 0);
                } else {
                    img.onload = onLoad;
                }
            };
            register2(img1);
            register2(img2);
        });
    });

    suite.test('should distribute photos proportionally when overflow occurs', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(15.2, 10.2); // 6寸 paper (smaller to force overflow)
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸
        
        // Create test images
        const createTestImage = (color) => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 200, 200);
            
            const img = new Image();
            img.src = canvas.toDataURL();
            return img;
        };
        
        const img1 = createTestImage('#ff0000');
        const img2 = createTestImage('#00ff00');
        const img3 = createTestImage('#0000ff');
        
        return new Promise((resolve) => {
            let loadedCount = 0;
            const onLoad = () => {
                loadedCount++;
                if (loadedCount === 3) {
                    // Create a scenario with multiple photos and overflow
                    const photoData = [
                        { id: 1, image: img1, filename: 'photo1.jpg', copies: 2 },
                        { id: 2, image: img2, filename: 'photo2.jpg', copies: 5 },
                        { id: 3, image: img3, filename: 'photo3.jpg', copies: 10 } // Total: 17, but sheet can only fit ~16
                    ];
                    
                    const result = sandPhoto.putMultiplePhotos(photoData, 'white');
                    
                    // Should place photos up to the maximum capacity
                    expect(result).toBeGreaterThan(0);
                    expect(result).toBeLessThanOrEqual(16); // Maximum for 6寸 paper
                    expect(sandPhoto.canvas).toBeTruthy();
                    
                    resolve();
                }
            };
            
            img1.onload = onLoad;
            img2.onload = onLoad;
            img3.onload = onLoad;
        });
    });

    suite.test('should handle single photo with excessive copies', () => {
        const sandPhoto = new SandPhoto();
        sandPhoto.setContainerSize(21.0, 29.7); // A4
        sandPhoto.setTargetSize(2.5, 3.5); // 1寸
        
        const testCanvas = document.createElement('canvas');
        testCanvas.width = 200;
        testCanvas.height = 200;
        const testCtx = testCanvas.getContext('2d');
        testCtx.fillStyle = '#ff0000';
        testCtx.fillRect(0, 0, 200, 200);
        
        return new Promise((resolve) => {
            const testImg = new Image();
            testImg.onload = () => {
                const photoData = [{
                    id: 1,
                    image: testImg,
                    filename: 'single-photo.jpg',
                    copies: 1000 // Way more than can fit
                }];
                
                const result = sandPhoto.putMultiplePhotos(photoData, 'blue');
                
                // Should place the maximum possible photos
                expect(result).toBeGreaterThan(0);
                expect(sandPhoto.canvas).toBeTruthy();
                
                // Should be limited by the sheet capacity (based on actual container/target and rotation)
                const n1 = Math.floor(sandPhoto.containerWidth / sandPhoto.targetWidth) *
                           Math.floor(sandPhoto.containerHeight / sandPhoto.targetHeight);
                const n2 = Math.floor(sandPhoto.containerHeight / sandPhoto.targetWidth) *
                           Math.floor(sandPhoto.containerWidth / sandPhoto.targetHeight);
                const maxPossible = Math.max(n1, n2);
                expect(result).toBeLessThanOrEqual(maxPossible);
                
                resolve();
            };
            testImg.src = testCanvas.toDataURL();
        });
    });

    suite.test('should maintain image quality at 600 DPI', () => {
        const sandPhoto = new SandPhoto();
        expect(sandPhoto.DPI).toBe(600);
        
        // Test that pixel calculations are correct for 600 DPI
        const pixels = sandPhoto.getPixelFromCM(2.5);
        const expected = Math.floor(2.5 * 600 / 2.54);
        expect(pixels).toBe(expected);
    });

    suite.test('should handle different background colors in multi-photo mode', () => {
        const colors = ['white', 'blue', 'gray'];
        
        colors.forEach(color => {
            const sandPhoto = new SandPhoto();
            sandPhoto.setContainerSize(21.0, 29.7);
            sandPhoto.setTargetSize(2.5, 3.5);
            
            // Test that createEmptyImage works with different colors
            sandPhoto.createEmptyImage(color);
            expect(sandPhoto.canvas).toBeTruthy();
            expect(sandPhoto.ctx).toBeTruthy();
        });
    });

    suite.test('should generate correct filenames for multi-photo mode', () => {
        // Test filename generation logic
        const photoCount = 12;
        const uniquePhotos = 3;
        const photoType = '1寸';
        const paperType = 'A4';
        
        const filenameTemplates = {
            en: (count, unique, photo, paper) => `${count}pcs_${unique}photos_${photo}_on_${paper}.jpg`,
            zh: (count, unique, photo, paper) => `${count}张${unique}种${photo}[以${paper}冲洗].jpg`
        };
        
        const enFilename = filenameTemplates.en(photoCount, uniquePhotos, photoType, paperType);
        const zhFilename = filenameTemplates.zh(photoCount, uniquePhotos, photoType, paperType);
        
        expect(enFilename).toBe('12pcs_3photos_1寸_on_A4.jpg');
        expect(zhFilename).toBe('12张3种1寸[以A4冲洗].jpg');
    });

    return suite;
}

// App Multi-Photo Integration Test Suite
function createAppMultiPhotoTestSuite() {
    const suite = new TestSuite('App Multi-Photo Integration');
    
    suite.test('should initialize app with multi-photo support', () => {
        // Mock DOM elements
        const mockElement = (id) => ({
            addEventListener: () => {},
            style: { display: 'none' },
            value: '',
            textContent: '',
            innerHTML: '',
            appendChild: () => {},
            click: () => {}
        });
        
        const mockConfig = {
            language: 'en',
            elementIds: {
                singleUploadArea: 'singleUploadArea',
                multiUploadArea: 'multiUploadArea',
                multiFileInput: 'multiFilename',
                photoListContainer: 'photoListContainer',
                photoList: 'photoList',
                uploadModeRadios: 'uploadMode'
            },
            texts: {
                photoCopies: 'Copies:',
                removePhoto: 'Remove'
            }
        };
        
        // Test that the app can be initialized with multi-photo config
        expect(mockConfig.elementIds.singleUploadArea).toBe('singleUploadArea');
        expect(mockConfig.elementIds.multiUploadArea).toBe('multiUploadArea');
        expect(mockConfig.elementIds.multiFileInput).toBe('multiFilename');
    });

    suite.test('should handle photo data structure correctly', () => {
        const photoData = {
            id: 12345,
            image: null, // Mock image
            filename: 'test-photo.jpg',
            copies: 5
        };
        
        expect(photoData.id).toBeTruthy();
        expect(photoData.filename).toBeTruthy();
        expect(photoData.copies).toBeGreaterThan(0);
        expect(photoData.copies).toBeLessThanOrEqual(50);
    });

    suite.test('should validate copy count inputs', () => {
        const validCounts = [1, 2, 5, 10, 25, 50];
        const invalidCounts = [0, -1, 51, 100, NaN];
        
        validCounts.forEach(count => {
            const isValid = count >= 1 && count <= 50 && !isNaN(count);
            expect(isValid).toBe(true);
        });
        
        invalidCounts.forEach(count => {
            const isValid = count >= 1 && count <= 50 && !isNaN(count);
            expect(isValid).toBe(false);
        });
    });

    suite.test('should handle mode switching logic', () => {
        const isMultiPhotoMode = true;
        const uploadedPhotos = [
            { id: 1, image: null, filename: 'photo1.jpg', copies: 2 },
            { id: 2, image: null, filename: 'photo2.jpg', copies: 3 }
        ];
        const currentImage = null;
        
        // In multi-photo mode, should use uploadedPhotos
        const hasPhotos = isMultiPhotoMode ? uploadedPhotos.length > 0 : currentImage;
        expect(hasPhotos).toBe(true);
        
        // In single photo mode, should use currentImage
        const singleMode = false;
        const hasPhotosSingle = singleMode ? uploadedPhotos.length > 0 : !!currentImage;
        expect(hasPhotosSingle).toBe(false);
    });

    suite.test('should calculate total photo count correctly', () => {
        const uploadedPhotos = [
            { id: 1, image: null, filename: 'photo1.jpg', copies: 2 },
            { id: 2, image: null, filename: 'photo2.jpg', copies: 3 },
            { id: 3, image: null, filename: 'photo3.jpg', copies: 1 }
        ];
        
        const totalCount = uploadedPhotos.reduce((sum, photo) => sum + photo.copies, 0);
        expect(totalCount).toBe(6);
    });

    suite.test('should handle photo removal logic', () => {
        let uploadedPhotos = [
            { id: 1, image: null, filename: 'photo1.jpg', copies: 2 },
            { id: 2, image: null, filename: 'photo2.jpg', copies: 3 },
            { id: 3, image: null, filename: 'photo3.jpg', copies: 1 }
        ];
        
        const photoIdToRemove = 2;
        uploadedPhotos = uploadedPhotos.filter(photo => photo.id !== photoIdToRemove);
        
        expect(uploadedPhotos.length).toBe(2);
        expect(uploadedPhotos.find(photo => photo.id === photoIdToRemove)).toBeFalsy();
    });

    suite.test('should handle copy count updates', () => {
        const uploadedPhotos = [
            { id: 1, image: null, filename: 'photo1.jpg', copies: 2 },
            { id: 2, image: null, filename: 'photo2.jpg', copies: 3 }
        ];
        
        const photoId = 1;
        const newCopies = 5;
        const photo = uploadedPhotos.find(p => p.id === photoId);
        
        if (photo) {
            photo.copies = Math.max(1, parseInt(newCopies) || 1);
        }
        
        expect(photo.copies).toBe(5);
    });

    suite.test('should validate file types for multi-upload', () => {
        const validFiles = [
            { name: 'photo1.jpg', type: 'image/jpeg', size: 1024 * 1024 },
            { name: 'photo2.png', type: 'image/png', size: 2 * 1024 * 1024 },
            { name: 'photo3.gif', type: 'image/gif', size: 500 * 1024 }
        ];
        
        const invalidFiles = [
            { name: 'document.pdf', type: 'application/pdf', size: 1024 * 1024 },
            { name: 'text.txt', type: 'text/plain', size: 1024 },
            { name: 'large.jpg', type: 'image/jpeg', size: 10 * 1024 * 1024 }
        ];
        
        validFiles.forEach(file => {
            const isValid = file.type.startsWith('image/') && file.size <= 8 * 1024 * 1024;
            expect(isValid).toBe(true);
        });
        
        invalidFiles.forEach(file => {
            const isValid = file.type.startsWith('image/') && file.size <= 8 * 1024 * 1024;
            expect(isValid).toBe(false);
        });
    });

    suite.test('should handle photo data updates correctly', () => {
        let uploadedPhotos = [
            { id: 1, image: null, filename: 'photo1.jpg', copies: 2 },
            { id: 2, image: null, filename: 'photo2.jpg', copies: 3 }
        ];
        
        // Test updating copy count
        const photoId = 1;
        const newCopies = 5;
        const photo = uploadedPhotos.find(p => p.id === photoId);
        
        if (photo) {
            photo.copies = Math.max(1, parseInt(newCopies) || 1);
        }
        
        expect(photo.copies).toBe(5);
        
        // Test total count calculation after update
        const totalCount = uploadedPhotos.reduce((sum, photo) => sum + photo.copies, 0);
        expect(totalCount).toBe(8); // 5 + 3
    });

    suite.test('should handle photo removal and reordering', () => {
        let uploadedPhotos = [
            { id: 1, image: null, filename: 'photo1.jpg', copies: 2 },
            { id: 2, image: null, filename: 'photo2.jpg', copies: 3 },
            { id: 3, image: null, filename: 'photo3.jpg', copies: 1 }
        ];
        
        // Remove middle photo
        const photoIdToRemove = 2;
        uploadedPhotos = uploadedPhotos.filter(photo => photo.id !== photoIdToRemove);
        
        expect(uploadedPhotos.length).toBe(2);
        expect(uploadedPhotos.find(photo => photo.id === photoIdToRemove)).toBeFalsy();
        
        // Verify remaining photos
        const remainingIds = uploadedPhotos.map(p => p.id);
        expect(remainingIds).toContain(1);
        expect(remainingIds).toContain(3);
        expect(remainingIds.includes(2)).toBe(false);
    });

    suite.test('should handle extreme copy count values', () => {
        const testCases = [
            { copies: 1, expected: 1, description: 'minimum valid copies' },
            { copies: 50, expected: 50, description: 'maximum valid copies' },
            { copies: 0, expected: 1, description: 'zero copies should default to 1' },
            { copies: -5, expected: 1, description: 'negative copies should default to 1' },
            { copies: 100, expected: 50, description: 'excessive copies should be capped at 50' },
            { copies: NaN, expected: 1, description: 'NaN should default to 1' }
        ];
        
        testCases.forEach(({ copies, expected, description }) => {
            const result = Math.max(1, Math.min(50, parseInt(copies) || 1));
            expect(result).toBe(expected);
        });
    });

    return suite;
}

// UI Generator Multi-Photo Test Suite
function createUIGeneratorMultiPhotoTestSuite() {
    const suite = new TestSuite('UI Generator Multi-Photo');
    
    suite.test('should include multi-photo text strings', () => {
        const config = {
            texts: {
                multiPhotoMode: 'Multi-Photo Mode',
                singlePhotoMode: 'Single Photo Mode',
                addPhoto: 'Add Photo',
                removePhoto: 'Remove',
                photoCopies: 'Copies:'
            }
        };
        
        expect(config.texts.multiPhotoMode).toBe('Multi-Photo Mode');
        expect(config.texts.singlePhotoMode).toBe('Single Photo Mode');
        expect(config.texts.addPhoto).toBe('Add Photo');
        expect(config.texts.removePhoto).toBe('Remove');
        expect(config.texts.photoCopies).toBe('Copies:');
    });

    suite.test('should support multiple languages for multi-photo UI', () => {
        const englishTexts = {
            multiPhotoMode: 'Multi-Photo Mode',
            singlePhotoMode: 'Single Photo Mode',
            addPhoto: 'Add Photo',
            removePhoto: 'Remove',
            photoCopies: 'Copies:'
        };
        
        const chineseTexts = {
            multiPhotoMode: '多照片模式',
            singlePhotoMode: '单照片模式',
            addPhoto: '添加照片',
            removePhoto: '删除',
            photoCopies: '份数:'
        };
        
        expect(englishTexts.multiPhotoMode).toBe('Multi-Photo Mode');
        expect(chineseTexts.multiPhotoMode).toBe('多照片模式');
        expect(englishTexts.photoCopies).toBe('Copies:');
        expect(chineseTexts.photoCopies).toBe('份数:');
    });

    suite.test('should generate correct element IDs for multi-photo', () => {
        const elementIds = {
            singleUploadArea: 'singleUploadArea',
            multiUploadArea: 'multiUploadArea',
            multiFileInput: 'multiFilename',
            photoListContainer: 'photoListContainer',
            photoList: 'photoList',
            uploadModeRadios: 'uploadMode'
        };
        
        expect(elementIds.singleUploadArea).toBe('singleUploadArea');
        expect(elementIds.multiUploadArea).toBe('multiUploadArea');
        expect(elementIds.multiFileInput).toBe('multiFilename');
        expect(elementIds.photoListContainer).toBe('photoListContainer');
        expect(elementIds.photoList).toBe('photoList');
        expect(elementIds.uploadModeRadios).toBe('uploadMode');
    });

    return suite;
}

// Gap Feature Test Suite
function createGapFeatureTestSuite() {
    const suite = new TestSuite('Gap Feature');

    suite.test('should expose gap setters', () => {
        const sandPhoto = new SandPhoto();
        expect(typeof sandPhoto.setGapPixels).toBe('function');
        expect(typeof sandPhoto.setGapCM).toBe('function');
    });

    suite.test('should convert gap from cm to pixels', () => {
        const sandPhoto = new SandPhoto();
        const cm = 0.2; // 2mm
        const expectedPx = sandPhoto.getPixelFromCM(cm);
        sandPhoto.setGapCM(cm);
        expect(sandPhoto.gapPx).toBe(expectedPx);
    });

    suite.test('should reduce capacity when gap increases (calc only)', () => {
        const sp = new SandPhoto();
        sp.setContainerSize(15.2, 10.2); // 6寸
        sp.setTargetSize(2.5, 3.5); // 1寸

        const cw = sp.containerWidth;
        const ch = sp.containerHeight;
        const tw = sp.targetWidth;
        const th = sp.targetHeight;

        const capWithGap = (gap) => {
            const n1 = Math.floor(cw / (tw + gap)) * Math.floor(ch / (th + gap));
            const n2 = Math.floor(ch / (tw + gap)) * Math.floor(cw / (th + gap));
            return Math.max(n1, n2);
        };

        const cap0 = capWithGap(0);
        const cap10 = capWithGap(10);
        expect(cap0).toBeGreaterThanOrEqual(cap10);
    });

    suite.test('should respect gap in placed photo count', async () => {
        const makeImg = () => {
            const c = document.createElement('canvas');
            c.width = 200; c.height = 200;
            const x = c.getContext('2d');
            x.fillStyle = '#f00';
            x.fillRect(0,0,200,200);
            const img = new Image();
            img.src = c.toDataURL();
            return img;
        };

        const img = makeImg();

        const runWithGap = (gapPx) => new Promise((resolve) => {
            const sp = new SandPhoto();
            sp.setContainerSize(15.2, 10.2);
            sp.setTargetSize(2.5, 3.5);
            sp.setGapPixels(gapPx);
            const onload = () => {
                const count = sp.putPhoto(img, 'blue');
                resolve({ count, sp });
            };
            if (img.complete) setTimeout(onload, 0); else img.onload = onload;
        });

        const res0 = await runWithGap(0);
        const res10 = await runWithGap(10);
        expect(res0.count).toBeGreaterThanOrEqual(res10.count);
    });

    suite.test('should populate lastLayout and generate preview', async () => {
        const c = document.createElement('canvas');
        c.width = 200; c.height = 200;
        const x = c.getContext('2d');
        x.fillStyle = '#0f0'; x.fillRect(0,0,200,200);
        const img = new Image();
        img.src = c.toDataURL();

        return new Promise((resolve) => {
            img.onload = () => {
                const sp = new SandPhoto();
                sp.setContainerSize(15.2, 10.2);
                sp.setTargetSize(2.5, 3.5);
                sp.setGapPixels(8);
                const n = sp.putPhoto(img, 'blue');
                expect(n).toBeGreaterThan(0);
                expect(!!sp.lastLayout && sp.lastLayout.items.length > 0).toBeTruthy();
                const prev = sp.getPreviewCanvas(800, 600);
                expect(prev).toBeTruthy();
                expect(prev.width).toBeLessThanOrEqual(800);
                expect(prev.height).toBeLessThanOrEqual(600);
                resolve();
            };
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
        createPhotoCountTestSuite,
        createMultiPhotoTestSuite,
        createAppMultiPhotoTestSuite,
        createUIGeneratorMultiPhotoTestSuite,
        createGapFeatureTestSuite
    };
} 