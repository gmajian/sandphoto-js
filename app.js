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
                customPhotoCountInput: 'customPhotoCount'
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
    }

    setupEventListeners() {
        // File upload events
        if (this.photoInput) {
            this.photoInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }
        
        // Drag and drop events
        if (this.uploadArea) {
            this.uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.uploadArea.classList.add('dragover');
            });

            this.uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                this.uploadArea.classList.remove('dragover');
            });

            this.uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFile(files[0]);
                }
            });

            this.uploadArea.addEventListener('click', () => {
                if (this.photoInput) {
                    this.photoInput.click();
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
        // Store the arrays for later use
        this.targetTypes = [...getPhotoTypesByCategory('id'), ...getPhotoTypesByCategory('document')];
        this.containerTypes = getPhotoTypesByCategory('paper');
        
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
        if (!this.currentImage) {
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
        const photoCountSetting = this.getSelectedPhotoCount();

        if (!targetType || !containerIndex || photoCountSetting === null) {
            if (this.previewSection) {
                this.previewSection.style.display = 'none';
            }
            if (this.downloadBtn) {
                this.downloadBtn.disabled = true;
            }
            return;
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

            // Generate the photo sheet with specified count
            let photoCount;
            if (photoCountSetting === 'auto') {
                photoCount = this.sandPhoto.putPhoto(this.currentImage, bgColor);
            } else {
                photoCount = this.sandPhoto.putPhotoWithCount(this.currentImage, bgColor, photoCountSetting);
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
        const filename = `${photoCount}张${targetType.name}[以${containerType.name}冲洗].jpg`;

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