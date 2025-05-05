  import type React from 'react';
  import { useState, useEffect } from 'react';
  import { useParams } from 'react-router-dom';
  import { FunnelIcon } from '@heroicons/react/24/outline';
  import ProductCard, { type ProductProps } from '../components/ProductCard1';
  import CategoryFilter from '../components/CategoryFilter1';
  import API from '../service/api';
  import { set } from 'react-hook-form';
  import { Button } from '../components/ui/button';

  // Sorting options
  const sortOptions = [
    { id: 'popularity', name: 'Phổ biến nhất' },
    { id: 'newest', name: 'Mới nhất' },
    { id: 'price-asc', name: 'Giá thấp đến cao' },
    { id: 'price-desc', name: 'Giá cao đến thấp' },
  ];

  const ProductsPage: React.FC = () => {
    const { category } = useParams<{ category?: string }>();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(category?.toLowerCase() || null);
    const [selectedSort, setSelectedSort] = useState('popularity');
    const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [laptopBrands, setLaptopBrands] = useState<{ id: string, name: string }[]>([]);

    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    
    // Tính toán chỉ số sản phẩm
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Fetch products and brands from MongoDB
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch products
          const { data: products } = await API.get('/products');
          setAllProducts(products);
          setFilteredProducts(products);

          // Extract unique laptop brands from products
          const brands = products.reduce((acc: { id: string, name: string }[], product: ProductProps) => {
            const categoryId = product.category.toLowerCase(); // Chuyển thành chữ thường
            if (product.category && !acc.some(brand => brand.id === categoryId)) {
              acc.push({ id: categoryId, name: product.category });
            }
            return acc;
          }, [] as { id: string, name: string }[]);
          
          setLaptopBrands(brands);


        } catch (error) {
          console.error('Error fetching data', error);
        }
      };
      
      fetchData();
    }, []);

    // Apply filters and sorting when selections change
    useEffect(() => {
      let filtered = [...allProducts];

      // Apply category filter if selected
      if (selectedCategory) {
        filtered = filtered.filter(product => product.category.toLowerCase() === selectedCategory);
      }

      // Apply sorting
      filtered = sorted(filtered, selectedSort);

      setFilteredProducts(filtered);
      setCurrentPage(1); // Reset về trang đầu tiên khi filter thay đổi
    }, [selectedCategory, selectedSort, allProducts]);

    

    // Handle category change from URL params
    useEffect(() => {
      if (category) {
        setSelectedCategory(category);
      }
    }, [category]);

    // Function to sort products
    const sorted = (products: ProductProps[], sortBy: string): ProductProps[] => {
      const productsCopy = [...products];

      switch (sortBy) {
        case 'price-asc':
          return productsCopy.sort((a, b) => a.price - b.price);
        case 'price-desc':
          return productsCopy.sort((a, b) => b.price - a.price);
        default:
          // Default to popularity (could be some other metric)
          return productsCopy;
      }
    };

    // Handler for category selection
    const handleCategorySelect = (categoryId: string) => {
      setSelectedCategory(categoryId.toLowerCase());
    };

    // Handler for pagination
    const paginate = (pageNumber: number) => {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    

    return (
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-600 mb-6">
            <span><a href="/products">Trang chủ</a></span> {' > '}
            <span className="font-medium text-gray-800">
              {laptopBrands.find(brand => brand.id === selectedCategory)?.name || 'Tất cả sản phẩm'}
            </span>
          </div>

          {/* Page title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            {laptopBrands.find(brand => brand.id === selectedCategory)?.name || 'Tất cả sản phẩm'}
          </h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar filters for desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <CategoryFilter
                title="Chọn theo tiêu chí:"
                categories={laptopBrands.map((brand) => ({
                  ...brand,
                  id: brand.name.toLowerCase(), // Chuyển đổi name thành chữ thường
                }))}
                selectedCategory={selectedCategory ? selectedCategory.toLowerCase() : null} // Chuyển đổi selectedCategory thành chữ thường
                onCategorySelect={(categoryId) => handleCategorySelect(categoryId.toLowerCase())} // Chuyển đổi categoryId thành chữ thường
              />
              {/* Additional filters could go here */}
            </div>

            {/* Main content */}
            <div className="flex-1">
              {/* Featured products section */}
              <div className="bg-white rounded shadow-sm p-4 mb-6">
                <h2 className="text-xl font-semibold text-primary border-b pb-2 mb-4">Sản Phẩm Nổi Bật</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.slice(0, 6).map((product) => (
                    <ProductCard key={product._id} {...product} />
                  ))}
                </div>
              </div>

              {/* Product listing */}
              <div className="bg-white rounded shadow-sm p-4">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 mb-4 border-b">
                  <div className="text-sm text-gray-600 mb-2 md:mb-0">
                    Hiển thị {filteredProducts.length} sản phẩm
                    {filteredProducts.length > itemsPerPage && (
                      <span> (trang {currentPage}/{totalPages})</span>
                    )}
                  </div>

                  <div className="flex w-full md:w-auto">
                    {/* Mobile filter button */}
                    <button
                      className="lg:hidden flex items-center mr-4 text-sm text-gray-700"
                      onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    >
                      <FunnelIcon className="w-4 h-4 mr-1" />
                      <span>Lọc</span>
                    </button>

                    {/* Sort dropdown */}
                    <div className="relative w-full md:w-auto">
                      <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile filters (hidden on desktop) */}
                {mobileFiltersOpen && (
                  <div className="lg:hidden mb-4 border-b pb-4">
                    <CategoryFilter
                      title="Chọn theo tiêu chí:"
                      categories={laptopBrands}
                      selectedCategory={selectedCategory}
                      onCategorySelect={handleCategorySelect}
                    />
                  </div>
                )}

                {/* Product grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentItems.map((product) => (
                    <ProductCard key={product._id} {...product} />
                  ))}
                </div>

                {filteredProducts.length > itemsPerPage && (
                  <div className="flex items-center justify-between px-6 py-4 border-t">
                    <div className="text-sm text-gray-500">
                      Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} trên {filteredProducts.length} sản phẩm
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Trước
                      </Button>
                      
                      {/* Hiển thị các số trang */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => paginate(pageNumber)}
                            className="text-black"
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Sau
                      </Button>
                    </div>
                    
                    {/* Dropdown chọn số sản phẩm mỗi trang */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Sản phẩm mỗi trang:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1); // Reset về trang đầu khi thay đổi số lượng
                        }}
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                      >
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="36">36</option>
                        <option value="48">48</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ProductsPage;
