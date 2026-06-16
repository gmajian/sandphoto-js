class SandPhotoApp {
    constructor(config = {}) {
        this.config = {
            language: 'en',
            elementIds: {
                uploadArea: 'uploadArea',
                photoInput: 'photoInput',
                targetTypeSelect: 'targetType',
                containerTypeSelect: 'containerType',
                bgColorSelect: 'bgColor',
                bgFillColorSelect: 'bgFillColor',
                previewSection: 'previewSection',
                previewCanvas: 'previewCanvas',
                photoCount: 'count',
                downloadBtn: 'downloadBtn',
                customSizeGroup: 'customSizeGroup',
                customSizeGroup2: 'customSizeGroup2',
                customWidthInput: 'customWidth',
                customHeightInput: 'customHeight',
                photoCountSelect: 'photoCountSelect',
                customCountGroup: 'customCountGroup',
                customPhotoCountInput: 'customPhotoCount',
                gapInputMm: 'gapMm',
                // Multi-photo elements
                singleUploadArea: 'singleUploadArea',
                multiUploadArea: 'multiUploadArea',
                multiFileInput: 'multiFilename',
                photoListContainer: 'photoListContainer',
                photoList: 'photoList',
                uploadModeRadios: 'uploadMode'
            },
            texts: {
                selectPhotoSize: 'Select Photo Size',
                selectPaperSize: 'Select Paper Size',
                customSize: 'Custom Size',
                selectPhotoCount: 'Select Photo Count',
                auto: 'Auto (Maximum)',
                custom: 'Custom',
                ...config.texts
            },
            ...config
        };
        
        this.currentImage = null;
        this.originalImage = null; // raw upload, before any background replacement
        this.bgCutout = null;      // cached cutout { src: Image, img: Image } for the current photo
        this._bgRemover = null;    // lazily-loaded in-browser background removal function
        this.sandPhoto = null;
        this.uploadedPhotos = []; // Array to store multiple photos with their copy counts
        this.isMultiPhotoMode = false;
        this.initializeUI();
        this.setupEventListeners();
        this.populatePhotoTypes();
    }

    initializeUI() {
        // Get elements by configured IDs
        this.uploadArea = document.getElementById(this.config.elementIds.uploadArea);
        this.photoInput = document.getElementById(this.config.elementIds.photoInput);
        this.targetTypeSelect = document.getElementById(this.config.elementIds.targetTypeSelect);
        this.containerTypeSelect = document.getElementById(this.config.elementIds.containerTypeSelect);
        this.bgColorSelect = document.getElementById(this.config.elementIds.bgColorSelect);
        // Fall back to the id UIGenerator always produces, so the single-photo
        // background control still works on pages whose config predates it.
        this.bgFillColorSelect = document.getElementById(this.config.elementIds.bgFillColorSelect || 'bgFillColor');
        this.previewSection = document.getElementById(this.config.elementIds.previewSection);
        this.previewCanvas = document.getElementById(this.config.elementIds.previewCanvas);
        this.photoCount = document.getElementById(this.config.elementIds.photoCount);
        this.downloadBtn = document.getElementById(this.config.elementIds.downloadBtn);
        
        // Custom size elements
        this.customSizeGroup = document.getElementById(this.config.elementIds.customSizeGroup);
        this.customSizeGroup2 = document.getElementById(this.config.elementIds.customSizeGroup2);
        this.customWidthInput = document.getElementById(this.config.elementIds.customWidthInput);
        this.customHeightInput = document.getElementById(this.config.elementIds.customHeightInput);
        
        // Photo count elements
        this.photoCountSelect = document.getElementById(this.config.elementIds.photoCountSelect);
        this.customCountGroup = document.getElementById(this.config.elementIds.customCountGroup);
        this.customPhotoCountInput = document.getElementById(this.config.elementIds.customPhotoCountInput);
        this.gapInputMm = document.getElementById(this.config.elementIds.gapInputMm);
        
        // Multi-photo elements
        this.singleUploadArea = document.getElementById(this.config.elementIds.singleUploadArea);
        this.multiUploadArea = document.getElementById(this.config.elementIds.multiUploadArea);
        this.multiFileInput = document.getElementById(this.config.elementIds.multiFileInput);
        this.photoListContainer = document.getElementById(this.config.elementIds.photoListContainer);
        this.photoList = document.getElementById(this.config.elementIds.photoList);
    }

    setupEventListeners() {
        // File upload events
        if (this.photoInput) {
            this.photoInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }
        
        // Multi-file upload events
        if (this.multiFileInput) {
            this.multiFileInput.addEventListener('change', (e) => this.handleMultiFileSelect(e));
        }
        
        // Upload mode toggle events
        const uploadModeRadios = document.querySelectorAll('input[name="uploadMode"]');
        uploadModeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.handleUploadModeChange(e));
        });
        
        // Drag and drop events for single upload
        if (this.singleUploadArea) {
            this.singleUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.singleUploadArea.classList.add('dragover');
            });

            this.singleUploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                this.singleUploadArea.classList.remove('dragover');
            });

            this.singleUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.singleUploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFile(files[0]);
                }
            });

            this.singleUploadArea.addEventListener('click', () => {
                if (this.photoInput) {
                    this.photoInput.click();
                }
            });
        }
        
        // Drag and drop events for multi upload
        if (this.multiUploadArea) {
            this.multiUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.multiUploadArea.classList.add('dragover');
            });

            this.multiUploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                this.multiUploadArea.classList.remove('dragover');
            });

            this.multiUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.multiUploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleMultiFiles(files);
                }
            });

            this.multiUploadArea.addEventListener('click', () => {
                if (this.multiFileInput) {
                    this.multiFileInput.click();
                }
            });
        }

        // Settings change events
        if (this.targetTypeSelect) {
            this.targetTypeSelect.addEventListener('change', () => this.handlePhotoSizeChange());
        }
        if (this.containerTypeSelect) {
            this.containerTypeSelect.addEventListener('change', () => this.updatePreview());
        }
        if (this.bgColorSelect) {
            this.bgColorSelect.addEventListener('change', () => this.updatePreview());
        }
        if (this.bgFillColorSelect) {
            this.bgFillColorSelect.addEventListener('change', () => this.applyBackgroundFill());
        }

        // Custom size input events
        if (this.customWidthInput) {
            this.customWidthInput.addEventListener('input', () => this.updatePreview());
        }
        if (this.customHeightInput) {
            this.customHeightInput.addEventListener('input', () => this.updatePreview());
        }

        // Photo count events
        if (this.photoCountSelect) {
            this.photoCountSelect.addEventListener('change', () => this.handlePhotoCountChange());
        }
        if (this.customPhotoCountInput) {
            this.customPhotoCountInput.addEventListener('input', () => this.updatePreview());
        }
        if (this.gapInputMm) {
            this.gapInputMm.addEventListener('input', () => this.updatePreview());
        }

        // Download button
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadImage());
        }
    }

    handlePhotoSizeChange() {
        const selectedValue = this.targetTypeSelect.value;
        
        if (selectedValue === 'custom') {
            // Show custom size inputs with animation
            if (this.customSizeGroup) {
                this.customSizeGroup.style.display = 'block';
                setTimeout(() => {
                    this.customSizeGroup.classList.add('show');
                }, 10);
            }
            if (this.customSizeGroup2) {
                this.customSizeGroup2.style.display = 'block';
                setTimeout(() => {
                    this.customSizeGroup2.classList.add('show');
                }, 10);
            }
            
            // Set default values for custom size
            if (this.customWidthInput && !this.customWidthInput.value) {
                this.customWidthInput.value = '3.5';
            }
            if (this.customHeightInput && !this.customHeightInput.value) {
                this.customHeightInput.value = '4.8';
            }
        } else {
            // Hide custom size inputs
            if (this.customSizeGroup) {
                this.customSizeGroup.classList.remove('show');
                setTimeout(() => {
                    this.customSizeGroup.style.display = 'none';
                }, 300);
            }
            if (this.customSizeGroup2) {
                this.customSizeGroup2.classList.remove('show');
                setTimeout(() => {
                    this.customSizeGroup2.style.display = 'none';
                }, 300);
            }
        }
        
        this.updatePreview();
    }

    handlePhotoCountChange() {
        const selectedValue = this.photoCountSelect.value;
        
        if (selectedValue === 'custom') {
            // Show custom count input with animation
            if (this.customCountGroup) {
                this.customCountGroup.style.display = 'block';
                setTimeout(() => {
                    this.customCountGroup.classList.add('show');
                }, 10);
            }
            
            // Set default value for custom count
            if (this.customPhotoCountInput && !this.customPhotoCountInput.value) {
                this.customPhotoCountInput.value = '10';
            }
        } else {
            // Hide custom count input
            if (this.customCountGroup) {
                this.customCountGroup.classList.remove('show');
                setTimeout(() => {
                    this.customCountGroup.style.display = 'none';
                }, 300);
            }
        }
        
        this.updatePreview();
    }

    populatePhotoTypes() {
        // Get the current language from config
        const currentLanguage = this.config.language || 'en';
        
        // Get localized photo types
        this.targetTypes = [
            ...getPhotoTypesByCategoryLocalized('id', currentLanguage), 
            ...getPhotoTypesByCategoryLocalized('document', currentLanguage)
        ];
        this.containerTypes = getPhotoTypesByCategoryLocalized('paper', currentLanguage);
        
        // Populate target types (photo sizes)
        if (this.targetTypeSelect) {
            this.targetTypeSelect.innerHTML = `<option value="">${this.config.texts.selectPhotoSize}</option>`;
            this.targetTypes.forEach((type, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${type.name} (${type.width}cm × ${type.height}cm)`;
                this.targetTypeSelect.appendChild(option);
            });

            // Add custom option
            const customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = this.config.texts.customSize;
            this.targetTypeSelect.appendChild(customOption);

            // Set default selection
            this.targetTypeSelect.value = '0'; // 1寸
        }

        // Populate container types (paper sizes)
        if (this.containerTypeSelect) {
            this.containerTypeSelect.innerHTML = `<option value="">${this.config.texts.selectPaperSize}</option>`;
            this.containerTypes.forEach((type, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${type.name} (${type.width}cm × ${type.height}cm)`;
                this.containerTypeSelect.appendChild(option);
            });

            // Set default selection
            this.containerTypeSelect.value = '0'; // A4
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert(this.config.texts.selectImageFile || 'Please select an image file.');
            return;
        }

        // Validate file size (8MB limit)
        if (file.size > 8 * 1024 * 1024) {
            alert(this.config.texts.fileSizeLimit || 'File size must be less than 8MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.bgCutout = null; // invalidate cutout cache for the new photo
                this.applyBackgroundFill();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Map a background-fill choice to a solid color (common ID-photo colors)
    getBgFillHex(value) {
        switch (value) {
            case 'white': return '#FFFFFF';
            case 'blue': return '#438EDB';
            case 'red': return '#D6453D';
            case 'gray': return '#C8C8C8';
            default: return '#FFFFFF';
        }
    }

    // Show/hide the background-removal status line
    setBgFillStatus(text) {
        const el = document.getElementById('bgFillStatus');
        if (!el) return;
        if (text) {
            el.textContent = text;
            el.style.display = 'block';
        } else {
            el.textContent = '';
            el.style.display = 'none';
        }
    }

    // Replace the single-photo background with the chosen solid color. The
    // cutout (alpha matte) is computed once per photo and cached, so switching
    // colors afterwards only re-composites and is instant. Runs entirely in the
    // browser; the photo never leaves the device.
    async applyBackgroundFill() {
        // Background replacement currently applies to single-photo mode only.
        if (this.isMultiPhotoMode || !this.originalImage) {
            return;
        }

        const fill = this.bgFillColorSelect ? this.bgFillColorSelect.value : 'keep';

        if (fill === 'keep') {
            this.currentImage = this.originalImage;
            this.setBgFillStatus('');
            this.updatePreview();
            return;
        }

        try {
            const cutout = await this.getCutout(this.originalImage);
            this.currentImage = await this.compositeOnColor(cutout, this.getBgFillHex(fill));
            this.updatePreview();
        } catch (err) {
            console.error('Background fill failed:', err);
            this.setBgFillStatus('');
            alert(this.config.texts.bgFillError || 'Background removal failed. Keeping the original photo.');
            if (this.bgFillColorSelect) this.bgFillColorSelect.value = 'keep';
            this.currentImage = this.originalImage;
            this.updatePreview();
        }
    }

    // Lazily load the in-browser background removal function from CDN. Only the
    // model is fetched remotely; photos are processed locally.
    async loadBgRemover() {
        if (!this._bgRemover) {
            // Pinned to a verified-working version so an upstream release can't
            // silently break this feature. Bump deliberately after testing.
            const mod = await import('https://esm.sh/@imgly/background-removal@1.7.0');
            this._bgRemover = mod.removeBackground;
        }
        return this._bgRemover;
    }

    // Serialize background-removal jobs: the model can't sensibly run two
    // inferences at once, and concurrent jobs make the progress lines fight
    // each other. Each call waits for the previous one to finish.
    runExclusive(task) {
        const prev = this._bgChain || Promise.resolve();
        const result = prev.then(() => task());
        // Keep the chain alive whether the task succeeds or fails.
        this._bgChain = result.then(() => {}, () => {});
        return result;
    }

    // Run the model on an image and return a foreground cutout Image (no cache).
    // onStatus receives a phase label (downloading vs processing); the library
    // reports per-file download progress, so a numeric percent is misleading.
    async computeCutout(img, onStatus) {
        const remover = await this.loadBgRemover();
        const downloadingText = this.config.texts.bgFillDownloading || 'Downloading model…';
        const processingText = this.config.texts.bgFillProcessing || 'Removing background…';
        const blob = await remover(img.src, {
            progress: (key) => {
                const downloading = /fetch|download/i.test(key || '');
                if (onStatus) onStatus(downloading ? downloadingText : processingText);
            }
        });
        return this.blobToImage(blob);
    }

    // Single-photo cutout with per-photo caching.
    async getCutout(img) {
        if (this.bgCutout && this.bgCutout.src === img) {
            return this.bgCutout.img;
        }
        this.setBgFillStatus(this.config.texts.bgFillProcessing || 'Removing background…');
        const cutoutImg = await this.runExclusive(
            () => this.computeCutout(img, (text) => this.setBgFillStatus(text))
        );
        this.bgCutout = { src: img, img: cutoutImg };
        this.setBgFillStatus('');
        return cutoutImg;
    }

    // Per-row status line for a multi-photo entry (id: bgStatus-<photoId>)
    setPhotoBgStatus(photoId, text) {
        const el = document.getElementById(`bgStatus-${photoId}`);
        if (!el) return;
        el.textContent = text || '';
        el.style.display = text ? 'inline' : 'none';
    }

    // Replace one multi-photo entry's background with the chosen solid color.
    // The cutout is cached on the photo, so changing colors later is instant.
    async updatePhotoBg(photoId, fillValue) {
        const photo = this.uploadedPhotos.find(p => p.id === photoId);
        if (!photo) return;
        photo.bgFill = fillValue;

        if (fillValue === 'keep') {
            photo.image = photo.originalImage;
            this.updatePhotoList();
            this.updatePreview();
            return;
        }

        try {
            if (!photo.cutout) {
                this.setPhotoBgStatus(photo.id, this.config.texts.bgFillProcessing || 'Removing background…');
                photo.cutout = await this.runExclusive(
                    () => this.computeCutout(photo.originalImage, (text) => this.setPhotoBgStatus(photo.id, text))
                );
                this.setPhotoBgStatus(photo.id, '');
            }
            photo.image = await this.compositeOnColor(photo.cutout, this.getBgFillHex(fillValue));
            this.updatePhotoList();
            this.updatePreview();
        } catch (err) {
            console.error('Background fill failed:', err);
            this.setPhotoBgStatus(photo.id, '');
            alert(this.config.texts.bgFillError || 'Background removal failed. Keeping the original photo.');
            photo.bgFill = 'keep';
            photo.image = photo.originalImage;
            this.updatePhotoList();
            this.updatePreview();
        }
    }

    // Composite a cutout over a solid background color, returning a new Image
    compositeOnColor(cutout, hex) {
        const canvas = document.createElement('canvas');
        canvas.width = cutout.naturalWidth;
        canvas.height = cutout.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = hex;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(cutout, 0, 0);
        return this.canvasToImage(canvas);
    }

    // Helpers: convert a Blob / canvas into a fully-loaded Image
    blobToImage(blob) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = URL.createObjectURL(blob);
        });
    }

    canvasToImage(canvas) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = canvas.toDataURL('image/png');
        });
    }

    handleMultiFileSelect(event) {
        const files = Array.from(event.target.files);
        this.handleMultiFiles(files);
    }

    handleMultiFiles(files) {
        // Filter valid image files
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                alert(`File ${file.name} is not an image file.`);
                return false;
            }
            if (file.size > 8 * 1024 * 1024) {
                alert(`File ${file.name} is too large (must be less than 8MB).`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Process each file
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.addPhotoToList(img, file.name);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Determine the default size for a newly added multi-photo. Uses the
    // globally selected photo size when it points to a predefined type,
    // otherwise falls back to the first available type.
    getDefaultPhotoSize() {
        if (this.targetTypeSelect) {
            const index = parseInt(this.targetTypeSelect.value);
            if (!isNaN(index) && this.targetTypes && this.targetTypes[index]) {
                return this.targetTypes[index];
            }
        }
        return (this.targetTypes && this.targetTypes[0]) || { name: '', width: 2.5, height: 3.5 };
    }

    addPhotoToList(img, filename) {
        const defaultSize = this.getDefaultPhotoSize();
        const photoData = {
            id: Date.now() + Math.random(), // Unique ID
            image: img,            // image used for layout (original or recolored)
            originalImage: img,    // raw upload, before background replacement
            filename: filename,
            copies: 1,
            // Per-photo size (cm) so different sizes can share one sheet
            sizeIndex: this.targetTypes ? this.targetTypes.indexOf(defaultSize) : 0,
            width: defaultSize.width,
            height: defaultSize.height,
            sizeName: defaultSize.name,
            // Per-photo background replacement
            bgFill: 'keep',
            cutout: null
        };

        this.uploadedPhotos.push(photoData);
        this.updatePhotoList();
        this.updatePreview();
    }

    // Update the size of a photo in the multi-photo list
    updatePhotoSize(photoId, sizeIndex) {
        const photo = this.uploadedPhotos.find(p => p.id === photoId);
        const size = this.targetTypes[parseInt(sizeIndex)];
        if (photo && size) {
            photo.sizeIndex = parseInt(sizeIndex);
            photo.width = size.width;
            photo.height = size.height;
            photo.sizeName = size.name;
            this.updatePreview();
        }
    }

    removePhotoFromList(photoId) {
        this.uploadedPhotos = this.uploadedPhotos.filter(photo => photo.id !== photoId);
        this.updatePhotoList();
        this.updatePreview();
    }

    updatePhotoCopies(photoId, copies) {
        const photo = this.uploadedPhotos.find(p => p.id === photoId);
        if (photo) {
            photo.copies = Math.max(1, parseInt(copies) || 1);
            this.updatePreview();
        }
    }

    updatePhotoList() {
        if (!this.photoList) return;

        this.photoList.innerHTML = '';
        
        this.uploadedPhotos.forEach(photo => {
            const photoItem = document.createElement('div');
            photoItem.style.display = 'flex';
            photoItem.style.alignItems = 'center';
            photoItem.style.marginBottom = '10px';
            photoItem.style.padding = '8px';
            photoItem.style.border = '1px solid #ddd';
            photoItem.style.borderRadius = '4px';
            photoItem.style.backgroundColor = '#f9f9f9';

            // Thumbnail
            const thumbnail = document.createElement('canvas');
            thumbnail.width = 60;
            thumbnail.height = 60;
            const ctx = thumbnail.getContext('2d');
            
            // Draw scaled image
            const scale = Math.min(60 / photo.image.width, 60 / photo.image.height);
            const scaledWidth = photo.image.width * scale;
            const scaledHeight = photo.image.height * scale;
            const offsetX = (60 - scaledWidth) / 2;
            const offsetY = (60 - scaledHeight) / 2;
            
            ctx.drawImage(photo.image, offsetX, offsetY, scaledWidth, scaledHeight);
            
            // Filename
            const filenameSpan = document.createElement('span');
            filenameSpan.textContent = photo.filename;
            filenameSpan.style.flex = '1';
            filenameSpan.style.marginLeft = '10px';
            filenameSpan.style.fontSize = '14px';
            filenameSpan.style.overflow = 'hidden';
            filenameSpan.style.textOverflow = 'ellipsis';
            filenameSpan.style.whiteSpace = 'nowrap';

            // Size selector (lets each photo use a different size on one sheet)
            const sizeLabel = document.createElement('label');
            sizeLabel.textContent = this.config.texts.photoSize || 'Size:';
            sizeLabel.style.marginRight = '5px';
            sizeLabel.style.fontSize = '14px';

            const sizeSelect = document.createElement('select');
            sizeSelect.style.marginRight = '10px';
            sizeSelect.style.fontSize = '13px';
            sizeSelect.style.maxWidth = '150px';
            (this.targetTypes || []).forEach((type, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${type.name} (${type.width}×${type.height})`;
                if (index === photo.sizeIndex) option.selected = true;
                sizeSelect.appendChild(option);
            });
            sizeSelect.addEventListener('change', (e) => {
                this.updatePhotoSize(photo.id, e.target.value);
            });

            // Background color selector (per-photo, replaces the photo background)
            const bgLabel = document.createElement('label');
            bgLabel.textContent = this.config.texts.bgFillTitle || 'Background:';
            bgLabel.style.marginRight = '5px';
            bgLabel.style.fontSize = '14px';

            const bgSelect = document.createElement('select');
            bgSelect.style.marginRight = '10px';
            bgSelect.style.fontSize = '13px';
            const bgOptions = [
                { value: 'keep', text: this.config.texts.bgFillKeep || 'Keep Original' },
                { value: 'white', text: this.config.texts.bgFillWhite || 'White' },
                { value: 'blue', text: this.config.texts.bgFillBlue || 'Blue' },
                { value: 'red', text: this.config.texts.bgFillRed || 'Red' },
                { value: 'gray', text: this.config.texts.bgFillGray || 'Gray' }
            ];
            bgOptions.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.text;
                if (opt.value === (photo.bgFill || 'keep')) option.selected = true;
                bgSelect.appendChild(option);
            });
            bgSelect.addEventListener('change', (e) => {
                this.updatePhotoBg(photo.id, e.target.value);
            });

            // Per-row background-removal status line
            const bgStatus = document.createElement('span');
            bgStatus.id = `bgStatus-${photo.id}`;
            bgStatus.style.fontSize = '12px';
            bgStatus.style.color = '#666';
            bgStatus.style.marginRight = '10px';
            bgStatus.style.display = 'none';

            // Copies input
            const copiesLabel = document.createElement('label');
            copiesLabel.textContent = this.config.texts.photoCopies || 'Copies:';
            copiesLabel.style.marginRight = '5px';
            copiesLabel.style.fontSize = '14px';

            const copiesInput = document.createElement('input');
            copiesInput.type = 'number';
            copiesInput.min = '1';
            copiesInput.max = '50';
            copiesInput.value = photo.copies;
            copiesInput.style.width = '60px';
            copiesInput.style.marginRight = '10px';
            copiesInput.addEventListener('change', (e) => {
                this.updatePhotoCopies(photo.id, e.target.value);
            });

            // Remove button
            const removeBtn = document.createElement('button');
            removeBtn.textContent = this.config.texts.removePhoto || 'Remove';
            removeBtn.type = 'button';
            removeBtn.style.backgroundColor = '#ff4444';
            removeBtn.style.color = 'white';
            removeBtn.style.border = 'none';
            removeBtn.style.padding = '5px 10px';
            removeBtn.style.borderRadius = '3px';
            removeBtn.style.cursor = 'pointer';
            removeBtn.addEventListener('click', () => {
                this.removePhotoFromList(photo.id);
            });

            photoItem.appendChild(thumbnail);
            photoItem.appendChild(filenameSpan);
            photoItem.appendChild(sizeLabel);
            photoItem.appendChild(sizeSelect);
            photoItem.appendChild(bgLabel);
            photoItem.appendChild(bgSelect);
            photoItem.appendChild(bgStatus);
            photoItem.appendChild(copiesLabel);
            photoItem.appendChild(copiesInput);
            photoItem.appendChild(removeBtn);
            
            this.photoList.appendChild(photoItem);
        });
    }

    handleUploadModeChange(event) {
        const mode = event.target.value;
        this.isMultiPhotoMode = (mode === 'multi');

        // The global background-fill control applies to single mode only; in
        // multi mode each photo row has its own, so hide just the sub-group
        // (not the whole color step, which also holds the separator color).
        const bgFillSection = document.getElementById('bgFillGroup');

        if (this.isMultiPhotoMode) {
            if (this.singleUploadArea) this.singleUploadArea.style.display = 'none';
            if (this.multiUploadArea) this.multiUploadArea.style.display = 'block';
            if (this.photoListContainer) this.photoListContainer.style.display = 'block';
            if (this.photoCountSelect) this.photoCountSelect.style.display = 'none';
            if (this.customCountGroup) this.customCountGroup.style.display = 'none';
            if (bgFillSection) bgFillSection.style.display = 'none';
            // Rebuild the list DOM from the preserved multi-photo data
            this.updatePhotoList();
        } else {
            if (this.singleUploadArea) this.singleUploadArea.style.display = 'block';
            if (this.multiUploadArea) this.multiUploadArea.style.display = 'none';
            if (this.photoListContainer) this.photoListContainer.style.display = 'none';
            if (this.photoCountSelect) this.photoCountSelect.style.display = 'block';
            if (this.customCountGroup) this.customCountGroup.style.display = 'block';
            if (bgFillSection) bgFillSection.style.display = 'block';
        }
        // Each mode keeps its own data (single: currentImage, multi:
        // uploadedPhotos), so switching modes preserves both.
        this.updatePreview();
    }

    getSelectedPhotoSize() {
        const selectedValue = this.targetTypeSelect.value;
        
        if (selectedValue === 'custom') {
            const width = parseFloat(this.customWidthInput.value);
            const height = parseFloat(this.customHeightInput.value);
            
            if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
                if (this.currentImage) {
                    alert(this.config.texts.invalidCustomSize || 'Please enter valid custom dimensions (width and height must be greater than 0).');
                }
                return null;
            }
            
            if (width > 50 || height > 50) {
                alert(this.config.texts.customSizeLimit || 'Custom dimensions cannot exceed 50cm. Please enter smaller values.');
                return null;
            }
            
            return {
                name: `${this.config.texts.custom} (${width}cm × ${height}cm)`,
                width: width,
                height: height,
                category: 'custom'
            };
        } else {
            return this.targetTypes[parseInt(selectedValue)];
        }
    }

    getSelectedPhotoCount() {
        const selectedValue = this.photoCountSelect.value;
        
        if (selectedValue === 'custom') {
            const count = parseInt(this.customPhotoCountInput.value);
            
            if (isNaN(count) || count <= 0) {
                if (this.currentImage) {
                    alert(this.config.texts.invalidPhotoCount || 'Please enter a valid photo count (must be greater than 0).');
                }
                return null;
            }
            
            if (count > 100) {
                alert(this.config.texts.photoCountLimit || 'Custom photo count cannot exceed 100. Please enter a smaller value.');
                return null;
            }
            
            return count;
        } else if (selectedValue === 'auto') {
            return 'auto';
        } else {
            return parseInt(selectedValue);
        }
    }

    getSelectedBgColor() {
        if (this.bgColorSelect) {
            return this.bgColorSelect.value;
        } else {
            // Fallback for radio buttons (if any)
            const selectedRadio = document.querySelector('input[name="bgcolorid"]:checked');
            return selectedRadio ? selectedRadio.value : 'blue';
        }
    }

    updatePreview() {
        // Check if we have photos to process
        const hasPhotos = this.isMultiPhotoMode ? this.uploadedPhotos.length > 0 : this.currentImage;
        
        if (!hasPhotos) {
            if (this.previewSection) {
                this.previewSection.style.display = 'none';
            }
            if (this.downloadBtn) {
                this.downloadBtn.disabled = true;
            }
            return;
        }

        const targetType = this.getSelectedPhotoSize();
        const containerIndex = this.containerTypeSelect.value;
        const bgColor = this.getSelectedBgColor();

        if (!targetType || !containerIndex) {
            if (this.previewSection) {
                this.previewSection.style.display = 'none';
            }
            if (this.downloadBtn) {
                this.downloadBtn.disabled = true;
            }
            return;
        }

        // For single photo mode, check photo count setting
        if (!this.isMultiPhotoMode) {
            const photoCountSetting = this.getSelectedPhotoCount();
            if (photoCountSetting === null) {
                if (this.previewSection) {
                    this.previewSection.style.display = 'none';
                }
                if (this.downloadBtn) {
                    this.downloadBtn.disabled = true;
                }
                return;
            }
        }

        try {
            // Get container type from the correct array
            const containerType = this.containerTypes[parseInt(containerIndex)];

            if (!containerType) {
                console.error('Invalid container type selection');
                return;
            }

            // Create SandPhoto instance
            this.sandPhoto = new SandPhoto();
            this.sandPhoto.setContainerSize(containerType.width, containerType.height);
            this.sandPhoto.setTargetSize(targetType.width, targetType.height);
            // Set gap from UI (mm to cm conversion)
            if (this.gapInputMm && this.gapInputMm.value !== '') {
                const gapMm = Math.max(0, parseFloat(this.gapInputMm.value) || 0);
                const gapCm = gapMm / 10;
                this.sandPhoto.setGapCM(gapCm);
            }

            let photoCount;

            if (this.isMultiPhotoMode) {
                // Multi-photo mode: each photo carries its own size, so pack
                // them together as a mixed-size layout on one sheet.
                photoCount = this.sandPhoto.putMixedPhotos(this.uploadedPhotos, bgColor);
            } else {
                // Single photo mode: use existing logic
                const photoCountSetting = this.getSelectedPhotoCount();
                if (photoCountSetting === 'auto') {
                    photoCount = this.sandPhoto.putPhoto(this.currentImage, bgColor);
                } else {
                    photoCount = this.sandPhoto.putPhotoWithCount(this.currentImage, bgColor, photoCountSetting);
                }
            }

            // Store the photo count for download
            this.currentPhotoCount = photoCount;

            // Update preview
            if (this.previewCanvas) {
                const previewCanvas = this.sandPhoto.getPreviewCanvas(800, 600);
                
                if (this.previewCanvas.tagName === 'CANVAS') {
                    // Handle canvas element
                    const previewCtx = this.previewCanvas.getContext('2d');
                    
                    // Clear and resize preview canvas
                    this.previewCanvas.width = previewCanvas.width;
                    this.previewCanvas.height = previewCanvas.height;
                    
                    // Draw preview
                    previewCtx.imageSmoothingEnabled = false;
                    previewCtx.drawImage(previewCanvas, 0, 0);
                } else {
                    // Handle img element
                    this.previewCanvas.src = previewCanvas.toDataURL();
                }
            }

            // Update photo count
            if (this.photoCount) {
                this.photoCount.textContent = photoCount;
            }

            // Show preview section
            if (this.previewSection) {
                this.previewSection.style.display = 'block';
            }
            if (this.downloadBtn) {
                this.downloadBtn.disabled = false;
            }

        } catch (error) {
            console.error('Error generating preview:', error);
            alert(this.config.texts.previewError || 'Error generating preview. Please try again.');
        }
    }

    downloadImage() {
        if (!this.sandPhoto) {
            alert(this.config.texts.generatePreviewFirst || 'Please generate a preview first.');
            return;
        }

        const targetType = this.getSelectedPhotoSize();
        const containerIndex = this.containerTypeSelect.value;
        const containerType = this.containerTypes[parseInt(containerIndex)];

        if (!targetType || !containerType) {
            alert(this.config.texts.selectValidSizes || 'Please select valid photo and paper sizes.');
            return;
        }

        // Use the stored photo count
        const photoCount = this.currentPhotoCount || 0;
        const lang = (this.config.language || 'en').toLowerCase();
        
        let filename;
        if (this.isMultiPhotoMode) {
            // Multi-photo mode: create filename based on number of different photos
            const uniquePhotos = this.uploadedPhotos.length;
            const distinctSizes = new Set(
                this.uploadedPhotos.map(p => p.sizeName || `${p.width}x${p.height}`)
            );

            if (distinctSizes.size > 1) {
                // Mixed sizes on one sheet: don't reference a single size name
                const mixedTemplates = {
                    en: (count, unique, paper) => `${count}pcs_${unique}photos_mixed_sizes_on_${paper}.jpg`,
                    zh: (count, unique, paper) => `${count}张${unique}种混排[以${paper}冲洗].jpg`,
                    es: (count, unique, paper) => `${count}uds_${unique}fotos_tamanos_mixtos_en_${paper}.jpg`,
                    fr: (count, unique, paper) => `${count}pcs_${unique}photos_tailles_mixtes_sur_${paper}.jpg`,
                    de: (count, unique, paper) => `${count}stk_${unique}fotos_gemischte_groessen_auf_${paper}.jpg`,
                    ja: (count, unique, paper) => `${count}枚_${unique}種類_混合サイズ_（${paper}）.jpg`,
                    ko: (count, unique, paper) => `${count}매_${unique}종류_혼합크기_(${paper}).jpg`,
                    ru: (count, unique, paper) => `${count}шт_${unique}фото_разные_размеры_на_${paper}.jpg`,
                    ar: (count, unique, paper) => `${count}قطع_${unique}صورة_احجام_مختلفة_على_${paper}.jpg`,
                    pt: (count, unique, paper) => `${count}un_${unique}fotos_tamanhos_mistos_em_${paper}.jpg`,
                };
                const template = mixedTemplates[lang] || mixedTemplates['en'];
                filename = template(photoCount, uniquePhotos, containerType.name);
            } else {
                // All photos share one size: use that size's actual name
                const sizeName = (this.uploadedPhotos[0] && this.uploadedPhotos[0].sizeName) || targetType.name;
                const filenameTemplates = {
                    en: (count, unique, photo, paper) => `${count}pcs_${unique}photos_${photo}_on_${paper}.jpg`,
                    zh: (count, unique, photo, paper) => `${count}张${unique}种${photo}[以${paper}冲洗].jpg`,
                    es: (count, unique, photo, paper) => `${count}uds_${unique}fotos_${photo}_en_${paper}.jpg`,
                    fr: (count, unique, photo, paper) => `${count}pcs_${unique}photos_${photo}_sur_${paper}.jpg`,
                    de: (count, unique, photo, paper) => `${count}stk_${unique}fotos_${photo}_auf_${paper}.jpg`,
                    ja: (count, unique, photo, paper) => `${count}枚_${unique}種類_${photo}_（${paper}）.jpg`,
                    ko: (count, unique, photo, paper) => `${count}매_${unique}종류_${photo}_(${paper}).jpg`,
                    ru: (count, unique, photo, paper) => `${count}шт_${unique}фото_${photo}_на_${paper}.jpg`,
                    ar: (count, unique, photo, paper) => `${count}قطع_${unique}صورة_${photo}_على_${paper}.jpg`,
                    pt: (count, unique, photo, paper) => `${count}un_${unique}fotos_${photo}_em_${paper}.jpg`,
                };
                const template = filenameTemplates[lang] || filenameTemplates['en'];
                filename = template(photoCount, uniquePhotos, sizeName, containerType.name);
            }
        } else {
            // Single photo mode: use existing filename logic
            const filenameTemplates = {
                en: (count, photo, paper) => `${count}pcs_${photo}_on_${paper}.jpg`,
                zh: (count, photo, paper) => `${count}张${photo}[以${paper}冲洗].jpg`,
                es: (count, photo, paper) => `${count}uds_${photo}_en_${paper}.jpg`,
                fr: (count, photo, paper) => `${count}pcs_${photo}_sur_${paper}.jpg`,
                de: (count, photo, paper) => `${count}stk_${photo}_auf_${paper}.jpg`,
                ja: (count, photo, paper) => `${count}枚_${photo}_（${paper}）.jpg`,
                ko: (count, photo, paper) => `${count}매_${photo}_(${paper}).jpg`,
                ru: (count, photo, paper) => `${count}шт_${photo}_на_${paper}.jpg`,
                ar: (count, photo, paper) => `${count}قطع_${photo}_على_${paper}.jpg`,
                pt: (count, photo, paper) => `${count}un_${photo}_em_${paper}.jpg`,
            };
            const template = filenameTemplates[lang] || filenameTemplates['en'];
            filename = template(photoCount, targetType.name, containerType.name);
        }

        try {
            this.sandPhoto.downloadImage(filename);
        } catch (error) {
            console.error('Error downloading image:', error);
            alert(this.config.texts.downloadError || 'Error downloading image. Please try again.');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SandPhotoApp();
}); 