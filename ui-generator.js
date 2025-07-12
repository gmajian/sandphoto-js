class UIGenerator {
    constructor(config = {}) {
        this.config = {
            language: 'en',
            previewType: 'img', // 'img' or 'canvas'
            texts: {
                // Photo size section
                photoSizeTitle: 'Photo Size',
                selectPhotoSize: 'Select Photo Size',
                customSize: 'Custom Size',
                customWidth: 'Custom Width (cm):',
                customHeight: 'Custom Height (cm):',
                
                // Paper size section
                paperSizeTitle: 'Paper Size',
                selectPaperSize: 'Select Paper Size',
                
                // Separator color section
                bgColorTitle: 'Separator Color',
                bgColorDescription: 'Choose the separator line color between photos',
                blue: 'Blue',
                white: 'White',
                gray: 'Gray',
                
                // Photo count section
                photoCountTitle: 'Photo Count',
                selectPhotoCount: 'Select Photo Count',
                auto: 'Auto (Maximum)',
                custom: 'Custom',
                customCount: 'Custom Photo Count:',
                
                // File upload section
                uploadTitle: 'Upload Photo',
                uploadDescription: 'Upload your photo to be arranged on the sheet',
                dragDropText: 'Drag and drop photo here or click to select file',
                selectFile: 'Select File',
                
                // Preview section
                previewTitle: 'Preview',
                photoCountText: 'Photo Count:',
                downloadText: 'Download',
                
                // Messages
                selectImageFile: 'Please select an image file.',
                fileSizeLimit: 'File size must be less than 8MB.',
                invalidCustomSize: 'Please enter valid custom dimensions (width and height must be greater than 0).',
                customSizeLimit: 'Custom dimensions cannot exceed 50cm. Please enter smaller values.',
                invalidPhotoCount: 'Please enter a valid photo count (must be greater than 0).',
                photoCountLimit: 'Custom photo count cannot exceed 100. Please enter a smaller value.',
                previewError: 'Error generating preview. Please try again.',
                generatePreviewFirst: 'Please generate a preview first.',
                selectValidSizes: 'Please select valid photo and paper sizes.',
                downloadError: 'Error downloading image. Please try again.',
                
                ...config.texts
            },
            ...config
        };
    }

    // Generate a complete form container
    generateFormContainer(containerId = 'sandphoto-form') {
        const container = document.createElement('div');
        container.id = containerId;
        container.className = 'sandphoto-form';
        
        // Generate all form sections
        container.appendChild(this.generatePhotoSizeSection());
        container.appendChild(this.generatePaperSizeSection());
        container.appendChild(this.generateBgColorSection());
        container.appendChild(this.generatePhotoCountSection());
        container.appendChild(this.generateUploadSection());
        container.appendChild(this.generatePreviewSection());
        container.appendChild(this.generateDownloadSection());
        
        return container;
    }

    // Generate photo size selection section
    generatePhotoSizeSection() {
        const section = document.createElement('div');
        section.className = 'form-step';
        
        const title = document.createElement('strong');
        title.textContent = this.config.texts.photoSizeTitle;
        
        const select = document.createElement('select');
        select.id = 'targetType';
        select.className = 'form-control';
        select.innerHTML = `<option value="">${this.config.texts.selectPhotoSize}</option>`;
        
        const customSection = this.generateCustomSizeSection();
        
        section.appendChild(title);
        section.appendChild(document.createTextNode(', '));
        section.appendChild(document.createTextNode(this.config.texts.selectPhotoSize));
        section.appendChild(document.createElement('br'));
        section.appendChild(select);
        section.appendChild(customSection);
        
        return section;
    }

    // Generate custom size inputs
    generateCustomSizeSection() {
        const section = document.createElement('div');
        section.id = 'customSizeSection';
        section.className = 'custom-size-section';
        section.style.display = 'none';
        
        const flexContainer = document.createElement('div');
        flexContainer.style.display = 'flex';
        flexContainer.style.gap = '10px';
        flexContainer.style.marginTop = '10px';
        
        const widthDiv = document.createElement('div');
        widthDiv.style.flex = '1';
        
        const widthLabel = document.createElement('label');
        widthLabel.htmlFor = 'customWidth';
        widthLabel.textContent = this.config.texts.customWidth;
        
        const widthInput = document.createElement('input');
        widthInput.type = 'number';
        widthInput.id = 'customWidth';
        widthInput.className = 'form-control';
        widthInput.min = '0.1';
        widthInput.max = '50';
        widthInput.step = '0.1';
        widthInput.placeholder = 'Width';
        
        const heightDiv = document.createElement('div');
        heightDiv.style.flex = '1';
        
        const heightLabel = document.createElement('label');
        heightLabel.htmlFor = 'customHeight';
        heightLabel.textContent = this.config.texts.customHeight;
        
        const heightInput = document.createElement('input');
        heightInput.type = 'number';
        heightInput.id = 'customHeight';
        heightInput.className = 'form-control';
        heightInput.min = '0.1';
        heightInput.max = '50';
        heightInput.step = '0.1';
        heightInput.placeholder = 'Height';
        
        widthDiv.appendChild(widthLabel);
        widthDiv.appendChild(widthInput);
        heightDiv.appendChild(heightLabel);
        heightDiv.appendChild(heightInput);
        
        flexContainer.appendChild(widthDiv);
        flexContainer.appendChild(heightDiv);
        section.appendChild(flexContainer);
        
        return section;
    }

    // Generate paper size selection section
    generatePaperSizeSection() {
        const section = document.createElement('div');
        section.className = 'form-step';
        
        const title = document.createElement('strong');
        title.textContent = this.config.texts.paperSizeTitle;
        
        const select = document.createElement('select');
        select.id = 'containerType';
        select.className = 'form-control';
        select.innerHTML = `<option value="">${this.config.texts.selectPaperSize}</option>`;
        
        section.appendChild(title);
        section.appendChild(document.createTextNode(', '));
        section.appendChild(document.createTextNode(this.config.texts.selectPaperSize));
        section.appendChild(document.createElement('br'));
        section.appendChild(select);
        
        return section;
    }

    // Generate background color selection section
    generateBgColorSection() {
        const section = document.createElement('div');
        section.className = 'form-step';
        
        const title = document.createElement('strong');
        title.textContent = this.config.texts.bgColorTitle;
        
        const select = document.createElement('select');
        select.id = 'bgColor';
        select.className = 'form-control';
        
        const colors = [
            { value: 'blue', text: this.config.texts.blue, selected: true },
            { value: 'white', text: this.config.texts.white, selected: false },
            { value: 'gray', text: this.config.texts.gray, selected: false }
        ];
        
        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color.value;
            option.textContent = color.text;
            if (color.selected) option.selected = true;
            select.appendChild(option);
        });
        
        section.appendChild(title);
        section.appendChild(document.createTextNode(', '));
        section.appendChild(document.createTextNode(this.config.texts.bgColorDescription));
        section.appendChild(document.createElement('br'));
        section.appendChild(select);
        
        return section;
    }

    // Generate photo count selection section
    generatePhotoCountSection() {
        const section = document.createElement('div');
        section.className = 'form-step';
        
        const title = document.createElement('strong');
        title.textContent = this.config.texts.photoCountTitle;
        
        const select = document.createElement('select');
        select.id = 'photoCountSelect';
        select.className = 'form-control';
        
        const options = [
            { value: 'auto', text: this.config.texts.auto, selected: true },
            { value: '1', text: '1' },
            { value: '2', text: '2' },
            { value: '4', text: '4' },
            { value: '6', text: '6' },
            { value: '8', text: '8' },
            { value: '12', text: '12' },
            { value: '16', text: '16' },
            { value: '20', text: '20' },
            { value: '24', text: '24' },
            { value: 'custom', text: this.config.texts.custom }
        ];
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            if (option.selected) optionElement.selected = true;
            select.appendChild(optionElement);
        });
        
        const customSection = this.generateCustomCountSection();
        
        section.appendChild(title);
        section.appendChild(document.createTextNode(', '));
        section.appendChild(document.createTextNode(this.config.texts.selectPhotoCount));
        section.appendChild(document.createElement('br'));
        section.appendChild(select);
        section.appendChild(customSection);
        
        return section;
    }

    // Generate custom count input
    generateCustomCountSection() {
        const section = document.createElement('div');
        section.id = 'photoCountSection';
        section.className = 'photo-count-section';
        section.style.display = 'none';
        
        const label = document.createElement('label');
        label.htmlFor = 'customPhotoCount';
        label.textContent = this.config.texts.customCount;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'customPhotoCount';
        input.className = 'form-control';
        input.min = '1';
        input.max = '100';
        input.step = '1';
        input.placeholder = 'e.g., 10';
        
        section.appendChild(label);
        section.appendChild(input);
        
        return section;
    }

    // Generate file upload section
    generateUploadSection() {
        const section = document.createElement('div');
        section.className = 'form-step';
        
        const title = document.createElement('strong');
        title.textContent = this.config.texts.uploadTitle;
        
        const uploadArea = document.createElement('div');
        uploadArea.id = 'uploadArea';
        uploadArea.className = 'upload-area';
        
        const icon = document.createElement('div');
        icon.style.fontSize = '2em';
        icon.style.marginBottom = '10px';
        icon.textContent = '📁';
        
        const text = document.createElement('p');
        text.textContent = this.config.texts.dragDropText;
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'filename';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        uploadArea.appendChild(icon);
        uploadArea.appendChild(text);
        uploadArea.appendChild(fileInput);
        
        section.appendChild(title);
        section.appendChild(document.createTextNode(', '));
        section.appendChild(document.createTextNode(this.config.texts.uploadDescription));
        section.appendChild(document.createElement('br'));
        section.appendChild(uploadArea);
        
        return section;
    }

    // Generate preview section
    generatePreviewSection() {
        const section = document.createElement('div');
        section.id = 'previewContainer';
        section.className = 'preview-container';
        section.style.display = 'none';
        
        const title = document.createElement('p');
        title.innerHTML = `<strong>${this.config.texts.previewTitle}</strong>`;
        
        let previewElement;
        if (this.config.previewType === 'canvas') {
            previewElement = document.createElement('canvas');
            previewElement.id = 'previewCanvas';
            previewElement.width = 800;
            previewElement.height = 600;
        } else {
            previewElement = document.createElement('img');
            previewElement.id = 'previewImg';
            previewElement.alt = 'Preview Image';
        }
        
        const countInfo = document.createElement('p');
        countInfo.id = 'photoCountInfo';
        countInfo.innerHTML = `${this.config.texts.photoCountText} <span id="count">0</span>`;
        
        section.appendChild(title);
        section.appendChild(previewElement);
        section.appendChild(countInfo);
        
        return section;
    }

    // Generate download section
    generateDownloadSection() {
        const section = document.createElement('div');
        section.className = 'form-step';
        
        const title = document.createElement('strong');
        title.textContent = this.config.texts.downloadTitle;
        
        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'downloadBtn';
        button.className = 'download-btn';
        button.disabled = true;
        button.textContent = this.config.texts.downloadButton;
        
        section.appendChild(title);
        section.appendChild(document.createTextNode(', '));
        section.appendChild(document.createTextNode(this.config.texts.downloadButton));
        section.appendChild(document.createElement('br'));
        section.appendChild(button);
        
        return section;
    }

    // Generate complete form with all necessary elements
    generateCompleteForm(containerId = 'sandphoto-form') {
        const form = document.createElement('form');
        form.id = 'sandphotoform';
        
        const container = this.generateFormContainer(containerId);
        form.appendChild(container);
        
        return form;
    }

    // Generate Chinese text configuration
    static getChineseConfig() {
        return {
            language: 'zh',
            texts: {
                photoSizeTitle: '第一步',
                selectPhotoSize: '选择照片尺寸',
                customSize: '自定义尺寸',
                customWidth: '自定义宽度 (cm):',
                customHeight: '自定义高度 (cm):',
                
                paperSizeTitle: '第二步',
                selectPaperSize: '选择纸张尺寸',
                
                bgColorTitle: '第三步',
                bgColorDescription: '选择照片之间的分割线颜色',
                blue: '蓝色',
                white: '白色',
                gray: '灰色',
                
                photoCountTitle: '第四步',
                selectPhotoCount: '选择照片数量',
                auto: '自动（最大数量）',
                custom: '自定义数量',
                customCount: '自定义照片数量:',
                
                uploadTitle: '第五步',
                uploadDescription: '选择你要处理的证件照片',
                dragDropText: '拖拽照片到这里或点击选择文件',
                selectFile: '选择文件',
                
                previewTitle: '将来的照片就是这个样子的：',
                photoCountText: '照片数量:',
                downloadTitle: '最后一步',
                downloadButton: '下载',
                
                // Messages
                selectImageFile: '请选择图片文件。',
                fileSizeLimit: '文件大小必须小于8MB。',
                invalidCustomSize: '请输入有效的自定义尺寸（宽度和高度必须大于0）。',
                customSizeLimit: '自定义尺寸不能超过50cm。请输入更小的值。',
                invalidPhotoCount: '请输入有效的照片数量（必须大于0）。',
                photoCountLimit: '自定义照片数量不能超过100。请输入更小的值。',
                previewError: '生成预览时出错。请重试。',
                generatePreviewFirst: '请先生成预览。',
                selectValidSizes: '请选择有效的照片和纸张尺寸。',
                downloadError: '下载图片时出错。请重试。'
            }
        };
    }

    // Generate English text configuration
    static getEnglishConfig() {
        return {
            language: 'en',
            texts: {
                photoSizeTitle: 'Step 1',
                selectPhotoSize: 'Select Photo Size',
                customSize: 'Custom Size',
                customWidth: 'Custom Width (cm):',
                customHeight: 'Custom Height (cm):',
                
                paperSizeTitle: 'Step 2',
                selectPaperSize: 'Select Paper Size',
                
                bgColorTitle: 'Step 3',
                bgColorDescription: 'Choose the separator line color between photos',
                blue: 'Blue',
                white: 'White',
                gray: 'Gray',
                
                photoCountTitle: 'Step 4',
                selectPhotoCount: 'Select Photo Count',
                auto: 'Auto (Maximum)',
                custom: 'Custom',
                customCount: 'Custom Photo Count:',
                
                uploadTitle: 'Step 5',
                uploadDescription: 'Select your ID photo to process',
                dragDropText: 'Drag and drop photo here or click to select file',
                selectFile: 'Select File',
                
                previewTitle: 'Preview:',
                photoCountText: 'Photo Count:',
                downloadTitle: 'Final Step',
                downloadButton: 'Download',
                
                // Messages
                selectImageFile: 'Please select an image file.',
                fileSizeLimit: 'File size must be less than 8MB.',
                invalidCustomSize: 'Please enter valid custom dimensions (width and height must be greater than 0).',
                customSizeLimit: 'Custom dimensions cannot exceed 50cm. Please enter smaller values.',
                invalidPhotoCount: 'Please enter a valid photo count (must be greater than 0).',
                photoCountLimit: 'Custom photo count cannot exceed 100. Please enter a smaller value.',
                previewError: 'Error generating preview. Please try again.',
                generatePreviewFirst: 'Please generate a preview first.',
                selectValidSizes: 'Please select valid photo and paper sizes.',
                downloadError: 'Error downloading image. Please try again.'
            }
        };
    }
} 