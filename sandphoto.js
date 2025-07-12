class SandPhoto {
    constructor() {
        this.CM_PER_INCH = 2.54;
        this.DPI = 300;
        this.containerWidth = 0;
        this.containerHeight = 0;
        this.targetWidth = 0;
        this.targetHeight = 0;
        this.canvas = null;
        this.ctx = null;
    }

    // Convert centimeters to pixels
    getPixelFromCM(value) {
        return Math.floor(value * this.DPI / this.CM_PER_INCH);
    }

    // Set container (paper) size in centimeters
    setContainerSize(width, height) {
        this.containerWidth = this.getPixelFromCM(width);
        this.containerHeight = this.getPixelFromCM(height);
    }

    // Set target (photo) size in centimeters
    setTargetSize(width, height) {
        this.targetWidth = this.getPixelFromCM(width);
        this.targetHeight = this.getPixelFromCM(height);
    }

    // Create empty canvas with background color
    createEmptyImage(bgColorId) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.containerWidth;
        this.canvas.height = this.containerHeight;
        this.ctx = this.canvas.getContext('2d');

        // Set background color
        let bgColor;
        switch(bgColorId) {
            case "white":
                bgColor = "#FFFFFF";
                break;
            case "blue":
                bgColor = "#000078";
                break;
            case "gray":
                bgColor = "#808080";
                break;
            default:
                bgColor = "#000078";
        }

        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.containerWidth, this.containerHeight);

        // Add watermark
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "16px Arial";
        const watermark = "sandphoto-js";
        const textMetrics = this.ctx.measureText(watermark);
        this.ctx.fillText(watermark, 
            this.containerWidth - textMetrics.width - 10, 
            this.containerHeight - 10);
    }

    // Process and place photos on the canvas
    putPhoto(imageElement, bgColorId = "blue") {
        const img = imageElement;
        const w = img.naturalWidth;
        const h = img.naturalHeight;

        // Calculate crop dimensions to fit target size
        const ratio1 = w / this.targetWidth;
        const ratio2 = h / this.targetHeight;
        let cutW, cutH, cutX, cutY;

        if (ratio1 > ratio2) {
            cutW = this.targetWidth * ratio2;
            cutH = h;
            cutX = (w - cutW) / 2;
            cutY = 0;
        } else {
            cutH = this.targetHeight * ratio1;
            cutW = w;
            cutY = (h - cutH) / 2;
            cutX = 0;
        }

        const GAP = 5;

        // Calculate how many photos can fit
        let wn = Math.floor(this.containerWidth / (this.targetWidth + GAP));
        let hn = Math.floor(this.containerHeight / (this.targetHeight + GAP));

        // Try rotated layout
        let wn2 = Math.floor(this.containerHeight / (this.targetWidth + GAP));
        let hn2 = Math.floor(this.containerWidth / (this.targetHeight + GAP));

        let rotated = false;
        let finalContainerWidth = this.containerWidth;
        let finalContainerHeight = this.containerHeight;
        
        if (wn2 * hn2 > wn * hn) {
            // Use rotated layout
            rotated = true;
            wn = wn2;
            hn = hn2;
            // Swap container dimensions for rotated layout
            [finalContainerWidth, finalContainerHeight] = [this.containerHeight, this.containerWidth];
        }

        // Create canvas with proper dimensions
        this.containerWidth = finalContainerWidth;
        this.containerHeight = finalContainerHeight;
        this.createEmptyImage(bgColorId);

        // Calculate starting position to center the photos
        const totalWidth = wn * (this.targetWidth + GAP) - GAP;
        const totalHeight = hn * (this.targetHeight + GAP) - GAP;
        const wStart = (this.containerWidth - totalWidth) / 2;
        const hStart = (this.containerHeight - totalHeight) / 2;

        // Place photos on canvas
        for (let i = 0; i < wn; i++) {
            const posX = wStart + (this.targetWidth + GAP) * i;
            for (let j = 0; j < hn; j++) {
                const posY = hStart + (this.targetHeight + GAP) * j;
                
                this.ctx.drawImage(img, 
                    cutX, cutY, cutW, cutH,  // Source rectangle
                    posX, posY, this.targetWidth, this.targetHeight  // Destination rectangle
                );
            }
        }

        return wn * hn;
    }

    // Process and place photos on the canvas with specified count
    putPhotoWithCount(imageElement, bgColorId = "blue", targetCount) {
        const img = imageElement;
        const w = img.naturalWidth;
        const h = img.naturalHeight;

        // Calculate crop dimensions to fit target size
        const ratio1 = w / this.targetWidth;
        const ratio2 = h / this.targetHeight;
        let cutW, cutH, cutX, cutY;

        if (ratio1 > ratio2) {
            cutW = this.targetWidth * ratio2;
            cutH = h;
            cutX = (w - cutW) / 2;
            cutY = 0;
        } else {
            cutH = this.targetHeight * ratio1;
            cutW = w;
            cutY = (h - cutH) / 2;
            cutX = 0;
        }

        const GAP = 5;

        // Calculate optimal layout for the target count
        let bestLayout = this.calculateOptimalLayout(targetCount, GAP);
        
        if (!bestLayout) {
            // Fallback to maximum layout if target count is too high
            return this.putPhoto(imageElement, bgColorId);
        }

        // Create canvas with proper dimensions
        this.containerWidth = bestLayout.containerWidth;
        this.containerHeight = bestLayout.containerHeight;
        this.createEmptyImage(bgColorId);

        // Calculate starting position to center the photos
        const totalWidth = bestLayout.cols * (this.targetWidth + GAP) - GAP;
        const totalHeight = bestLayout.rows * (this.targetHeight + GAP) - GAP;
        const wStart = (this.containerWidth - totalWidth) / 2;
        const hStart = (this.containerHeight - totalHeight) / 2;

        // Place photos on canvas up to the target count
        let placedCount = 0;
        for (let i = 0; i < bestLayout.cols && placedCount < targetCount; i++) {
            const posX = wStart + (this.targetWidth + GAP) * i;
            for (let j = 0; j < bestLayout.rows && placedCount < targetCount; j++) {
                const posY = hStart + (this.targetHeight + GAP) * j;
                
                this.ctx.drawImage(img, 
                    cutX, cutY, cutW, cutH,  // Source rectangle
                    posX, posY, this.targetWidth, this.targetHeight  // Destination rectangle
                );
                placedCount++;
            }
        }

        return placedCount;
    }

    // Calculate optimal layout for target photo count
    calculateOptimalLayout(targetCount, gap) {
        const maxCols = Math.floor(this.containerWidth / (this.targetWidth + gap));
        const maxRows = Math.floor(this.containerHeight / (this.targetHeight + gap));
        const maxPhotos = maxCols * maxRows;

        // Try rotated layout
        const maxColsRotated = Math.floor(this.containerHeight / (this.targetWidth + gap));
        const maxRowsRotated = Math.floor(this.containerWidth / (this.targetHeight + gap));
        const maxPhotosRotated = maxColsRotated * maxRowsRotated;

        let bestLayout = null;
        let bestScore = Infinity;

        // Check normal orientation
        if (maxPhotos >= targetCount) {
            // Try different arrangements to find the most square-like layout
            for (let cols = 1; cols <= Math.min(maxCols, targetCount); cols++) {
                const rows = Math.ceil(targetCount / cols);
                if (rows <= maxRows) {
                    const score = Math.abs(cols - rows); // Prefer square-like arrangements
                    if (score < bestScore) {
                        bestScore = score;
                        bestLayout = {
                            cols: cols,
                            rows: rows,
                            containerWidth: this.containerWidth,
                            containerHeight: this.containerHeight
                        };
                    }
                }
            }
        }

        // Check rotated orientation
        if (maxPhotosRotated >= targetCount) {
            // Try different arrangements to find the most square-like layout
            for (let cols = 1; cols <= Math.min(maxColsRotated, targetCount); cols++) {
                const rows = Math.ceil(targetCount / cols);
                if (rows <= maxRowsRotated) {
                    const score = Math.abs(cols - rows); // Prefer square-like arrangements
                    if (score < bestScore) {
                        bestScore = score;
                        bestLayout = {
                            cols: cols,
                            rows: rows,
                            containerWidth: this.containerHeight,
                            containerHeight: this.containerWidth
                        };
                    }
                }
            }
        }

        return bestLayout;
    }

    // Get preview canvas (scaled down for display)
    getPreviewCanvas(maxWidth = 800, maxHeight = 600) {
        const previewCanvas = document.createElement('canvas');
        const previewCtx = previewCanvas.getContext('2d');

        // Calculate scale to fit within max dimensions
        const ratio1 = this.containerWidth / maxWidth;
        const ratio2 = this.containerHeight / maxHeight;
        const ratio = Math.max(ratio1, ratio2);
        
        const w = Math.floor(this.containerWidth / ratio);
        const h = Math.floor(this.containerHeight / ratio);

        previewCanvas.width = w;
        previewCanvas.height = h;

        // Draw scaled version
        previewCtx.drawImage(this.canvas, 0, 0, w, h);

        return previewCanvas;
    }

    // Download the generated image
    downloadImage(filename) {
        if (!this.canvas) {
            throw new Error("No image generated yet");
        }

        // Convert canvas to blob
        this.canvas.toBlob((blob) => {
            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/jpeg', 0.95);
    }

    // Get the main canvas for high-quality output
    getCanvas() {
        return this.canvas;
    }

    // Clean up resources
    destroy() {
        if (this.canvas) {
            this.canvas.width = 0;
            this.canvas.height = 0;
            this.canvas = null;
            this.ctx = null;
        }
    }

    // Debug method to log layout information
    debugLayout(targetCount, gap = 5) {
        const layout = this.calculateOptimalLayout(targetCount, gap);
        if (layout) {
            console.log(`Layout for ${targetCount} photos:`, {
                cols: layout.cols,
                rows: layout.rows,
                totalSlots: layout.cols * layout.rows,
                containerWidth: layout.containerWidth,
                containerHeight: layout.containerHeight
            });
        } else {
            console.log(`No layout found for ${targetCount} photos`);
        }
        return layout;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SandPhoto;
} 