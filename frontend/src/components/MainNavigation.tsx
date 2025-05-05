import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import API from "../service/api";

interface SubCategory {
  id: string;
  title: string;
  link: string;
}

interface CategoryGroup {
  groupName: string;
  subcategories: SubCategory[];
}

interface MainNavigationProps {
  isMenuOpen: boolean;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ isMenuOpen }) => {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [openSubMenuId, setOpenSubMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get("/products"); // Thay URL bằng API thực tế
        const products: { category: string }[] = response.data;

        const uniqueCategories = Array.from(
          new Set(products.map((product) => product.category))
        );

        // Nhóm các category vào từng nhóm
        const groups: { [key: string]: string[] } = {
          Laptop: [],
          "Máy tính để bàn": [],
          Macbook: []
        };

        uniqueCategories.forEach((cat) => {
          if (/laptop/i.test(cat)) groups["Laptop"].push(cat);
          else if (/máy tính/i.test(cat)) groups["Máy tính để bàn"].push(cat);
          else if (/mac/i.test(cat)) groups["Macbook"].push(cat);
        });

        const structured: CategoryGroup[] = Object.entries(groups).map(
          ([groupName, subcats]) => ({
            groupName,
            subcategories: subcats.map((cat) => ({
              id: cat.toLowerCase().replace(/\s+/g, "-"),
              title: cat,
              link: `/products/category/${encodeURIComponent(cat.toLowerCase())}`,
            })),
          })
        );

        setCategoryGroups(structured);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubMenuToggle = (id: string) => {
    setOpenSubMenuId(openSubMenuId === id ? null : id);
  };

  return (
    <nav className={`bg-[#32343a] text-white relative z-40`}>
      <div className="container mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          {categoryGroups.map((group) => (
            <div key={group.groupName} className="group relative">
              <button
                className="flex items-center py-3 px-4 hover:bg-yellow-500 hover:text-black transition-colors"
              >
                {group.groupName}
                {group.subcategories.length > 0 && (
                  <FaChevronDown className="ml-1 text-xs" />
                )}
              </button>

              {/* Submenu (desktop) */}
              {group.subcategories.length > 0 && (
                <div className="absolute hidden group-hover:block bg-[#3b3d45] shadow-lg">
                  {group.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      to={sub.link}
                      className="block px-4 py-2 hover:bg-yellow-400 hover:text-black whitespace-nowrap"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-[#32343a] shadow-lg transition-transform duration-300 ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {categoryGroups.map((group) => (
            <div key={group.groupName}>
              <div
                className="flex items-center justify-between py-3 px-4 border-b border-gray-700"
                onClick={() => handleSubMenuToggle(group.groupName)}
              >
                <span>{group.groupName}</span>
                {group.subcategories.length > 0 && <FaChevronDown className="ml-1 text-xs" />}
              </div>

              {openSubMenuId === group.groupName &&
                group.subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    to={sub.link}
                    className="block px-6 py-2 text-sm text-white hover:bg-yellow-400 hover:text-black"
                  >
                    {sub.title}
                  </Link>
                ))}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
