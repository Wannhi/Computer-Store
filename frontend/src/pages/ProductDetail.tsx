import { useState, useEffect } from "react";
import API from "../service/api"; // Import API service
import { useParams } from "react-router-dom";
import ProductImages from "../components/product-detail/ProductImages";
import ProductInfo from "../components/product-detail/ProductInfo";
import ProductSpecifications from "../components/product-detail/ProductSpecifications";
import ProductDescription from "../components/product-detail/ProductDescription";
import ProductRating from "../components/product-detail/ProductRating";
import RelatedProducts from "../components/product-detail/RelatedProducts";
import ViewedProducts from "../components/product-detail/ViewedProducts";
import ProductComments from "../components/product-detail/ProductComments";

interface Product {
  _id: string; // Add the 'id' property
  name: string; // Add the 'name' property
  title: string; // Keep the 'title' property
  price: number; // Keep the 'price' property
  originalPrice: number; // Add the 'originalPrice' property
  discount: number; // Add the 'discount' property
  status: string; // Keep the 'status' property
  viewCount: number; // Add the 'viewCount' property
  commentCount: number; // Add the 'commentCount' property
  stock: number; // Keep the 'stock' property
  category: string; // Keep the 'category' property
  image: string; // Keep the 'image' property
  description: {
    overview: string; // Keep the 'overview' property
    features: string; // Keep the 'features' property
  };
  specs: { label: string; value: string }[]; // Keep the 'specs' property
}

const ProductDetail = () => {
  const { id } = useParams(); // Lấy `id` từ URL
  const [product, setProduct] = useState<Product | null>(null); // Trạng thái để lưu dữ liệu sản phẩm
  const [activeTab, setActiveTab] = useState("description"); // Tab hiện tại
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi

  // Gọi API để lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/products/${id}`);
        const productData = response.data;
  
        // Chuyển đổi specs từ mảng chuỗi thành mảng đối tượng
        const formattedSpecs = productData.specs.map((spec: string) => {
          const [label, value] = spec.split(": "); // Giả sử specs có định dạng "label: value"
          return { label: label || "Thông số", value: value || spec };
        });
  
        setProduct({ ...productData, specs: formattedSpecs });
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [id]);
  
  if (loading) {
    return <div className="text-center py-10">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-10">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm">
          <nav className="flex items-center space-x-1 text-gray-500">
            <a href="/products" className="hover:text-khoavang-primary">Trang chủ</a>
            <span>&gt;</span>
            <a href={`/category/${product.category}`} className="hover:text-khoavang-primary">
              {product.category}
            </a>
            <span>&gt;</span>
            <span className="text-gray-600">{product.title}</span>
          </nav>
        </div>

        {/* Product Title */}
        <h1 className="text-2xl font-bold mb-4 text-khoavang-dark">{product.title}</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Product Images */}
          <div className="md:w-1/2">
            <ProductImages images={[product.image]} thumbnails={[]} />
          </div>

          {/* Right Column - Product Info */}
          <div className="md:w-1/2">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Tabs Content */}
        <div className="bg-white rounded-lg shadow-sm mt-8 p-6">
          <div className="border-b mb-6">
            <ul className="flex space-x-8">
              <li
                className={`pb-2 px-1 cursor-pointer ${
                  activeTab === "description"
                    ? "border-b-2 border-khoavang-primary text-khoavang-primary font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Mô tả chi tiết
              </li>
              <li
                className={`pb-2 px-1 cursor-pointer ${
                  activeTab === "specs"
                    ? "border-b-2 border-khoavang-primary text-khoavang-primary font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("specs")}
                
              >
                Thông số kỹ thuật
              </li>
              {/* <li
                className={`pb-2 px-1 cursor-pointer ${
                  activeTab === "rating"
                    ? "border-b-2 border-khoavang-primary text-khoavang-primary font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("rating")}
              >
                Đánh giá {product.title}
              </li> */}
            </ul>
          </div>

          {activeTab === "description" && (
            <ProductDescription
              description={product.description.overview}
              longDescription={product.description.features}
            />
          )}

          {activeTab === "specs" && (
            <ProductSpecifications specifications={product.specs} />
          )}

          {/* {activeTab === "rating" && <ProductRating product={product} />} */}
        </div>

        {/* Product Comments */}
        <div className="bg-white rounded-lg shadow-sm mt-8 p-6">
          <ProductComments productId= {product._id} comments={[]} />
        </div>

        {/* Related Products */}
        {/* <div className="mt-8">
          <RelatedProducts products={[]} />
        </div> */}

        {/* Viewed Products */}
        {/* <div className="mt-8">
          <ViewedProducts products={[]} />
        </div> */}
      </div>
    </div>
  );
};

export default ProductDetail;