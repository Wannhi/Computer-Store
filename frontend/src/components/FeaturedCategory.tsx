import { Link } from 'react-router-dom';

interface CategoryProps {
  category: {
    id: number;
    title: string;
    icon: string;
    link: string;
  };
}

const FeaturedCategory: React.FC<CategoryProps> = ({ category }) => {
  return (
    <Link
      to={category.link}
      className="bg-white rounded shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center justify-center text-center"
    >
      <img
        src={category.icon}
        alt={category.title}
        className="w-16 h-16 mb-4"
      />
      <h3 className="font-bold text-gray-800">{category.title}</h3>
    </Link>
  );
};

export default FeaturedCategory;
