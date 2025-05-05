import type React from 'react';
import { Link } from 'react-router-dom';

type Category = {
  id: string;
  name: string;
  count?: number; // Số lượng sản phẩm trong mỗi danh mục
};

interface CategoryFilterProps {
  title: string;
  categories: Category[]; // Đảm bảo truyền vào danh sách các category đúng theo kiểu Category[]
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  title,
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="bg-white rounded shadow-sm p-4 mb-4">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex items-center justify-between p-2 cursor-pointer rounded hover:bg-gray-50 transition-colors ${
              selectedCategory === category.id ? 'bg-light-gray' : ''
            }`}
            onClick={() => onCategorySelect(category.id)} // Khi chọn danh mục
          >
            <Link
              to={`/products/category/${category.id}`} // Dẫn đến trang sản phẩm theo category
              className={`flex-1 text-sm ${
                selectedCategory === category.id ? 'font-medium text-primary' : 'text-gray-700'
              }`}
            >
              {category.name} {/* Hiển thị tên danh mục */}
            </Link>
            {/* Hiển thị số lượng sản phẩm nếu có */}
            {category.count !== undefined && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {category.count}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
