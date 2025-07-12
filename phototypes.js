// Photo types data - converted from phototype.txt
const PHOTO_TYPES = [
    // ID Photos
    { name: "1寸", width: 2.5, height: 3.5, category: "id" },
    { name: "大一寸", width: 3.3, height: 4.8, category: "id" },
    { name: "小一寸", width: 2.2, height: 3.2, category: "id" },
    { name: "彩色大一寸", width: 4.0, height: 5.5, category: "id" },
    { name: "彩色小一寸", width: 2.7, height: 3.8, category: "id" },
    { name: "黑白大一寸", width: 3.3, height: 4.8, category: "id" },
    { name: "黑白小一寸", width: 2.2, height: 3.2, category: "id" },
    
    { name: "2寸", width: 3.8, height: 5.1, category: "id" },
    { name: "大二寸", width: 3.5, height: 5.0, category: "id" },
    { name: "小二寸", width: 3.5, height: 4.5, category: "id" },
    
    // Documents
    { name: "身份证", width: 2.2, height: 3.2, category: "document" },
    { name: "第二代身份证", width: 2.6, height: 3.2, category: "document" },
    { name: "驾驶证", width: 2.2, height: 3.2, category: "document" },
    { name: "中国护照", width: 3.3, height: 4.8, category: "document" },
    { name: "赴美非移民签证", width: 5.1, height: 5.1, category: "document" },
    { name: "赴美移民签证", width: 3.5, height: 4.0, category: "document" },
    { name: "加拿大签证", width: 3.5, height: 4.5, category: "document" },
    { name: "英国签证", width: 3.5, height: 4.5, category: "document" },
    { name: "澳大利亚签证", width: 3.5, height: 4.5, category: "document" },
    { name: "日本签证", width: 4.5, height: 4.5, category: "document" },
    { name: "港澳通行证", width: 3.3, height: 4.8, category: "document" },
    { name: "香港特区护照", width: 4.0, height: 5.0, category: "document" },
    { name: "普通证件照", width: 3.3, height: 4.8, category: "document" },
    { name: "机动车行驶证", width: 6.0, height: 8.8, category: "document" },
    { name: "毕业生照", width: 3.3, height: 4.8, category: "document" },
    { name: "在美申请申根签证", width: 3.0, height: 4.0, category: "document" },
    { name: "国家司法考试报名2寸", width: 3.2, height: 4.6, category: "document" },
    
    // Photo Paper Sizes
    { name: "5寸(3R)", width: 12.7, height: 8.9, category: "paper" },
    { name: "6寸(4R)", width: 15.2, height: 10.2, category: "paper" },
    { name: "7寸(5R)", width: 17.8, height: 12.7, category: "paper" },
    { name: "8寸(6R)", width: 20.3, height: 15.2, category: "paper" },
    { name: "10寸(8R)", width: 25.4, height: 20.3, category: "paper" },
    { name: "12寸", width: 25.40, height: 30.48, category: "paper" },
    
    // Other Documents
    { name: "阿根廷签证", width: 4.0, height: 4.0, category: "document" },
    { name: "意大利签证", width: 3.4, height: 4.0, category: "document" },
    
    // Standard Paper Sizes
    { name: "A3", width: 29.7, height: 42.0, category: "paper" },
    { name: "A4", width: 21.0, height: 29.7, category: "paper" },
    { name: "A5", width: 14.8, height: 21.0, category: "paper" },
    { name: "A6", width: 10.5, height: 14.8, category: "paper" },
    { name: "B3", width: 50.0, height: 70.7, category: "paper" },
    { name: "B4", width: 25.0, height: 35.3, category: "paper" },
    { name: "B5", width: 17.6, height: 25.0, category: "paper" },
    { name: "Letter", width: 21.59, height: 27.94, category: "paper" },
    
    // Additional Types
    { name: "日本资格考试报名", width: 2.4, height: 3.0, category: "document" },
    { name: "加拿大签证B", width: 5.0, height: 7.0, category: "document" },
    { name: "结婚证照片", width: 6.0, height: 4.0, category: "document" },
    { name: "赴美非移民签证(备选）", width: 5.0, height: 5.0, category: "document" },
    { name: "3.5x3.0", width: 3.5, height: 3.0, category: "id" },
    { name: "明信片", width: 14.8, height: 10.0, category: "paper" },
    { name: "佳能4x6相纸", width: 13.35, height: 8.9, category: "paper" },
    { name: "2吋半身照", width: 4.2, height: 4.7, category: "id" },
    { name: "某结婚照片", width: 5.0, height: 4.0, category: "document" },
    { name: "Hagaki", width: 10.0, height: 14.8, category: "paper" },
    { name: "大二寸v2", width: 3.5, height: 5.3, category: "id" },
    { name: "结婚登记照2022", width: 5.3, height: 3.5, category: "document" },
    { name: "泰国落地签", width: 4.0, height: 6.0, category: "document" },
    { name: "5.0cm x 5.5cm", width: 5.0, height: 5.5, category: "id" }
];

// Helper functions
function getPhotoTypesByCategory(category) {
    return PHOTO_TYPES.filter(type => type.category === category);
}

function getPhotoTypeByIndex(index) {
    return PHOTO_TYPES[index] || null;
}

function getPhotoTypeByName(name) {
    return PHOTO_TYPES.find(type => type.name === name) || null;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PHOTO_TYPES, getPhotoTypesByCategory, getPhotoTypeByIndex, getPhotoTypeByName };
} 