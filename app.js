class SandPhotoApp {
    constructor() {
        this.currentImage = null;
        this.sandPhoto = null;
        this.initializeUI();
        this.setupEventListeners();
        this.populatePhotoTypes();
    }

    initializeUI() {
        this.uploadArea = document.getElementById('uploadArea');
        this.photoInput = document.getElementById('photoInput');
        this.targetTypeSelect = document.getElementById('targetType');
        this.containerTypeSelect = document.getElementById('containerType');
        this.bgColorSelect = document.getElementById('bgColor');
        this.previewSection = document.getElementById('previewSection');
        this.previewCanvas = document.getElementById('previewCanvas');
        this.photoCount = document.getElementById('count');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        // Custom size elements
        this.customSizeGroup = document.getElementById('customSizeGroup');
        this.customSizeGroup2 = document.getElementById('customSizeGroup2');
        this.customWidthInput = document.getElementById('customWidth');
        this.customHeightInput = document.getElementById('customHeight');
        
        // Photo count elements
        this.photoCountSelect = document.getElementById('photoCountSelect');
        this.customCountGroup = document.getElementById('customCountGroup');
        this.customPhotoCountInput = document.getElementById('customPhotoCount');
    }

    setupEventListeners() {
        // File upload events
        this.photoInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drag and drop events
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

        // Settings change events
        this.targetTypeSelect.addEventListener('change', () => this.handlePhotoSizeChange());
        this.containerTypeSelect.addEventListener('change', () => this.updatePreview());
        this.bgColorSelect.addEventListener('change', () => this.updatePreview());

        // Custom size input events
        this.customWidthInput.addEventListener('input', () => this.updatePreview());
        this.customHeightInput.addEventListener('input', () => this.updatePreview());

        // Photo count events
        this.photoCountSelect.addEventListener('change', () => this.handlePhotoCountChange());
        this.customPhotoCountInput.addEventListener('input', () => this.updatePreview());

        // Download button
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
    }

    handlePhotoSizeChange() {
        const selectedValue = this.targetTypeSelect.value;
        
        if (selectedValue === 'custom') {
            // Show custom size inputs with animation
            this.customSizeGroup.style.display = 'block';
            this.customSizeGroup2.style.display = 'block';
            
            // Add animation class after a brief delay
            setTimeout(() => {
                this.customSizeGroup.classList.add('show');
                this.customSizeGroup2.classList.add('show');
            }, 10);
            
            // Set default values for custom size
            if (!this.customWidthInput.value) {
                this.customWidthInput.value = '3.5';
            }
            if (!this.customHeightInput.value) {
                this.customHeightInput.value = '4.8';
            }
        } else {
            // Hide custom size inputs
            this.customSizeGroup.classList.remove('show');
            this.customSizeGroup2.classList.remove('show');
            
            setTimeout(() => {
                this.customSizeGroup.style.display = 'none';
                this.customSizeGroup2.style.display = 'none';
            }, 300);
        }
        
        this.updatePreview();
    }

    handlePhotoCountChange() {
        const selectedValue = this.photoCountSelect.value;
        
        if (selectedValue === 'custom') {
            // Show custom count input with animation
            this.customCountGroup.style.display = 'block';
            
            // Add animation class after a brief delay
            setTimeout(() => {
                this.customCountGroup.classList.add('show');
            }, 10);
            
            // Set default value for custom count
            if (!this.customPhotoCountInput.value) {
                this.customPhotoCountInput.value = '10';
            }
        } else {
            // Hide custom count input
            this.customCountGroup.classList.remove('show');
            
            setTimeout(() => {
                this.customCountGroup.style.display = 'none';
            }, 300);
        }
        
        this.updatePreview();
    }

    populatePhotoTypes() {
        // Store the arrays for later use
        this.targetTypes = [...getPhotoTypesByCategory('id'), ...getPhotoTypesByCategory('document')];
        this.containerTypes = getPhotoTypesByCategory('paper');
        
        // Populate target types (photo sizes)
        this.targetTypeSelect.innerHTML = '<option value="">Select Photo Size</option>';
        this.targetTypes.forEach((type, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${type.name} (${type.width}cm × ${type.height}cm)`;
            this.targetTypeSelect.appendChild(option);
        });

        // Add custom option
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = 'Custom Size';
        this.targetTypeSelect.appendChild(customOption);

        // Populate container types (paper sizes)
        this.containerTypeSelect.innerHTML = '<option value="">Select Paper Size</option>';
        this.containerTypes.forEach((type, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${type.name} (${type.width}cm × ${type.height}cm)`;
            this.containerTypeSelect.appendChild(option);
        });

        // Set default selections
        this.targetTypeSelect.value = '0'; // 1寸
        this.containerTypeSelect.value = '0'; // A4
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
            alert('Please select an image file.');
            return;
        }

        // Validate file size (8MB limit)
        if (file.size > 8 * 1024 * 1024) {
            alert('File size must be less than 8MB.');
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
                // Show error message for invalid custom size
                if (this.currentImage) {
                    alert('Please enter valid custom dimensions (width and height must be greater than 0).');
                }
                return null;
            }
            
            // Validate reasonable limits
            if (width > 50 || height > 50) {
                alert('Custom dimensions cannot exceed 50cm. Please enter smaller values.');
                return null;
            }
            
            return {
                name: `Custom (${width}cm × ${height}cm)`,
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
                // Show error message for invalid custom count
                if (this.currentImage) {
                    alert('Please enter a valid photo count (must be greater than 0).');
                }
                return null;
            }
            
            // Validate reasonable limits
            if (count > 100) {
                alert('Custom photo count cannot exceed 100. Please enter a smaller value.');
                return null;
            }
            
            return count;
        } else if (selectedValue === 'auto') {
            return 'auto';
        } else {
            return parseInt(selectedValue);
        }
    }

    updatePreview() {
        if (!this.currentImage) {
            this.previewSection.style.display = 'none';
            return;
        }

        const targetType = this.getSelectedPhotoSize();
        const containerIndex = this.containerTypeSelect.value;
        const bgColor = this.bgColorSelect.value;
        const photoCountSetting = this.getSelectedPhotoCount();

        if (!targetType || !containerIndex || photoCountSetting === null) {
            this.previewSection.style.display = 'none';
            return;
        }

        try {
            // Get container type from the correct array
            const containerType = this.containerTypes[parseInt(containerIndex)];

            if (!containerType) {
                console.error('Invalid container type selection');
                return;
            }

            // Debug information
            console.log('Selected target type:', targetType);
            console.log('Selected container type:', containerType);
            console.log('Selected photo count:', photoCountSetting);

            // Debug layout calculation
            if (photoCountSetting !== 'auto') {
                this.sandPhoto.debugLayout(photoCountSetting);
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

            // Update preview
            const previewCanvas = this.sandPhoto.getPreviewCanvas(800, 600);
            const previewCtx = this.previewCanvas.getContext('2d');
            
            // Clear and resize preview canvas
            this.previewCanvas.width = previewCanvas.width;
            this.previewCanvas.height = previewCanvas.height;
            
            // Draw preview
            previewCtx.drawImage(previewCanvas, 0, 0);

            // Update photo count display
            this.photoCount.textContent = photoCount;

            // Show preview section
            this.previewSection.style.display = 'block';

        } catch (error) {
            console.error('Error generating preview:', error);
            alert('Error generating preview. Please try again.');
        }
    }

    downloadImage() {
        if (!this.sandPhoto) {
            alert('Please generate a preview first.');
            return;
        }

        const targetType = this.getSelectedPhotoSize();
        const containerIndex = this.containerTypeSelect.value;
        const bgColor = this.bgColorSelect.value;
        const photoCountSetting = this.getSelectedPhotoCount();

        const containerType = this.containerTypes[parseInt(containerIndex)];

        if (!targetType || !containerType || photoCountSetting === null) {
            alert('Please select valid photo and paper sizes.');
            return;
        }

        // Generate filename with specified count
        let photoCount;
        if (photoCountSetting === 'auto') {
            photoCount = this.sandPhoto.putPhoto(this.currentImage, bgColor);
        } else {
            photoCount = this.sandPhoto.putPhotoWithCount(this.currentImage, bgColor, photoCountSetting);
        }
        
        const filename = `${photoCount}张${targetType.name}[以${containerType.name}冲洗].jpg`;

        try {
            this.sandPhoto.downloadImage(filename);
        } catch (error) {
            console.error('Error downloading image:', error);
            alert('Error downloading image. Please try again.');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SandPhotoApp();
}); 