class SandPhoto {
    constructor() {
        this.CM_PER_INCH = 2.54;
        this.DPI = 600;
        this.containerWidth = 0;
        this.containerHeight = 0;
        this.targetWidth = 0;
        this.targetHeight = 0;
        this.canvas = null;
        this.ctx = null;
        this.gapPx = 5; // default gap between photos in pixels
        this.lastLayout = null; // stores positions for preview rendering
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

    // Set gap between photos in pixels
    setGapPixels(pixels) {
        this.gapPx = Math.max(0, Math.floor(pixels));
    }

    // Set gap between photos in centimeters
    setGapCM(cm) {
        this.gapPx = Math.max(0, this.getPixelFromCM(cm));
    }

    // Create empty canvas with background color
    createEmptyImage(bgColorId) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.containerWidth;
        this.canvas.height = this.containerHeight;
        this.ctx = this.canvas.getContext('2d');

        // Always set background to white
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.containerWidth, this.containerHeight);

        // Add watermark
        // Determine language for watermark
        let lang = 'en';
        if (window && window.sandPhotoApp && window.sandPhotoApp.config && window.sandPhotoApp.config.language) {
            lang = window.sandPhotoApp.config.language.toLowerCase();
        } else if (typeof SandPhotoApp !== 'undefined' && SandPhotoApp.prototype && SandPhotoApp.prototype.config && SandPhotoApp.prototype.config.language) {
            lang = SandPhotoApp.prototype.config.language.toLowerCase();
        }
        let watermark = (lang === 'zh') ? 'www.sandcomp.com/blog/sandphoto' : 'www.sandcomp.com/blog/sandphoto-en';
        this.ctx.fillStyle = "#888888";
        this.ctx.font = "16px Arial";
        const textMetrics = this.ctx.measureText(watermark);
        this.ctx.fillText(watermark, 
            this.containerWidth - textMetrics.width - 10, 
            this.containerHeight - 10);
    }

    // Helper to get border color from separatorColorId
    getBorderColor(separatorColorId) {
        switch (separatorColorId) {
            case 'white': return '#FFFFFF';
            case 'gray': return '#808080';
            default: return '#000078'; // blue
        }
    }

    // Process and place photos on the canvas
    putPhoto(imageElement, separatorColorId = "blue") {
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

        const GAP = this.gapPx;

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
        this.createEmptyImage(separatorColorId);

        // Calculate starting position to center the photos
        const totalWidth = wn * (this.targetWidth + GAP) - GAP;
        const totalHeight = hn * (this.targetHeight + GAP) - GAP;
        const wStart = (this.containerWidth - totalWidth) / 2;
        const hStart = (this.containerHeight - totalHeight) / 2;

        // Determine border color
        let borderColor = this.getBorderColor(separatorColorId);

        // Prepare layout capture
        const items = [];

        // Place photos on canvas
        for (let i = 0; i < wn; i++) {
            const posX = wStart + (this.targetWidth + GAP) * i;
            for (let j = 0; j < hn; j++) {
                const posY = hStart + (this.targetHeight + GAP) * j;
                const dx = Math.round(posX);
                const dy = Math.round(posY);
                this.ctx.drawImage(img,
                    cutX, cutY, cutW, cutH,  // Source rectangle
                    dx, dy, this.targetWidth, this.targetHeight  // Destination rectangle
                );
                // Draw 1px border around each photo
                this.ctx.save();
                this.ctx.strokeStyle = borderColor;
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(dx + 0.5, dy + 0.5, this.targetWidth - 1, this.targetHeight - 1);
                this.ctx.restore();

                // Capture layout item
                items.push({
                    x: dx,
                    y: dy,
                    w: this.targetWidth,
                    h: this.targetHeight,
                    img: img,
                    crop: { sx: cutX, sy: cutY, sw: cutW, sh: cutH }
                });
            }
        }

        // Save layout for preview rendering
        this.lastLayout = {
            containerWidth: this.containerWidth,
            containerHeight: this.containerHeight,
            items: items,
            borderColor: borderColor
        };

        return wn * hn;
    }

    // Process and place multiple photos on the canvas
    putMultiplePhotos(photoDataArray, separatorColorId = "blue") {
        if (!photoDataArray || photoDataArray.length === 0) {
            return 0;
        }

        // Calculate total photos needed
        const totalPhotos = photoDataArray.reduce((sum, photo) => sum + photo.copies, 0);
        
        if (totalPhotos === 0) {
            return 0;
        }

        const GAP = this.gapPx;

        // Calculate optimal layout for total photos
        let bestLayout = this.calculateOptimalLayout(totalPhotos, GAP);
        
        if (!bestLayout) {
            // Fallback: calculate maximum possible photos and fit as many as possible
            const maxCols = Math.floor(this.containerWidth / (this.targetWidth + GAP));
            const maxRows = Math.floor(this.containerHeight / (this.targetHeight + GAP));
            const maxPhotos = maxCols * maxRows;
            
            // Try rotated layout
            const maxColsRotated = Math.floor(this.containerHeight / (this.targetWidth + GAP));
            const maxRowsRotated = Math.floor(this.containerWidth / (this.targetHeight + GAP));
            const maxPhotosRotated = maxColsRotated * maxRowsRotated;
            
            if (maxPhotosRotated > maxPhotos) {
                bestLayout = {
                    cols: maxColsRotated,
                    rows: maxRowsRotated,
                    containerWidth: this.containerHeight,
                    containerHeight: this.containerWidth
                };
            } else {
                bestLayout = {
                    cols: maxCols,
                    rows: maxRows,
                    containerWidth: this.containerWidth,
                    containerHeight: this.containerHeight
                };
            }
        }

        // Create canvas with proper dimensions
        this.containerWidth = bestLayout.containerWidth;
        this.containerHeight = bestLayout.containerHeight;
        this.createEmptyImage(separatorColorId);

        // Calculate starting position to center the photos
        const totalWidth = bestLayout.cols * (this.targetWidth + GAP) - GAP;
        const totalHeight = bestLayout.rows * (this.targetHeight + GAP) - GAP;
        const wStart = (this.containerWidth - totalWidth) / 2;
        const hStart = (this.containerHeight - totalHeight) / 2;

        // Determine border color
        let borderColor = this.getBorderColor(separatorColorId);

        // Prepare layout capture
        const items = [];

        // Place photos on canvas
        let placedCount = 0;
        let photoIndex = 0;
        let currentPhotoCopies = 0;
        const maxSlots = bestLayout.cols * bestLayout.rows;

        for (let i = 0; i < bestLayout.cols && placedCount < Math.min(totalPhotos, maxSlots); i++) {
            const posX = wStart + (this.targetWidth + GAP) * i;
            for (let j = 0; j < bestLayout.rows && placedCount < Math.min(totalPhotos, maxSlots); j++) {
                const posY = hStart + (this.targetHeight + GAP) * j;
                const dx = Math.round(posX);
                const dy = Math.round(posY);
                
                // Get current photo and its crop dimensions
                if (currentPhotoCopies <= 0 && photoIndex < photoDataArray.length) {
                    const photoData = photoDataArray[photoIndex];
                    const img = photoData.image;
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

                    // Store crop info for this photo
                    this.currentPhotoCrop = { cutX, cutY, cutW, cutH };
                    currentPhotoCopies = photoData.copies;
                    photoIndex++;
                }

                // Draw the current photo
                if (this.currentPhotoCrop) {
                    const img = photoDataArray[photoIndex - 1].image;
                    this.ctx.drawImage(img, 
                        this.currentPhotoCrop.cutX, this.currentPhotoCrop.cutY, 
                        this.currentPhotoCrop.cutW, this.currentPhotoCrop.cutH,  // Source rectangle
                        dx, dy, this.targetWidth, this.targetHeight  // Destination rectangle
                    );
                    
                    // Draw 1px border around each photo
                    this.ctx.save();
                    this.ctx.strokeStyle = borderColor;
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(dx + 0.5, dy + 0.5, this.targetWidth - 1, this.targetHeight - 1);
                    this.ctx.restore();

                    // Capture layout item
                    items.push({
                        x: dx,
                        y: dy,
                        w: this.targetWidth,
                        h: this.targetHeight,
                        img: img,
                        crop: {
                            sx: this.currentPhotoCrop.cutX,
                            sy: this.currentPhotoCrop.cutY,
                            sw: this.currentPhotoCrop.cutW,
                            sh: this.currentPhotoCrop.cutH
                        }
                    });
                }

                placedCount++;
                currentPhotoCopies--;
            }
        }

        // Save layout for preview rendering
        this.lastLayout = {
            containerWidth: this.containerWidth,
            containerHeight: this.containerHeight,
            items: items,
            borderColor: borderColor
        };

        return placedCount;
    }

    // Process and place photos on the canvas with specified count
    putPhotoWithCount(imageElement, separatorColorId = "blue", targetCount) {
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

        const GAP = this.gapPx;

        // Calculate optimal layout for the target count
        let bestLayout = this.calculateOptimalLayout(targetCount, GAP);
        
        if (!bestLayout) {
            // Fallback to maximum layout if target count is too high
            return this.putPhoto(imageElement, separatorColorId);
        }

        // Create canvas with proper dimensions
        this.containerWidth = bestLayout.containerWidth;
        this.containerHeight = bestLayout.containerHeight;
        this.createEmptyImage(separatorColorId);

        // Calculate starting position to center the photos
        const totalWidth = bestLayout.cols * (this.targetWidth + GAP) - GAP;
        const totalHeight = bestLayout.rows * (this.targetHeight + GAP) - GAP;
        const wStart = (this.containerWidth - totalWidth) / 2;
        const hStart = (this.containerHeight - totalHeight) / 2;

        // Determine border color
        let borderColor = this.getBorderColor(separatorColorId);

        // Prepare layout capture
        const items = [];

        // Place photos on canvas up to the target count
        let placedCount = 0;
        for (let i = 0; i < bestLayout.cols && placedCount < targetCount; i++) {
            const posX = wStart + (this.targetWidth + GAP) * i;
            for (let j = 0; j < bestLayout.rows && placedCount < targetCount; j++) {
                const posY = hStart + (this.targetHeight + GAP) * j;
                const dx = Math.round(posX);
                const dy = Math.round(posY);
                this.ctx.drawImage(img,
                    cutX, cutY, cutW, cutH,  // Source rectangle
                    dx, dy, this.targetWidth, this.targetHeight  // Destination rectangle
                );
                // Draw 1px border around each photo
                this.ctx.save();
                this.ctx.strokeStyle = borderColor;
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(dx + 0.5, dy + 0.5, this.targetWidth - 1, this.targetHeight - 1);
                this.ctx.restore();
                // Capture layout item
                items.push({
                    x: dx,
                    y: dy,
                    w: this.targetWidth,
                    h: this.targetHeight,
                    img: img,
                    crop: { sx: cutX, sy: cutY, sw: cutW, sh: cutH }
                });
                placedCount++;
            }
        }

        // Save layout for preview rendering
        this.lastLayout = {
            containerWidth: this.containerWidth,
            containerHeight: this.containerHeight,
            items: items,
            borderColor: borderColor
        };

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

        // If we have layout info, render preview from layout to preserve 1px lines
        if (this.lastLayout && this.lastLayout.items && this.lastLayout.items.length > 0) {
            const cw = this.lastLayout.containerWidth;
            const ch = this.lastLayout.containerHeight;
            const scale = Math.min(maxWidth / cw, maxHeight / ch, 1);
            const pw = Math.max(1, Math.floor(cw * scale));
            const ph = Math.max(1, Math.floor(ch * scale));
            previewCanvas.width = pw;
            previewCanvas.height = ph;

            // background
            previewCtx.fillStyle = '#FFFFFF';
            previewCtx.fillRect(0, 0, pw, ph);

            // draw items
            previewCtx.imageSmoothingEnabled = false;
            const borderColor = this.lastLayout.borderColor || '#000078';
            for (const it of this.lastLayout.items) {
                const dx = Math.round(it.x * scale);
                const dy = Math.round(it.y * scale);
                const dw = Math.max(1, Math.floor(it.w * scale));
                const dh = Math.max(1, Math.floor(it.h * scale));
                previewCtx.drawImage(
                    it.img,
                    it.crop.sx, it.crop.sy, it.crop.sw, it.crop.sh,
                    dx, dy, dw, dh
                );
                previewCtx.save();
                previewCtx.strokeStyle = borderColor;
                previewCtx.lineWidth = 1;
                previewCtx.strokeRect(dx + 0.5, dy + 0.5, dw - 1, dh - 1);
                previewCtx.restore();
            }

            return previewCanvas;
        }

        // Fallback: scale the full canvas
        // Calculate scale to fit within max dimensions
        const ratio1 = this.containerWidth / maxWidth;
        const ratio2 = this.containerHeight / maxHeight;
        const rawRatio = Math.max(ratio1, ratio2);
        let ratio = rawRatio >= 1 ? Math.ceil(rawRatio) : 1;
        const finalW = Math.max(1, Math.floor(this.containerWidth / ratio));
        const finalH = Math.max(1, Math.floor(this.containerHeight / ratio));
        previewCanvas.width = finalW;
        previewCanvas.height = finalH;
        previewCtx.imageSmoothingEnabled = false;
        previewCtx.drawImage(this.canvas, 0, 0, finalW, finalH);
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
        }, 'image/jpeg', 1.0);
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