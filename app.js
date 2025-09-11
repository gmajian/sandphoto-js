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
                this.currentImage = img;
                this.updatePreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
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

    addPhotoToList(img, filename) {
        const photoData = {
            id: Date.now() + Math.random(), // Unique ID
            image: img,
            filename: filename,
            copies: 1
        };
        
        this.uploadedPhotos.push(photoData);
        this.updatePhotoList();
        this.updatePreview();
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
            photoItem.appendChild(copiesLabel);
            photoItem.appendChild(copiesInput);
            photoItem.appendChild(removeBtn);
            
            this.photoList.appendChild(photoItem);
        });
    }

    handleUploadModeChange(event) {
        const mode = event.target.value;
        this.isMultiPhotoMode = (mode === 'multi');
        
        if (this.isMultiPhotoMode) {
            if (this.singleUploadArea) this.singleUploadArea.style.display = 'none';
            if (this.multiUploadArea) this.multiUploadArea.style.display = 'block';
            if (this.photoListContainer) this.photoListContainer.style.display = 'block';
            if (this.photoCountSelect) this.photoCountSelect.style.display = 'none';
            if (this.customCountGroup) this.customCountGroup.style.display = 'none';
        } else {
            if (this.singleUploadArea) this.singleUploadArea.style.display = 'block';
            if (this.multiUploadArea) this.multiUploadArea.style.display = 'none';
            if (this.photoListContainer) this.photoListContainer.style.display = 'none';
            if (this.photoCountSelect) this.photoCountSelect.style.display = 'block';
            if (this.customCountGroup) this.customCountGroup.style.display = 'block';
            // Clear multi-photo data
            this.uploadedPhotos = [];
            this.currentImage = null;
        }
        
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

            let photoCount;

            if (this.isMultiPhotoMode) {
                // Multi-photo mode: process all uploaded photos
                photoCount = this.sandPhoto.putMultiplePhotos(this.uploadedPhotos, bgColor);
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
            filename = template(photoCount, uniquePhotos, targetType.name, containerType.name);
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