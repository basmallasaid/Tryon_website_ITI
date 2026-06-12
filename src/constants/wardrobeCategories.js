// src/constants/wardrobeCategories.js

export const MALE_CATEGORIES = [
    'All',
    'Top',
    'Shirt',
    'T-Shirt',
    'Bottom',
    'Jeans',
    'Short',
    'Jacket',
    'Suit',
    'Shoes',
    'Accessories',
  ];
  
  export const FEMALE_CATEGORIES = [
    'All',
    'Top',
    'Dress',
    'Skirt',
    'Bottom',
    'Jeans',
    'Short',
    'Jacket',
    'Abayas',
    'Shoes',
    'Bag',
    'Accessories',
  ];
  
  export const UNISEX_CATEGORIES = [
    'All',
    'Top',
    'Bottom',
    'Jeans',
    'Short',
    'Jacket',
    'Shoes',
    'Accessories',
  ];
  
  /**
   * تعيد قائمة التصنيفات بناءً على النوع (Gender)
   * @param {string|null} gender - القيمة المتوقعة 'male' أو 'female' أو 'unisex'
   */
  export const getCategoriesByGender = (gender) => {
    if (!gender) return UNISEX_CATEGORIES;
    
    // تحويل القيمة لـ lowercase للتأكد من مطابقتها مهما كان شكلها من الباك إند
    const normalizedGender = gender.toLowerCase();
  
    if (normalizedGender === 'female') {
      return FEMALE_CATEGORIES;
    } else if (normalizedGender === 'male') {
      return MALE_CATEGORIES;
    } else {
      return UNISEX_CATEGORIES;
    }
  };