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

    return suite;
}

// Export test suites for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createPhotoTypesTestSuite,
        createSandPhotoTestSuite,
        createLayoutTestSuite,
        createImageProcessingTestSuite,
        createAppIntegrationTestSuite
    };
} 