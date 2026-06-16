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
                uploadTitle: 'Upload Photo(s)',
                uploadDescription: 'Upload your photos to be arranged on the sheet',
                dragDropText: 'Drag and drop photos here or click to select files',
                selectFile: 'Select Files',
                multiPhotoMode: 'Multi-Photo Mode',
                singlePhotoMode: 'Single Photo Mode',
                addPhoto: 'Add Photo',
                removePhoto: 'Remove',
                photoCopies: 'Copies:',
                photoSize: 'Size:',

                // Preview section
                previewTitle: 'Preview',
                photoCountText: 'Photo Count:',
                downloadText: 'Download',
                
                // Gap section
                gapTitle: 'Gap Between Photos',
                gapLabel: 'Gap (mm):',
                gapDescription: 'Set space between photos for easier cutting',
                
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
        container.appendChild(this.generateGapSection());
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

    // Generate gap (spacing) section
    generateGapSection() {
        const section = document.createElement('div');
        section.className = 'form-step';
        
        const title = document.createElement('strong');
        title.textContent = (this.config.texts.gapTitle || 'Gap Between Photos');
        
        const wrapper = document.createElement('div');
        wrapper.style.marginTop = '8px';
        
        const label = document.createElement('label');
        label.htmlFor = 'gapMm';
        label.textContent = (this.config.texts.gapLabel || 'Gap (mm):');
        label.style.marginRight = '8px';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'gapMm';
        input.className = 'form-control';
        input.min = '0';
        input.max = '50';
        input.step = '1';
        input.placeholder = 'e.g., 5';
        input.style.width = '120px';
        input.value = '5';
        
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        
        section.appendChild(title);
        section.appendChild(document.createTextNode(', '));
        section.appendChild(document.createTextNode(this.config.texts.gapDescription || 'Set space between photos for easier cutting'));
        section.appendChild(document.createElement('br'));
        section.appendChild(wrapper);
        
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
        
        // Mode toggle
        const modeToggle = document.createElement('div');
        modeToggle.style.marginBottom = '15px';
        
        const singleModeLabel = document.createElement('label');
        singleModeLabel.style.marginRight = '15px';
        singleModeLabel.style.cursor = 'pointer';
        
        const singleModeRadio = document.createElement('input');
        singleModeRadio.type = 'radio';
        singleModeRadio.name = 'uploadMode';
        singleModeRadio.value = 'single';
        singleModeRadio.checked = true;
        singleModeRadio.style.marginRight = '5px';
        
        singleModeLabel.appendChild(singleModeRadio);
        singleModeLabel.appendChild(document.createTextNode(this.config.texts.singlePhotoMode));
        
        const multiModeLabel = document.createElement('label');
        multiModeLabel.style.cursor = 'pointer';
        
        const multiModeRadio = document.createElement('input');
        multiModeRadio.type = 'radio';
        multiModeRadio.name = 'uploadMode';
        multiModeRadio.value = 'multi';
        multiModeRadio.style.marginRight = '5px';
        
        multiModeLabel.appendChild(multiModeRadio);
        multiModeLabel.appendChild(document.createTextNode(this.config.texts.multiPhotoMode));
        
        modeToggle.appendChild(singleModeLabel);
        modeToggle.appendChild(multiModeLabel);
        
        // Single photo upload area
        const singleUploadArea = document.createElement('div');
        singleUploadArea.id = 'singleUploadArea';
        singleUploadArea.className = 'upload-area';
        
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
        
        singleUploadArea.appendChild(icon);
        singleUploadArea.appendChild(text);
        singleUploadArea.appendChild(fileInput);
        
        // Multi-photo upload area
        const multiUploadArea = document.createElement('div');
        multiUploadArea.id = 'multiUploadArea';
        multiUploadArea.className = 'upload-area';
        multiUploadArea.style.display = 'none';
        
        const multiIcon = document.createElement('div');
        multiIcon.style.fontSize = '2em';
        multiIcon.style.marginBottom = '10px';
        multiIcon.textContent = '📁';
        
        const multiText = document.createElement('p');
        multiText.textContent = this.config.texts.dragDropText;
        
        const multiFileInput = document.createElement('input');
        multiFileInput.type = 'file';
        multiFileInput.id = 'multiFilename';
        multiFileInput.accept = 'image/*';
        multiFileInput.multiple = true;
        multiFileInput.style.display = 'none';
        
        multiUploadArea.appendChild(multiIcon);
        multiUploadArea.appendChild(multiText);
        multiUploadArea.appendChild(multiFileInput);
        
        // Photo list container
        const photoListContainer = document.createElement('div');
        photoListContainer.id = 'photoListContainer';
        photoListContainer.style.display = 'none';
        photoListContainer.style.marginTop = '15px';
        
        const photoListTitle = document.createElement('h4');
        photoListTitle.textContent = 'Uploaded Photos:';
        photoListTitle.style.marginBottom = '10px';
        
        const photoList = document.createElement('div');
        photoList.id = 'photoList';
        photoList.style.maxHeight = '200px';
        photoList.style.overflowY = 'auto';
        photoList.style.border = '1px solid #ddd';
        photoList.style.padding = '10px';
        photoList.style.borderRadius = '4px';
        
        photoListContainer.appendChild(photoListTitle);
        photoListContainer.appendChild(photoList);
        
        section.appendChild(title);
        section.appendChild(document.createTextNode(', '));
        section.appendChild(document.createTextNode(this.config.texts.uploadDescription));
        section.appendChild(document.createElement('br'));
        section.appendChild(modeToggle);
        section.appendChild(singleUploadArea);
        section.appendChild(multiUploadArea);
        section.appendChild(photoListContainer);
        
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

    // Centralized language configurations
    static getLanguageConfig(languageCode) {
        const configs = {
            'en': UIGenerator.getEnglishConfig(),
            'zh': UIGenerator.getChineseConfig(),
            'es': UIGenerator.getSpanishConfig(),
            'fr': UIGenerator.getFrenchConfig(),
            'de': UIGenerator.getGermanConfig(),
            'ja': UIGenerator.getJapaneseConfig(),
            'ko': UIGenerator.getKoreanConfig(),
            'ru': UIGenerator.getRussianConfig(),
            'ar': UIGenerator.getArabicConfig(),
            'pt': UIGenerator.getPortugueseConfig()
        };
        
        return configs[languageCode] || configs['en']; // Default to English
    }

    // Get available languages
    static getAvailableLanguages() {
        return [
            { code: 'en', name: 'English', nativeName: 'English' },
            { code: 'zh', name: 'Chinese', nativeName: '中文' },
            { code: 'es', name: 'Spanish', nativeName: 'Español' },
            { code: 'fr', name: 'French', nativeName: 'Français' },
            { code: 'de', name: 'German', nativeName: 'Deutsch' },
            { code: 'ja', name: 'Japanese', nativeName: '日本語' },
            { code: 'ko', name: 'Korean', nativeName: '한국어' },
            { code: 'ru', name: 'Russian', nativeName: 'Русский' },
            { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
            { code: 'pt', name: 'Portuguese', nativeName: 'Português' }
        ];
    }

    // Detect user's preferred language
    static detectUserLanguage() {
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        // Check if we support this language
        const availableLanguages = UIGenerator.getAvailableLanguages();
        const supportedLang = availableLanguages.find(lang => lang.code === langCode);
        
        return supportedLang ? langCode : 'en';
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
                
                // Gap section
                gapTitle: '第四步',
                gapLabel: '间距 (毫米):',
                gapDescription: '设置照片之间的间距，方便裁剪',
                
                photoCountTitle: '第五步',
                selectPhotoCount: '选择照片数量',
                auto: '自动（最大数量）',
                custom: '自定义数量',
                customCount: '自定义照片数量:',
                
                uploadTitle: '第六步',
                uploadDescription: '选择你要处理的证件照片',
                dragDropText: '拖拽照片到这里或点击选择文件',
                selectFile: '选择文件',
                multiPhotoMode: '多照片/混合尺寸模式',
                singlePhotoMode: '单照片模式',
                addPhoto: '添加照片',
                removePhoto: '删除',
                photoCopies: '份数:',
                photoSize: '尺寸:',
                
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
                
                // Gap section
                gapTitle: 'Step 4',
                gapLabel: 'Gap (mm):',
                gapDescription: 'Set space between photos for easier cutting',
                
                photoCountTitle: 'Step 5',
                selectPhotoCount: 'Select Photo Count',
                auto: 'Auto (Maximum)',
                custom: 'Custom',
                customCount: 'Custom Photo Count:',
                
                uploadTitle: 'Step 6',
                uploadDescription: 'Select your ID photo(s) to process',
                dragDropText: 'Drag and drop photo(s) here or click to select file(s)',
                selectFile: 'Select File(s)',
                multiPhotoMode: 'Multi-Photo / Mixed Sizes',
                singlePhotoMode: 'Single Photo Mode',
                addPhoto: 'Add Photo',
                removePhoto: 'Remove',
                photoCopies: 'Copies:',
                photoSize: 'Size:',

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

    // Generate Spanish text configuration
    static getSpanishConfig() {
        return {
            language: 'es',
            texts: {
                photoSizeTitle: 'Paso 1',
                selectPhotoSize: 'Seleccionar Tamaño de Foto',
                customSize: 'Tamaño Personalizado',
                customWidth: 'Ancho Personalizado (cm):',
                customHeight: 'Alto Personalizado (cm):',
                
                paperSizeTitle: 'Paso 2',
                selectPaperSize: 'Seleccionar Tamaño de Papel',
                
                bgColorTitle: 'Paso 3',
                bgColorDescription: 'Elegir el color de la línea separadora entre fotos',
                blue: 'Azul',
                white: 'Blanco',
                gray: 'Gris',
                
                // Gap section
                gapTitle: 'Paso 4',
                gapLabel: 'Espacio (mm):',
                gapDescription: 'Ajusta el espacio entre fotos para facilitar el corte',
                
                photoCountTitle: 'Paso 5',
                selectPhotoCount: 'Seleccionar Cantidad de Fotos',
                auto: 'Automático (Máximo)',
                custom: 'Personalizado',
                customCount: 'Cantidad Personalizada de Fotos:',
                
                uploadTitle: 'Paso 6',
                uploadDescription: 'Selecciona tu foto de identificación para procesar',
                dragDropText: 'Arrastra y suelta la foto aquí o haz clic para seleccionar archivo',
                selectFile: 'Seleccionar Archivo',
                
                previewTitle: 'Vista Previa:',
                photoCountText: 'Cantidad de Fotos:',
                downloadTitle: 'Paso Final',
                downloadButton: 'Descargar',
                
                // Messages
                selectImageFile: 'Por favor selecciona un archivo de imagen.',
                fileSizeLimit: 'El tamaño del archivo debe ser menor a 8MB.',
                invalidCustomSize: 'Por favor ingresa dimensiones personalizadas válidas (ancho y alto deben ser mayores a 0).',
                customSizeLimit: 'Las dimensiones personalizadas no pueden exceder 50cm. Por favor ingresa valores más pequeños.',
                invalidPhotoCount: 'Por favor ingresa una cantidad válida de fotos (debe ser mayor a 0).',
                photoCountLimit: 'La cantidad personalizada de fotos no puede exceder 100. Por favor ingresa un valor más pequeño.',
                previewError: 'Error al generar la vista previa. Por favor intenta de nuevo.',
                generatePreviewFirst: 'Por favor genera una vista previa primero.',
                selectValidSizes: 'Por favor selecciona tamaños válidos de foto y papel.',
                downloadError: 'Error al descargar la imagen. Por favor intenta de nuevo.'
            }
        };
    }

    // Generate French text configuration
    static getFrenchConfig() {
        return {
            language: 'fr',
            texts: {
                photoSizeTitle: 'Étape 1',
                selectPhotoSize: 'Sélectionner la Taille de Photo',
                customSize: 'Taille Personnalisée',
                customWidth: 'Largeur Personnalisée (cm):',
                customHeight: 'Hauteur Personnalisée (cm):',
                
                paperSizeTitle: 'Étape 2',
                selectPaperSize: 'Sélectionner la Taille de Papier',
                
                bgColorTitle: 'Étape 3',
                bgColorDescription: 'Choisir la couleur de la ligne de séparation entre les photos',
                blue: 'Bleu',
                white: 'Blanc',
                gray: 'Gris',
                
                // Gap section
                gapTitle: 'Étape 4',
                gapLabel: 'Espace (mm) :',
                gapDescription: 'Définissez l’espace entre les photos pour faciliter la coupe',
                
                photoCountTitle: 'Étape 5',
                selectPhotoCount: 'Sélectionner le Nombre de Photos',
                auto: 'Automatique (Maximum)',
                custom: 'Personnalisé',
                customCount: 'Nombre Personnalisé de Photos:',
                
                uploadTitle: 'Étape 6',
                uploadDescription: 'Sélectionnez votre photo d\'identité à traiter',
                dragDropText: 'Glissez et déposez la photo ici ou cliquez pour sélectionner un fichier',
                selectFile: 'Sélectionner un Fichier',
                
                previewTitle: 'Aperçu:',
                photoCountText: 'Nombre de Photos:',
                downloadTitle: 'Étape Finale',
                downloadButton: 'Télécharger',
                
                // Messages
                selectImageFile: 'Veuillez sélectionner un fichier image.',
                fileSizeLimit: 'La taille du fichier doit être inférieure à 8MB.',
                invalidCustomSize: 'Veuillez entrer des dimensions personnalisées valides (largeur et hauteur doivent être supérieures à 0).',
                customSizeLimit: 'Les dimensions personnalisées ne peuvent pas dépasser 50cm. Veuillez entrer des valeurs plus petites.',
                invalidPhotoCount: 'Veuillez entrer un nombre valide de photos (doit être supérieur à 0).',
                photoCountLimit: 'Le nombre personnalisé de photos ne peut pas dépasser 100. Veuillez entrer une valeur plus petite.',
                previewError: 'Erreur lors de la génération de l\'aperçu. Veuillez réessayer.',
                generatePreviewFirst: 'Veuillez générer un aperçu d\'abord.',
                selectValidSizes: 'Veuillez sélectionner des tailles de photo et de papier valides.',
                downloadError: 'Erreur lors du téléchargement de l\'image. Veuillez réessayer.'
            }
        };
    }

    // Generate German text configuration
    static getGermanConfig() {
        return {
            language: 'de',
            texts: {
                photoSizeTitle: 'Schritt 1',
                selectPhotoSize: 'Fotogröße auswählen',
                customSize: 'Benutzerdefinierte Größe',
                customWidth: 'Benutzerdefinierte Breite (cm):',
                customHeight: 'Benutzerdefinierte Höhe (cm):',
                
                paperSizeTitle: 'Schritt 2',
                selectPaperSize: 'Papiergröße auswählen',
                
                bgColorTitle: 'Schritt 3',
                bgColorDescription: 'Farbe der Trennlinie zwischen Fotos wählen',
                blue: 'Blau',
                white: 'Weiß',
                gray: 'Grau',
                
                // Gap section
                gapTitle: 'Schritt 4',
                gapLabel: 'Abstand (mm):',
                gapDescription: 'Abstand zwischen Fotos für leichteres Zuschneiden festlegen',
                
                photoCountTitle: 'Schritt 5',
                selectPhotoCount: 'Anzahl der Fotos auswählen',
                auto: 'Automatisch (Maximum)',
                custom: 'Benutzerdefiniert',
                customCount: 'Benutzerdefinierte Fotoanzahl:',
                
                uploadTitle: 'Schritt 6',
                uploadDescription: 'Wählen Sie Ihr Ausweisfoto zur Verarbeitung',
                dragDropText: 'Foto hierher ziehen und ablegen oder klicken um Datei auszuwählen',
                selectFile: 'Datei auswählen',
                
                previewTitle: 'Vorschau:',
                photoCountText: 'Anzahl der Fotos:',
                downloadTitle: 'Letzter Schritt',
                downloadButton: 'Herunterladen',
                
                // Messages
                selectImageFile: 'Bitte wählen Sie eine Bilddatei aus.',
                fileSizeLimit: 'Die Dateigröße muss kleiner als 8MB sein.',
                invalidCustomSize: 'Bitte geben Sie gültige benutzerdefinierte Abmessungen ein (Breite und Höhe müssen größer als 0 sein).',
                customSizeLimit: 'Benutzerdefinierte Abmessungen können 50cm nicht überschreiten. Bitte geben Sie kleinere Werte ein.',
                invalidPhotoCount: 'Bitte geben Sie eine gültige Fotoanzahl ein (muss größer als 0 sein).',
                photoCountLimit: 'Die benutzerdefinierte Fotoanzahl kann 100 nicht überschreiten. Bitte geben Sie einen kleineren Wert ein.',
                previewError: 'Fehler beim Generieren der Vorschau. Bitte versuchen Sie es erneut.',
                generatePreviewFirst: 'Bitte generieren Sie zuerst eine Vorschau.',
                selectValidSizes: 'Bitte wählen Sie gültige Foto- und Papiergrößen aus.',
                downloadError: 'Fehler beim Herunterladen des Bildes. Bitte versuchen Sie es erneut.'
            }
        };
    }

    // Generate Japanese text configuration
    static getJapaneseConfig() {
        return {
            language: 'ja',
            texts: {
                photoSizeTitle: 'ステップ1',
                selectPhotoSize: '写真サイズを選択',
                customSize: 'カスタムサイズ',
                customWidth: 'カスタム幅 (cm):',
                customHeight: 'カスタム高さ (cm):',
                
                paperSizeTitle: 'ステップ2',
                selectPaperSize: '用紙サイズを選択',
                
                bgColorTitle: 'ステップ3',
                bgColorDescription: '写真間の区切り線の色を選択',
                blue: '青',
                white: '白',
                gray: 'グレー',
                
                // Gap section
                gapTitle: 'ステップ4',
                gapLabel: '間隔 (mm):',
                gapDescription: '切り取りやすくするために写真間の間隔を設定',
                
                photoCountTitle: 'ステップ5',
                selectPhotoCount: '写真枚数を選択',
                auto: '自動（最大）',
                custom: 'カスタム',
                customCount: 'カスタム写真枚数:',
                
                uploadTitle: 'ステップ6',
                uploadDescription: '処理する身分証明書写真を選択',
                dragDropText: '写真をここにドラッグ＆ドロップするか、クリックしてファイルを選択',
                selectFile: 'ファイルを選択',
                
                previewTitle: 'プレビュー:',
                photoCountText: '写真枚数:',
                downloadTitle: '最終ステップ',
                downloadButton: 'ダウンロード',
                
                // Messages
                selectImageFile: '画像ファイルを選択してください。',
                fileSizeLimit: 'ファイルサイズは8MB未満である必要があります。',
                invalidCustomSize: '有効なカスタムサイズを入力してください（幅と高さは0より大きい必要があります）。',
                customSizeLimit: 'カスタムサイズは50cmを超えることはできません。より小さい値を入力してください。',
                invalidPhotoCount: '有効な写真枚数を入力してください（0より大きい必要があります）。',
                photoCountLimit: 'カスタム写真枚数は100を超えることはできません。より小さい値を入力してください。',
                previewError: 'プレビューの生成中にエラーが発生しました。もう一度お試しください。',
                generatePreviewFirst: '最初にプレビューを生成してください。',
                selectValidSizes: '有効な写真と用紙サイズを選択してください。',
                downloadError: '画像のダウンロード中にエラーが発生しました。もう一度お試しください。'
            }
        };
    }

    // Generate Korean text configuration
    static getKoreanConfig() {
        return {
            language: 'ko',
            texts: {
                photoSizeTitle: '1단계',
                selectPhotoSize: '사진 크기 선택',
                customSize: '사용자 정의 크기',
                customWidth: '사용자 정의 너비 (cm):',
                customHeight: '사용자 정의 높이 (cm):',
                
                paperSizeTitle: '2단계',
                selectPaperSize: '용지 크기 선택',
                
                bgColorTitle: '3단계',
                bgColorDescription: '사진 사이의 구분선 색상 선택',
                blue: '파랑',
                white: '흰색',
                gray: '회색',
                
                // Gap section
                gapTitle: '4단계',
                gapLabel: '간격 (mm):',
                gapDescription: '자르기 쉽도록 사진 간 간격을 설정하세요',
                
                photoCountTitle: '5단계',
                selectPhotoCount: '사진 개수 선택',
                auto: '자동 (최대)',
                custom: '사용자 정의',
                customCount: '사용자 정의 사진 개수:',
                
                uploadTitle: '6단계',
                uploadDescription: '처리할 신분증 사진을 선택하세요',
                dragDropText: '사진을 여기에 끌어다 놓거나 클릭하여 파일 선택',
                selectFile: '파일 선택',
                
                previewTitle: '미리보기:',
                photoCountText: '사진 개수:',
                downloadTitle: '마지막 단계',
                downloadButton: '다운로드',
                
                // Messages
                selectImageFile: '이미지 파일을 선택해 주세요.',
                fileSizeLimit: '파일 크기는 8MB 미만이어야 합니다.',
                invalidCustomSize: '유효한 사용자 정의 크기를 입력하세요 (너비와 높이는 0보다 커야 합니다).',
                customSizeLimit: '사용자 정의 크기는 50cm를 초과할 수 없습니다. 더 작은 값을 입력하세요.',
                invalidPhotoCount: '유효한 사진 개수를 입력하세요 (0보다 커야 합니다).',
                photoCountLimit: '사용자 정의 사진 개수는 100을 초과할 수 없습니다. 더 작은 값을 입력하세요.',
                previewError: '미리보기 생성 중 오류가 발생했습니다. 다시 시도해 주세요.',
                generatePreviewFirst: '먼저 미리보기를 생성해 주세요.',
                selectValidSizes: '유효한 사진과 용지 크기를 선택하세요.',
                downloadError: '이미지 다운로드 중 오류가 발생했습니다. 다시 시도해 주세요.'
            }
        };
    }

    // Generate Russian text configuration
    static getRussianConfig() {
        return {
            language: 'ru',
            texts: {
                photoSizeTitle: 'Шаг 1',
                selectPhotoSize: 'Выбрать размер фото',
                customSize: 'Пользовательский размер',
                customWidth: 'Пользовательская ширина (см):',
                customHeight: 'Пользовательская высота (см):',
                
                paperSizeTitle: 'Шаг 2',
                selectPaperSize: 'Выбрать размер бумаги',
                
                bgColorTitle: 'Шаг 3',
                bgColorDescription: 'Выбрать цвет разделительной линии между фотографиями',
                blue: 'Синий',
                white: 'Белый',
                gray: 'Серый',
                
                // Gap section
                gapTitle: 'Шаг 4',
                gapLabel: 'Зазор (мм):',
                gapDescription: 'Задайте расстояние между фото для удобства обрезки',
                
                photoCountTitle: 'Шаг 5',
                selectPhotoCount: 'Выбрать количество фотографий',
                auto: 'Автоматически (максимум)',
                custom: 'Пользовательский',
                customCount: 'Пользовательское количество фотографий:',
                
                uploadTitle: 'Шаг 6',
                uploadDescription: 'Выберите фотографию для удостоверения личности для обработки',
                dragDropText: 'Перетащите фотографию сюда или нажмите для выбора файла',
                selectFile: 'Выбрать файл',
                
                previewTitle: 'Предварительный просмотр:',
                photoCountText: 'Количество фотографий:',
                downloadTitle: 'Финальный шаг',
                downloadButton: 'Скачать',
                
                // Messages
                selectImageFile: 'Пожалуйста, выберите файл изображения.',
                fileSizeLimit: 'Размер файла должен быть меньше 8МБ.',
                invalidCustomSize: 'Пожалуйста, введите действительные пользовательские размеры (ширина и высота должны быть больше 0).',
                customSizeLimit: 'Пользовательские размеры не могут превышать 50см. Пожалуйста, введите меньшие значения.',
                invalidPhotoCount: 'Пожалуйста, введите действительное количество фотографий (должно быть больше 0).',
                photoCountLimit: 'Пользовательское количество фотографий не может превышать 100. Пожалуйста, введите меньшее значение.',
                previewError: 'Ошибка при создании предварительного просмотра. Пожалуйста, попробуйте снова.',
                generatePreviewFirst: 'Пожалуйста, сначала создайте предварительный просмотр.',
                selectValidSizes: 'Пожалуйста, выберите действительные размеры фотографии и бумаги.',
                downloadError: 'Ошибка при скачивании изображения. Пожалуйста, попробуйте снова.'
            }
        };
    }

    // Generate Arabic text configuration
    static getArabicConfig() {
        return {
            language: 'ar',
            texts: {
                photoSizeTitle: 'الخطوة 1',
                selectPhotoSize: 'اختر حجم الصورة',
                customSize: 'حجم مخصص',
                customWidth: 'العرض المخصص (سم):',
                customHeight: 'الارتفاع المخصص (سم):',
                
                paperSizeTitle: 'الخطوة 2',
                selectPaperSize: 'اختر حجم الورق',
                
                bgColorTitle: 'الخطوة 3',
                bgColorDescription: 'اختر لون خط الفصل بين الصور',
                blue: 'أزرق',
                white: 'أبيض',
                gray: 'رمادي',
                
                // Gap section
                gapTitle: 'الخطوة 4',
                gapLabel: 'الفاصل (مم):',
                gapDescription: 'اضبط المسافة بين الصور لتسهيل القص',
                
                photoCountTitle: 'الخطوة 5',
                selectPhotoCount: 'اختر عدد الصور',
                auto: 'تلقائي (الحد الأقصى)',
                custom: 'مخصص',
                customCount: 'عدد الصور المخصص:',
                
                uploadTitle: 'الخطوة 6',
                uploadDescription: 'اختر صورة الهوية الخاصة بك للمعالجة',
                dragDropText: 'اسحب وأفلت الصورة هنا أو انقر لاختيار الملف',
                selectFile: 'اختر الملف',
                
                previewTitle: 'معاينة:',
                photoCountText: 'عدد الصور:',
                downloadTitle: 'الخطوة النهائية',
                downloadButton: 'تحميل',
                
                // Messages
                selectImageFile: 'يرجى اختيار ملف صورة.',
                fileSizeLimit: 'يجب أن يكون حجم الملف أقل من 8 ميجابايت.',
                invalidCustomSize: 'يرجى إدخال أبعاد مخصصة صالحة (العرض والارتفاع يجب أن يكونا أكبر من 0).',
                customSizeLimit: 'الأبعاد المخصصة لا يمكن أن تتجاوز 50 سم. يرجى إدخال قيم أصغر.',
                invalidPhotoCount: 'يرجى إدخال عدد صور صالح (يجب أن يكون أكبر من 0).',
                photoCountLimit: 'عدد الصور المخصص لا يمكن أن يتجاوز 100. يرجى إدخال قيمة أصغر.',
                previewError: 'خطأ في إنشاء المعاينة. يرجى المحاولة مرة أخرى.',
                generatePreviewFirst: 'يرجى إنشاء معاينة أولاً.',
                selectValidSizes: 'يرجى اختيار أحجام صور وورق صالحة.',
                downloadError: 'خطأ في تحميل الصورة. يرجى المحاولة مرة أخرى.'
            }
        };
    }

    // Generate Portuguese text configuration
    static getPortugueseConfig() {
        return {
            language: 'pt',
            texts: {
                photoSizeTitle: 'Passo 1',
                selectPhotoSize: 'Selecionar Tamanho da Foto',
                customSize: 'Tamanho Personalizado',
                customWidth: 'Largura Personalizada (cm):',
                customHeight: 'Altura Personalizada (cm):',
                
                paperSizeTitle: 'Passo 2',
                selectPaperSize: 'Selecionar Tamanho do Papel',
                
                bgColorTitle: 'Passo 3',
                bgColorDescription: 'Escolher a cor da linha separadora entre fotos',
                blue: 'Azul',
                white: 'Branco',
                gray: 'Cinza',
                
                // Gap section
                gapTitle: 'Passo 4',
                gapLabel: 'Espaço (mm):',
                gapDescription: 'Defina o espaço entre fotos para facilitar o corte',
                
                photoCountTitle: 'Passo 5',
                selectPhotoCount: 'Selecionar Quantidade de Fotos',
                auto: 'Automático (Máximo)',
                custom: 'Personalizado',
                customCount: 'Quantidade Personalizada de Fotos:',
                
                uploadTitle: 'Passo 6',
                uploadDescription: 'Selecione sua foto de identidade para processar',
                dragDropText: 'Arraste e solte a foto aqui ou clique para selecionar arquivo',
                selectFile: 'Selecionar Arquivo',
                
                previewTitle: 'Prévia:',
                photoCountText: 'Quantidade de Fotos:',
                downloadTitle: 'Passo Final',
                downloadButton: 'Baixar',
                
                // Messages
                selectImageFile: 'Por favor selecione um arquivo de imagem.',
                fileSizeLimit: 'O tamanho do arquivo deve ser menor que 8MB.',
                invalidCustomSize: 'Por favor insira dimensões personalizadas válidas (largura e altura devem ser maiores que 0).',
                customSizeLimit: 'As dimensões personalizadas não podem exceder 50cm. Por favor insira valores menores.',
                invalidPhotoCount: 'Por favor insira uma quantidade válida de fotos (deve ser maior que 0).',
                photoCountLimit: 'A quantidade personalizada de fotos não pode exceder 100. Por favor insira um valor menor.',
                previewError: 'Erro ao gerar a prévia. Por favor tente novamente.',
                generatePreviewFirst: 'Por favor gere uma prévia primeiro.',
                selectValidSizes: 'Por favor selecione tamanhos válidos de foto e papel.',
                downloadError: 'Erro ao baixar a imagem. Por favor tente novamente.'
            }
        };
    }
} 