// Photo types data - converted from phototype.txt with multi-language support
const PHOTO_TYPES = [
    // ID Photos
    { 
        name_zh: "1寸", 
        name_en: "1 Inch", 
        name_es: "1 Pulgada",
        name_fr: "1 Pouce",
        name_de: "1 Zoll",
        name_ja: "1インチ",
        name_ko: "1인치",
        name_ru: "1 Дюйм",
        name_ar: "1 بوصة",
        name_pt: "1 Polegada",
        width: 2.5, height: 3.5, category: "id" 
    },
    { 
        name_zh: "大一寸", 
        name_en: "Large 1 Inch", 
        name_es: "1 Pulgada Grande",
        name_fr: "1 Pouce Grand",
        name_de: "Großer 1 Zoll",
        name_ja: "大1インチ",
        name_ko: "대1인치",
        name_ru: "Большой 1 Дюйм",
        name_ar: "1 بوصة كبيرة",
        name_pt: "1 Polegada Grande",
        width: 3.3, height: 4.8, category: "id" 
    },
    { 
        name_zh: "小一寸", 
        name_en: "Small 1 Inch", 
        name_es: "1 Pulgada Pequeña",
        name_fr: "1 Pouce Petit",
        name_de: "Kleiner 1 Zoll",
        name_ja: "小1インチ",
        name_ko: "소1인치",
        name_ru: "Малый 1 Дюйм",
        name_ar: "1 بوصة صغيرة",
        name_pt: "1 Polegada Pequena",
        width: 2.2, height: 3.2, category: "id" 
    },
    { 
        name_zh: "彩色大一寸", 
        name_en: "Large 1 Inch (Color)", 
        name_es: "1 Pulgada Grande (Color)",
        name_fr: "1 Pouce Grand (Couleur)",
        name_de: "Großer 1 Zoll (Farbe)",
        name_ja: "大1インチ（カラー）",
        name_ko: "대1인치 (컬러)",
        name_ru: "Большой 1 Дюйм (Цвет)",
        name_ar: "1 بوصة كبيرة (ملون)",
        name_pt: "1 Polegada Grande (Cor)",
        width: 4.0, height: 5.5, category: "id" 
    },
    { 
        name_zh: "彩色小一寸", 
        name_en: "Small 1 Inch (Color)", 
        name_es: "1 Pulgada Pequeña (Color)",
        name_fr: "1 Pouce Petit (Couleur)",
        name_de: "Kleiner 1 Zoll (Farbe)",
        name_ja: "小1インチ（カラー）",
        name_ko: "소1인치 (컬러)",
        name_ru: "Малый 1 Дюйм (Цвет)",
        name_ar: "1 بوصة صغيرة (ملون)",
        name_pt: "1 Polegada Pequena (Cor)",
        width: 2.7, height: 3.8, category: "id" 
    },
    { 
        name_zh: "黑白大一寸", 
        name_en: "Large 1 Inch (B&W)", 
        name_es: "1 Pulgada Grande (B&N)",
        name_fr: "1 Pouce Grand (N&B)",
        name_de: "Großer 1 Zoll (S/W)",
        name_ja: "大1インチ（白黒）",
        name_ko: "대1인치 (흑백)",
        name_ru: "Большой 1 Дюйм (Ч/Б)",
        name_ar: "1 بوصة كبيرة (أبيض وأسود)",
        name_pt: "1 Polegada Grande (P&B)",
        width: 3.3, height: 4.8, category: "id" 
    },
    { 
        name_zh: "黑白小一寸", 
        name_en: "Small 1 Inch (B&W)", 
        name_es: "1 Pulgada Pequeña (B&N)",
        name_fr: "1 Pouce Petit (N&B)",
        name_de: "Kleiner 1 Zoll (S/W)",
        name_ja: "小1インチ（白黒）",
        name_ko: "소1인치 (흑백)",
        name_ru: "Малый 1 Дюйм (Ч/Б)",
        name_ar: "1 بوصة صغيرة (أبيض وأسود)",
        name_pt: "1 Polegada Pequena (P&B)",
        width: 2.2, height: 3.2, category: "id" 
    },
    { 
        name_zh: "2寸", 
        name_en: "2 Inch", 
        name_es: "2 Pulgadas",
        name_fr: "2 Pouces",
        name_de: "2 Zoll",
        name_ja: "2インチ",
        name_ko: "2인치",
        name_ru: "2 Дюйма",
        name_ar: "2 بوصة",
        name_pt: "2 Polegadas",
        width: 3.8, height: 5.1, category: "id" 
    },
    { 
        name_zh: "大二寸", 
        name_en: "Large 2 Inch", 
        name_es: "2 Pulgadas Grande",
        name_fr: "2 Pouces Grand",
        name_de: "Großer 2 Zoll",
        name_ja: "大2インチ",
        name_ko: "대2인치",
        name_ru: "Большой 2 Дюйма",
        name_ar: "2 بوصة كبيرة",
        name_pt: "2 Polegadas Grande",
        width: 3.5, height: 5.0, category: "id" 
    },
    { 
        name_zh: "小二寸", 
        name_en: "Small 2 Inch", 
        name_es: "2 Pulgadas Pequeña",
        name_fr: "2 Pouces Petit",
        name_de: "Kleiner 2 Zoll",
        name_ja: "小2インチ",
        name_ko: "소2인치",
        name_ru: "Малый 2 Дюйма",
        name_ar: "2 بوصة صغيرة",
        name_pt: "2 Polegadas Pequena",
        width: 3.5, height: 4.5, category: "id" 
    },
    
    // Documents
    { 
        name_zh: "身份证", 
        name_en: "Chinese ID Card", 
        name_es: "Carné de Identidad Chino",
        name_fr: "Carte d'Identité Chinoise",
        name_de: "Chinesischer Personalausweis",
        name_ja: "中国身分証",
        name_ko: "중국 신분증",
        name_ru: "Китайская ID Карта",
        name_ar: "بطاقة هوية صينية",
        name_pt: "Carteira de Identidade Chinesa",
        width: 2.2, height: 3.2, category: "document" 
    },
    { 
        name_zh: "第二代身份证", 
        name_en: "2nd Gen Chinese ID Card", 
        name_es: "Carné de Identidad Chino 2da Gen",
        name_fr: "Carte d'Identité Chinoise 2e Gén",
        name_de: "Chinesischer Personalausweis 2. Gen",
        name_ja: "中国身分証第2世代",
        name_ko: "중국 신분증 2세대",
        name_ru: "Китайская ID Карта 2-го Поколения",
        name_ar: "بطاقة هوية صينية الجيل الثاني",
        name_pt: "Carteira de Identidade Chinesa 2ª Geração",
        width: 2.6, height: 3.2, category: "document" 
    },
    { 
        name_zh: "驾驶证", 
        name_en: "Driver's License", 
        name_es: "Licencia de Conducir",
        name_fr: "Permis de Conduire",
        name_de: "Führerschein",
        name_ja: "運転免許証",
        name_ko: "운전면허증",
        name_ru: "Водительские Права",
        name_ar: "رخصة قيادة",
        name_pt: "Carteira de Motorista",
        width: 2.2, height: 3.2, category: "document" 
    },
    { 
        name_zh: "中国护照", 
        name_en: "Chinese Passport", 
        name_es: "Pasaporte Chino",
        name_fr: "Passeport Chinois",
        name_de: "Chinesischer Reisepass",
        name_ja: "中国パスポート",
        name_ko: "중국 여권",
        name_ru: "Китайский Паспорт",
        name_ar: "جواز سفر صيني",
        name_pt: "Passaporte Chinês",
        width: 3.3, height: 4.8, category: "document" 
    },
    { 
        name_zh: "赴美非移民签证", 
        name_en: "US Non-Immigrant Visa", 
        name_es: "Visa No Inmigrante EE.UU.",
        name_fr: "Visa Non-Immigrant US",
        name_de: "US Nicht-Einwanderer Visum",
        name_ja: "米国非移民ビザ",
        name_ko: "미국 비이민 비자",
        name_ru: "Виза США Неиммигранта",
        name_ar: "تأشيرة غير مهاجر أمريكية",
        name_pt: "Visto Não Imigrante EUA",
        width: 5.1, height: 5.1, category: "document" 
    },
    { 
        name_zh: "赴美移民签证", 
        name_en: "US Immigrant Visa", 
        name_es: "Visa Inmigrante EE.UU.",
        name_fr: "Visa Immigrant US",
        name_de: "US Einwanderer Visum",
        name_ja: "米国移民ビザ",
        name_ko: "미국 이민 비자",
        name_ru: "Виза США Иммигранта",
        name_ar: "تأشيرة مهاجر أمريكية",
        name_pt: "Visto Imigrante EUA",
        width: 3.5, height: 4.0, category: "document" 
    },
    { 
        name_zh: "加拿大签证", 
        name_en: "Canada Visa", 
        name_es: "Visa Canadiense",
        name_fr: "Visa Canadien",
        name_de: "Kanadisches Visum",
        name_ja: "カナダビザ",
        name_ko: "캐나다 비자",
        name_ru: "Канадская Виза",
        name_ar: "تأشيرة كندية",
        name_pt: "Visto Canadense",
        width: 3.5, height: 4.5, category: "document" 
    },
    { 
        name_zh: "英国签证", 
        name_en: "UK Visa", 
        name_es: "Visa Británica",
        name_fr: "Visa Britannique",
        name_de: "Britisches Visum",
        name_ja: "英国ビザ",
        name_ko: "영국 비자",
        name_ru: "Британская Виза",
        name_ar: "تأشيرة بريطانية",
        name_pt: "Visto Britânico",
        width: 3.5, height: 4.5, category: "document" 
    },
    { 
        name_zh: "澳大利亚签证", 
        name_en: "Australia Visa", 
        name_es: "Visa Australiana",
        name_fr: "Visa Australien",
        name_de: "Australisches Visum",
        name_ja: "オーストラリアビザ",
        name_ko: "호주 비자",
        name_ru: "Австралийская Виза",
        name_ar: "تأشيرة أسترالية",
        name_pt: "Visto Australiano",
        width: 3.5, height: 4.5, category: "document" 
    },
    { 
        name_zh: "日本签证", 
        name_en: "Japan Visa", 
        name_es: "Visa Japonesa",
        name_fr: "Visa Japonais",
        name_de: "Japanisches Visum",
        name_ja: "日本ビザ",
        name_ko: "일본 비자",
        name_ru: "Японская Виза",
        name_ar: "تأشيرة يابانية",
        name_pt: "Visto Japonês",
        width: 4.5, height: 4.5, category: "document" 
    },
    { 
        name_zh: "港澳通行证", 
        name_en: "HK/Macau Permit", 
        name_es: "Permiso HK/Macao",
        name_fr: "Permis HK/Macao",
        name_de: "HK/Macau Erlaubnis",
        name_ja: "香港・マカオ通行証",
        name_ko: "홍콩/마카오 통행증",
        name_ru: "Разрешение Гонконг/Макао",
        name_ar: "تصريح هونغ كونغ/ماكاو",
        name_pt: "Permissão HK/Macau",
        width: 3.3, height: 4.8, category: "document" 
    },
    { 
        name_zh: "香港特区护照", 
        name_en: "HK SAR Passport", 
        name_es: "Pasaporte RAE Hong Kong",
        name_fr: "Passeport RAE Hong Kong",
        name_de: "Hong Kong SAR Reisepass",
        name_ja: "香港特別行政区パスポート",
        name_ko: "홍콩 특별행정구 여권",
        name_ru: "Паспорт Гонконг САР",
        name_ar: "جواز سفر هونغ كونغ الخاص",
        name_pt: "Passaporte RAE Hong Kong",
        width: 4.0, height: 5.0, category: "document" 
    },
    { 
        name_zh: "普通证件照", 
        name_en: "Standard Document Photo", 
        name_es: "Foto de Documento Estándar",
        name_fr: "Photo de Document Standard",
        name_de: "Standard Dokumentfoto",
        name_ja: "標準身分証明書写真",
        name_ko: "표준 신분증 사진",
        name_ru: "Стандартное Фото Документа",
        name_ar: "صورة وثيقة قياسية",
        name_pt: "Foto de Documento Padrão",
        width: 3.3, height: 4.8, category: "document" 
    },
    { 
        name_zh: "机动车行驶证", 
        name_en: "Vehicle License", 
        name_es: "Licencia de Vehículo",
        name_fr: "Permis de Véhicule",
        name_de: "Fahrzeuglizenz",
        name_ja: "車両免許証",
        name_ko: "차량 면허증",
        name_ru: "Лицензия Транспортного Средства",
        name_ar: "رخصة مركبة",
        name_pt: "Licença de Veículo",
        width: 6.0, height: 8.8, category: "document" 
    },
    { 
        name_zh: "毕业生照", 
        name_en: "Graduate Photo", 
        name_es: "Foto de Graduado",
        name_fr: "Photo de Diplômé",
        name_de: "Absolventenfoto",
        name_ja: "卒業写真",
        name_ko: "졸업 사진",
        name_ru: "Фото Выпускника",
        name_ar: "صورة خريج",
        name_pt: "Foto de Formando",
        width: 3.3, height: 4.8, category: "document" 
    },
    { 
        name_zh: "在美申请申根签证", 
        name_en: "Schengen Visa (in US)", 
        name_es: "Visa Schengen (en EE.UU.)",
        name_fr: "Visa Schengen (aux US)",
        name_de: "Schengen Visum (in USA)",
        name_ja: "米国でのシェンゲンビザ申請",
        name_ko: "미국에서 신청하는 셍겐 비자",
        name_ru: "Шенгенская Виза (в США)",
        name_ar: "تأشيرة شنغن (في الولايات المتحدة)",
        name_pt: "Visto Schengen (nos EUA)",
        width: 3.0, height: 4.0, category: "document" 
    },
    { 
        name_zh: "国家司法考试报名2寸", 
        name_en: "National Judicial Exam 2 Inch", 
        name_es: "Examen Judicial Nacional 2 Pulgadas",
        name_fr: "Examen Judiciaire National 2 Pouces",
        name_de: "Nationale Justizprüfung 2 Zoll",
        name_ja: "国家司法試験申込2インチ",
        name_ko: "국가사법시험 신청 2인치",
        name_ru: "Национальный Судебный Экзамен 2 Дюйма",
        name_ar: "امتحان قضائي وطني 2 بوصة",
        name_pt: "Exame Judicial Nacional 2 Polegadas",
        width: 3.2, height: 4.6, category: "document" 
    },
    
    // Photo Paper Sizes
    { 
        name_zh: "5寸(3R)", 
        name_en: "5 Inch (3R)", 
        name_es: "5 Pulgadas (3R)",
        name_fr: "5 Pouces (3R)",
        name_de: "5 Zoll (3R)",
        name_ja: "5インチ (3R)",
        name_ko: "5인치 (3R)",
        name_ru: "5 Дюймов (3R)",
        name_ar: "5 بوصة (3R)",
        name_pt: "5 Polegadas (3R)",
        width: 12.7, height: 8.9, category: "paper" 
    },
    { 
        name_zh: "6寸(4R)", 
        name_en: "6 Inch (4R)", 
        name_es: "6 Pulgadas (4R)",
        name_fr: "6 Pouces (4R)",
        name_de: "6 Zoll (4R)",
        name_ja: "6インチ (4R)",
        name_ko: "6인치 (4R)",
        name_ru: "6 Дюймов (4R)",
        name_ar: "6 بوصة (4R)",
        name_pt: "6 Polegadas (4R)",
        width: 15.2, height: 10.2, category: "paper" 
    },
    { 
        name_zh: "7寸(5R)", 
        name_en: "7 Inch (5R)", 
        name_es: "7 Pulgadas (5R)",
        name_fr: "7 Pouces (5R)",
        name_de: "7 Zoll (5R)",
        name_ja: "7インチ (5R)",
        name_ko: "7인치 (5R)",
        name_ru: "7 Дюймов (5R)",
        name_ar: "7 بوصة (5R)",
        name_pt: "7 Polegadas (5R)",
        width: 17.8, height: 12.7, category: "paper" 
    },
    { 
        name_zh: "8寸(6R)", 
        name_en: "8 Inch (6R)", 
        name_es: "8 Pulgadas (6R)",
        name_fr: "8 Pouces (6R)",
        name_de: "8 Zoll (6R)",
        name_ja: "8インチ (6R)",
        name_ko: "8인치 (6R)",
        name_ru: "8 Дюймов (6R)",
        name_ar: "8 بوصة (6R)",
        name_pt: "8 Polegadas (6R)",
        width: 20.3, height: 15.2, category: "paper" 
    },
    { 
        name_zh: "10寸(8R)", 
        name_en: "10 Inch (8R)", 
        name_es: "10 Pulgadas (8R)",
        name_fr: "10 Pouces (8R)",
        name_de: "10 Zoll (8R)",
        name_ja: "10インチ (8R)",
        name_ko: "10인치 (8R)",
        name_ru: "10 Дюймов (8R)",
        name_ar: "10 بوصة (8R)",
        name_pt: "10 Polegadas (8R)",
        width: 25.4, height: 20.3, category: "paper" 
    },
    { 
        name_zh: "12寸", 
        name_en: "12 Inch", 
        name_es: "12 Pulgadas",
        name_fr: "12 Pouces",
        name_de: "12 Zoll",
        name_ja: "12インチ",
        name_ko: "12인치",
        name_ru: "12 Дюймов",
        name_ar: "12 بوصة",
        name_pt: "12 Polegadas",
        width: 25.40, height: 30.48, category: "paper" 
    },
    
    // Other Documents
    { 
        name_zh: "阿根廷签证", 
        name_en: "Argentina Visa", 
        name_es: "Visa Argentina",
        name_fr: "Visa Argentin",
        name_de: "Argentinisches Visum",
        name_ja: "アルゼンチンビザ",
        name_ko: "아르헨티나 비자",
        name_ru: "Аргентинская Виза",
        name_ar: "تأشيرة أرجنتينية",
        name_pt: "Visto Argentino",
        width: 4.0, height: 4.0, category: "document" 
    },
    { 
        name_zh: "意大利签证", 
        name_en: "Italy Visa", 
        name_es: "Visa Italiana",
        name_fr: "Visa Italien",
        name_de: "Italienisches Visum",
        name_ja: "イタリアビザ",
        name_ko: "이탈리아 비자",
        name_ru: "Итальянская Виза",
        name_ar: "تأشيرة إيطالية",
        name_pt: "Visto Italiano",
        width: 3.4, height: 4.0, category: "document" 
    },
    
    // Standard Paper Sizes
    { 
        name_zh: "A3", 
        name_en: "A3", 
        name_es: "A3",
        name_fr: "A3",
        name_de: "A3",
        name_ja: "A3",
        name_ko: "A3",
        name_ru: "A3",
        name_ar: "A3",
        name_pt: "A3",
        width: 29.7, height: 42.0, category: "paper" 
    },
    { 
        name_zh: "A4", 
        name_en: "A4", 
        name_es: "A4",
        name_fr: "A4",
        name_de: "A4",
        name_ja: "A4",
        name_ko: "A4",
        name_ru: "A4",
        name_ar: "A4",
        name_pt: "A4",
        width: 21.0, height: 29.7, category: "paper" 
    },
    { 
        name_zh: "A5", 
        name_en: "A5", 
        name_es: "A5",
        name_fr: "A5",
        name_de: "A5",
        name_ja: "A5",
        name_ko: "A5",
        name_ru: "A5",
        name_ar: "A5",
        name_pt: "A5",
        width: 14.8, height: 21.0, category: "paper" 
    },
    { 
        name_zh: "A6", 
        name_en: "A6", 
        name_es: "A6",
        name_fr: "A6",
        name_de: "A6",
        name_ja: "A6",
        name_ko: "A6",
        name_ru: "A6",
        name_ar: "A6",
        name_pt: "A6",
        width: 10.5, height: 14.8, category: "paper" 
    },
    { 
        name_zh: "B3", 
        name_en: "B3", 
        name_es: "B3",
        name_fr: "B3",
        name_de: "B3",
        name_ja: "B3",
        name_ko: "B3",
        name_ru: "B3",
        name_ar: "B3",
        name_pt: "B3",
        width: 50.0, height: 70.7, category: "paper" 
    },
    { 
        name_zh: "B4", 
        name_en: "B4", 
        name_es: "B4",
        name_fr: "B4",
        name_de: "B4",
        name_ja: "B4",
        name_ko: "B4",
        name_ru: "B4",
        name_ar: "B4",
        name_pt: "B4",
        width: 25.0, height: 35.3, category: "paper" 
    },
    { 
        name_zh: "B5", 
        name_en: "B5", 
        name_es: "B5",
        name_fr: "B5",
        name_de: "B5",
        name_ja: "B5",
        name_ko: "B5",
        name_ru: "B5",
        name_ar: "B5",
        name_pt: "B5",
        width: 17.6, height: 25.0, category: "paper" 
    },
    { 
        name_zh: "Letter", 
        name_en: "Letter", 
        name_es: "Carta",
        name_fr: "Lettre",
        name_de: "Letter",
        name_ja: "レター",
        name_ko: "레터",
        name_ru: "Letter",
        name_ar: "Letter",
        name_pt: "Carta",
        width: 21.59, height: 27.94, category: "paper" 
    },
    
    // Additional Types
    { 
        name_zh: "日本资格考试报名", 
        name_en: "Japan Exam Registration", 
        name_es: "Registro de Examen Japonés",
        name_fr: "Inscription d'Examen Japonais",
        name_de: "Japanische Prüfungsanmeldung",
        name_ja: "日本資格試験申込",
        name_ko: "일본 자격시험 신청",
        name_ru: "Регистрация на Японский Экзамен",
        name_ar: "تسجيل امتحان ياباني",
        name_pt: "Registro de Exame Japonês",
        width: 2.4, height: 3.0, category: "document" 
    },
    { 
        name_zh: "加拿大签证B", 
        name_en: "Canada Visa B", 
        name_es: "Visa Canadiense B",
        name_fr: "Visa Canadien B",
        name_de: "Kanadisches Visum B",
        name_ja: "カナダビザB",
        name_ko: "캐나다 비자 B",
        name_ru: "Канадская Виза B",
        name_ar: "تأشيرة كندية ب",
        name_pt: "Visto Canadense B",
        width: 5.0, height: 7.0, category: "document" 
    },
    { 
        name_zh: "结婚证照片", 
        name_en: "Marriage Certificate Photo", 
        name_es: "Foto de Certificado de Matrimonio",
        name_fr: "Photo de Certificat de Mariage",
        name_de: "Heiratsurkunde Foto",
        name_ja: "結婚証明書写真",
        name_ko: "결혼증명서 사진",
        name_ru: "Фото Свидетельства о Браке",
        name_ar: "صورة شهادة زواج",
        name_pt: "Foto de Certidão de Casamento",
        width: 6.0, height: 4.0, category: "document" 
    },
    { 
        name_zh: "赴美非移民签证(备选）", 
        name_en: "US Non-Immigrant Visa (Alt)", 
        name_es: "Visa No Inmigrante EE.UU. (Alt)",
        name_fr: "Visa Non-Immigrant US (Alt)",
        name_de: "US Nicht-Einwanderer Visum (Alt)",
        name_ja: "米国非移民ビザ（代替）",
        name_ko: "미국 비이민 비자 (대안)",
        name_ru: "Виза США Неиммигранта (Альт)",
        name_ar: "تأشيرة غير مهاجر أمريكية (بديل)",
        name_pt: "Visto Não Imigrante EUA (Alt)",
        width: 5.0, height: 5.0, category: "document" 
    },
    { 
        name_zh: "3.5x3.0", 
        name_en: "3.5x3.0", 
        name_es: "3.5x3.0",
        name_fr: "3.5x3.0",
        name_de: "3.5x3.0",
        name_ja: "3.5x3.0",
        name_ko: "3.5x3.0",
        name_ru: "3.5x3.0",
        name_ar: "3.5x3.0",
        name_pt: "3.5x3.0",
        width: 3.5, height: 3.0, category: "id" 
    },
    { 
        name_zh: "明信片", 
        name_en: "Postcard", 
        name_es: "Postal",
        name_fr: "Carte Postale",
        name_de: "Postkarte",
        name_ja: "はがき",
        name_ko: "엽서",
        name_ru: "Открытка",
        name_ar: "بطاقة بريدية",
        name_pt: "Cartão Postal",
        width: 14.8, height: 10.0, category: "paper" 
    },
    { 
        name_zh: "佳能4x6相纸", 
        name_en: "Canon 4x6 Photo Paper", 
        name_es: "Papel Fotográfico Canon 4x6",
        name_fr: "Papier Photo Canon 4x6",
        name_de: "Canon 4x6 Fotopapier",
        name_ja: "キヤノン4x6写真用紙",
        name_ko: "캐논 4x6 사진용지",
        name_ru: "Фотобумага Canon 4x6",
        name_ar: "ورق صور كانون 4x6",
        name_pt: "Papel Fotográfico Canon 4x6",
        width: 13.35, height: 8.9, category: "paper" 
    },
    { 
        name_zh: "2吋半身照", 
        name_en: "2 Inch Half Body", 
        name_es: "2 Pulgadas Medio Cuerpo",
        name_fr: "2 Pouces Demi Corps",
        name_de: "2 Zoll Halbkörper",
        name_ja: "2インチ半身",
        name_ko: "2인치 반신",
        name_ru: "2 Дюйма Полуфигура",
        name_ar: "2 بوصة نصف الجسم",
        name_pt: "2 Polegadas Meio Corpo",
        width: 4.2, height: 4.7, category: "id" 
    },
    { 
        name_zh: "某结婚照片", 
        name_en: "Some Marriage Photo", 
        name_es: "Alguna Foto de Boda",
        name_fr: "Quelque Photo de Mariage",
        name_de: "Irgendein Hochzeitsfoto",
        name_ja: "ある結婚写真",
        name_ko: "어떤 결혼 사진",
        name_ru: "Какое-то Свадебное Фото",
        name_ar: "صورة زواج ما",
        name_pt: "Alguma Foto de Casamento",
        width: 5.0, height: 4.0, category: "document" 
    },
    { 
        name_zh: "Hagaki", 
        name_en: "Hagaki", 
        name_es: "Hagaki",
        name_fr: "Hagaki",
        name_de: "Hagaki",
        name_ja: "はがき",
        name_ko: "하가키",
        name_ru: "Хагаки",
        name_ar: "هاغاكي",
        name_pt: "Hagaki",
        width: 10.0, height: 14.8, category: "paper" 
    },
    { 
        name_zh: "大二寸v2", 
        name_en: "Large 2 Inch v2", 
        name_es: "2 Pulgadas Grande v2",
        name_fr: "2 Pouces Grand v2",
        name_de: "Großer 2 Zoll v2",
        name_ja: "大2インチv2",
        name_ko: "대2인치v2",
        name_ru: "Большой 2 Дюйма v2",
        name_ar: "2 بوصة كبيرة v2",
        name_pt: "2 Polegadas Grande v2",
        width: 3.5, height: 5.3, category: "id" 
    },
    { 
        name_zh: "结婚登记照2022", 
        name_en: "Marriage Registration Photo 2022", 
        name_es: "Foto de Registro de Matrimonio 2022",
        name_fr: "Photo d'Enregistrement de Mariage 2022",
        name_de: "Heiratsregistrierung Foto 2022",
        name_ja: "結婚登録写真2022",
        name_ko: "결혼등록 사진 2022",
        name_ru: "Фото Регистрации Брака 2022",
        name_ar: "صورة تسجيل زواج 2022",
        name_pt: "Foto de Registro de Casamento 2022",
        width: 5.3, height: 3.5, category: "document" 
    },
    { 
        name_zh: "泰国落地签", 
        name_en: "Thailand Visa on Arrival", 
        name_es: "Visa Tailandesa a la Llegada",
        name_fr: "Visa Thaïlandais à l'Arrivée",
        name_de: "Thailand Visum bei Ankunft",
        name_ja: "タイランド到着ビザ",
        name_ko: "태국 도착 비자",
        name_ru: "Тайская Виза по Прибытии",
        name_ar: "تأشيرة تايلاند عند الوصول",
        name_pt: "Visto Tailandês na Chegada",
        width: 4.0, height: 6.0, category: "document" 
    },
    { 
        name_zh: "5.0cm x 5.5cm", 
        name_en: "5.0cm x 5.5cm", 
        name_es: "5.0cm x 5.5cm",
        name_fr: "5.0cm x 5.5cm",
        name_de: "5.0cm x 5.5cm",
        name_ja: "5.0cm x 5.5cm",
        name_ko: "5.0cm x 5.5cm",
        name_ru: "5.0cm x 5.5cm",
        name_ar: "5.0cm x 5.5cm",
        name_pt: "5.0cm x 5.5cm",
        width: 5.0, height: 5.5, category: "id" 
    }
];

// Helper functions
function getPhotoTypesByCategory(category) {
    return PHOTO_TYPES.filter(type => type.category === category);
}

function getPhotoTypeByIndex(index) {
    return PHOTO_TYPES[index] || null;
}

function getPhotoTypeByName(name) {
    return PHOTO_TYPES.find(type => type.name_zh === name) || null;
}

// Get photo type name based on language
function getPhotoTypeName(photoType, language = 'en') {
    if (!photoType) return '';
    
    // Map language codes to name field keys
    const nameFieldMap = {
        'en': 'name_en',
        'zh': 'name_zh',
        'es': 'name_es',
        'fr': 'name_fr',
        'de': 'name_de',
        'ja': 'name_ja',
        'ko': 'name_ko',
        'ru': 'name_ru',
        'ar': 'name_ar',
        'pt': 'name_pt'
    };
    
    const nameField = nameFieldMap[language];
    if (nameField && photoType[nameField]) {
        return photoType[nameField];
    }
    
    // Fallback to English, then Chinese, then any available name
    return photoType.name_en || photoType.name_zh || photoType.name || '';
}

// Get photo types with localized names
function getPhotoTypesByCategoryLocalized(category, language = 'en') {
    const types = getPhotoTypesByCategory(category);
    return types.map(type => ({
        ...type,
        name: getPhotoTypeName(type, language)
    }));
}

// Get all available languages for photo types
function getAvailablePhotoTypeLanguages() {
    return ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'ru', 'ar', 'pt'];
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        PHOTO_TYPES, 
        getPhotoTypesByCategory, 
        getPhotoTypeByIndex, 
        getPhotoTypeByName,
        getPhotoTypeName,
        getPhotoTypesByCategoryLocalized,
        getAvailablePhotoTypeLanguages
    };
} 