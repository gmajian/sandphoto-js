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
        this.targetTypeSelect.addEventListener('change', () => this.updatePreview());
        this.containerTypeSelect.addEventListener('change', () => this.updatePreview());
        this.bgColorSelect.addEventListener('change', () => this.updatePreview());

        // Download button
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
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

    updatePreview() {
        if (!this.currentImage) {
            this.previewSection.style.display = 'none';
            return;
        }

        const targetIndex = this.targetTypeSelect.value;
        const containerIndex = this.containerTypeSelect.value;
        const bgColor = this.bgColorSelect.value;

        if (!targetIndex || !containerIndex) {
            this.previewSection.style.display = 'none';
            return;
        }

        try {
            // Get photo types from the correct arrays
            const targetType = this.targetTypes[parseInt(targetIndex)];
            const containerType = this.containerTypes[parseInt(containerIndex)];

            if (!targetType || !containerType) {
                console.error('Invalid photo type selection');
                return;
            }

            // Debug information
            console.log('Selected target type:', targetType);
            console.log('Selected container type:', containerType);

            // Create SandPhoto instance
            this.sandPhoto = new SandPhoto();
            this.sandPhoto.setContainerSize(containerType.width, containerType.height);
            this.sandPhoto.setTargetSize(targetType.width, targetType.height);

            // Generate the photo sheet
            const photoCount = this.sandPhoto.putPhoto(this.currentImage, bgColor);

            // Update preview
            const previewCanvas = this.sandPhoto.getPreviewCanvas(800, 600);
            const previewCtx = this.previewCanvas.getContext('2d');
            
            // Clear and resize preview canvas
            this.previewCanvas.width = previewCanvas.width;
            this.previewCanvas.height = previewCanvas.height;
            
            // Draw preview
            previewCtx.drawImage(previewCanvas, 0, 0);

            // Update photo count
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

        const targetIndex = this.targetTypeSelect.value;
        const containerIndex = this.containerTypeSelect.value;
        const bgColor = this.bgColorSelect.value;

        const targetType = this.targetTypes[parseInt(targetIndex)];
        const containerType = this.containerTypes[parseInt(containerIndex)];

        if (!targetType || !containerType) {
            alert('Please select valid photo and paper sizes.');
            return;
        }

        // Generate filename
        const photoCount = this.sandPhoto.putPhoto(this.currentImage, bgColor);
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