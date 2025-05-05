import { useState, useEffect } from "react";
import API from "../service/api";
import {XMarkIcon} from "@heroicons/react/24/outline";
import imageCompression from "browser-image-compression";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Search, Plus, Edit, Trash2, Eye, FilterX } from "lucide-react";

interface Product {
  _id: string;
  title: string;
  specs: string[];
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  image: string;
  stock: number;
  category: string;
  description: string | { [key: string]: string };
  status: "Còn hàng" | "Sắp hết" | "Hết hàng";
}

export default function Products() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Khai báo cho modal Thêm sản phẩm
  const [newProduct, setNewProduct] = useState<Product>({
    _id: "",
    title: "",
    specs: [],
    price: 0,
    stock: 0,
    category: "",
    description: {},
    status: "Còn hàng",
    image: "",
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Số sản phẩm mỗi trang

  // Tính toán sản phẩm cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  

  // Hàm chuyển trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token không tồn tại trong localStorage");
          setLoading(false);
          return;
        }

        const res = await API.get("/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error("Dữ liệu không đúng định dạng:", res.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hàm mở modal chỉnh sửa sản phẩm
  const handleOpenEditModal = (product: Product) => {
    setCurrentProduct(product);
    setIsEditModalOpen(true);
  };

  // Hàm mở modal xóa sản phẩm
  const handleOpenDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  
  
  // Hàm mở modal thêm sản phẩm
  const handleOpenAddModal = () => {
    setNewProduct({
      _id: "",
      title: "",
      specs: [],
      price: 0,
      stock: 0,
      category: "",
      description: {},
      status: "" as "Còn hàng" | "Sắp hết" | "Hết hàng", // Explicitly cast to the union type
      image: "",
    });
    setIsAddModalOpen(true);
  };
  
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase()) ||
    product.specs.some(spec => spec.toLowerCase().includes(search.toLowerCase())) ||
    product.price.toString().toLowerCase().includes(search.toLowerCase())
  );
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handle form input change for editing product
  const handleEditProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!currentProduct) return;

    const { name, value } = e.target;

    // Tự động cập nhật trạng thái dựa trên stock
    if (name === "stock") {
      const stockValue = parseInt(value, 10);
      const updatedStatus =
        stockValue > 10 ? "Còn hàng" : stockValue > 0 ? "Sắp hết" : "Hết hàng";

      setCurrentProduct({ ...currentProduct, [name]: stockValue, status: updatedStatus });
    } else {
      setCurrentProduct({ ...currentProduct, [name]: value });
    }
  };

  // Handle form input change for adding new product
  const handleAddProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name === "stock") {
      const stockValue = parseInt(value, 10) || 0; // Đảm bảo stockValue luôn là số
      const updatedStatus =
        stockValue > 10 ? "Còn hàng" : stockValue > 0 ? "Sắp hết" : "Hết hàng";
  
      setNewProduct((prev) => ({
        ...prev,
        [name]: stockValue,
        status: updatedStatus, // Tự động cập nhật trạng thái
      }));
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleAddProduct = async () => {
    const token = localStorage.getItem("token");
  
    // Tính lại status trước khi gửi
    const stock = newProduct.stock;
    const updatedStatus =
      stock > 10 ? "Còn hàng" : stock > 0 ? "Sắp hết" : "Hết hàng";
  
    const productToAdd = {
      ...newProduct,
      status: updatedStatus,
    };
    console.log("🧪 Đang thêm sản phẩm:", productToAdd);
    try {
      const res = await API.post("/products", productToAdd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Dùng res.data từ backend để tránh lỗi state chưa cập nhật kịp
      setProducts([...products, res.data]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await API.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product._id !== id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };


  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentProduct) return;

    const token = localStorage.getItem("token");

    try {
      await API.put(`/products/${currentProduct._id}`, currentProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setProducts(
        products.map((p) => (p._id === currentProduct._id ? currentProduct : p))
      );

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
  };

  // Hàm xử lý khi người dùng chọn ảnh trong modal chỉnh sửa

  const handleEditImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentProduct) {
      try {
        // Cấu hình nén ảnh
        const options = {
          maxSizeMB: 1, // Giới hạn kích thước ảnh sau khi nén (1MB)
          maxWidthOrHeight: 1280, // Giới hạn chiều rộng hoặc chiều cao
          useWebWorker: true, // Sử dụng Web Worker để cải thiện hiệu suất
        };

        // Nén ảnh
        const compressedFile = await imageCompression(file, options);

        console.log("Kích thước ảnh gốc:", file.size / 1024 / 1024, "MB");
        console.log("Kích thước ảnh sau khi nén:", compressedFile.size / 1024 / 1024, "MB");

        // Chuyển ảnh đã nén sang base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setCurrentProduct((prev) =>
            prev ? { ...prev, image: reader.result as string } : null
          );
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Lỗi khi nén ảnh:", error);
      }
    }
  };

  // Hàm xử lý khi người dùng chọn ảnh
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Cấu hình nén ảnh
        const options = {
          maxSizeMB: 1, // Giới hạn kích thước ảnh sau khi nén (1MB)
          maxWidthOrHeight: 1280, // Giới hạn chiều rộng hoặc chiều cao
          useWebWorker: true, // Sử dụng Web Worker để cải thiện hiệu suất
        };

        // Nén ảnh
        const compressedFile = await imageCompression(file, options);

        console.log("Kích thước ảnh gốc:", file.size / 1024 / 1024, "MB");
        console.log("Kích thước ảnh sau khi nén:", compressedFile.size / 1024 / 1024, "MB");

        // Chuyển ảnh đã nén sang base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewProduct((prev) => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Lỗi khi nén ảnh:", error);
      }
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-8 pr-4"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
              {/* Nút mở modal */}
              <Button onClick={() => handleOpenAddModal()} className="bg-orange-100 text-orange-600">

                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button> 
        </div>
      </div>

      {search && filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <FilterX className="mb-3 h-10 w-10 text-gray-400" />
          <h3 className="mb-1 text-lg font-medium">Không tìm thấy sản phẩm</h3>
          <p className="text-sm text-gray-500">
            Không có sản phẩm nào phù hợp với "{search}"
          </p>
          <Button variant="ghost" className="mt-3" onClick={() => setSearch("")}>
            Xóa bộ lọc
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">{product._id}</TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price.toLocaleString()} đ</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                  <Badge
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      product.stock > 10 ? "bg-green-100 text-green-700" : 
                      product.stock > 0 ? "bg-yellow-100 text-yellow-700" : 
                      product.stock === 0 ? "bg-red-100 text-red-700" : 
                      "bg-gray-100 text-gray-700" // Mặc định nếu không khớp
                    }`}
                  >
                    {product.stock > 10 ? "Còn hàng" : 
                    product.stock > 0 ? "Sắp hết" : 
                    product.stock === 0 ? "Hết hàng" : 
                    "Không xác định"}
                  </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditModal(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDeleteModal(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            
          </Table>
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
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}


      {/* Modal Delete */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsDeleteModalOpen(false)}
            ></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <button
                      onClick={() => handleOpenDeleteModal(productToDelete)}
                      className="text-red-600 hover:text-red-900"
                      title="Xóa"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Xóa sản phẩm
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete.title}"? Hành động này không thể khôi phục.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  onClick={() => productToDelete && handleDeleteProduct(productToDelete._id)}
                >
                  Xóa
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {isEditModalOpen && currentProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsEditModalOpen(false)}
            ></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <span className="sr-only">Đóng</span>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Chỉnh sửa thông tin sản phẩm
                    </h3>
                    <form onSubmit={handleUpdateProduct} className="mt-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
                            Tên sản phẩm <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="edit-title"
                            name="title"
                            value={currentProduct.title}
                            onChange={handleEditProductChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">
                            Danh mục <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="edit-category"
                            name="category"
                            value={currentProduct.category}
                            onChange={handleEditProductChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">
                            Giá <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="edit-price"
                            name="price"
                            value={currentProduct.price}
                            onChange={handleEditProductChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="edit-stock" className="block text-sm font-medium text-gray-700">
                            Số lượng <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="edit-stock"
                            name="stock"
                            value={currentProduct.stock}
                            onChange={handleEditProductChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                            Trạng thái
                          </label>
                          <select
                            id="edit-status"
                            name="status"
                            value={currentProduct.status}
                            onChange={handleEditProductChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                          >
                            <option value="Còn hàng">Còn hàng</option>
                            <option value="Sắp hết">Sắp hết</option>
                            <option value="Hết hàng">Hết hàng</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700">
                            Ảnh sản phẩm
                          </label>
                          <input
                            type="file"
                            id="edit-image"
                            name="image"
                            accept="image/*"
                            onChange={handleEditImageUpload}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                          />
                        </div>

                        {/* Hiển thị ảnh hiện tại nếu đã có */}
                        {currentProduct?.image && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">Ảnh hiện tại:</p>
                            <img src={currentProduct.image} alt="Ảnh sản phẩm" className="mt-1 h-32 w-32 rounded-md border" />
                          </div>
                        )}

                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditModalOpen(false)}
                          className="bg-gray-100 text-gray-600"
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          className="bg-green-600 text-white"
                        >
                          Lưu thay đổi
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Modal Thêm Sản Phẩm */}
      {isAddModalOpen && newProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsAddModalOpen(false)}
            ></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
            
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    <span className="sr-only">Đóng</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
              </div>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Thêm sản phẩm mới
                    </h3>
                    <form onSubmit={handleAddProduct} className="mt-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Tên sản phẩm <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={newProduct.title}
                            onChange={handleAddProductChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Danh mục <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="category"
                            name="category"
                            value={newProduct.category}
                            onChange={handleAddProductChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Giá <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            value={newProduct.price}
                            onChange={handleAddProductChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                            Số lượng <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={newProduct.stock}
                            onChange={handleAddProductChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                            Trạng thái
                          </label>
                          <select
                            id="edit-status"
                            name="status"
                            value={newProduct.status}
                            onChange={handleEditProductChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                            aria-readonly
                          >
                            <option value="Còn hàng">Còn hàng</option>
                            <option value="Sắp hết">Sắp hết</option>
                            <option value="Hết hàng">Hết hàng</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Ảnh sản phẩm <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                            required
                          />
                        </div>

                        {/* Hiển thị ảnh xem trước nếu đã chọn */}
                        {newProduct.image && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">Ảnh xem trước:</p>
                            <img src={newProduct.image} alt="Ảnh sản phẩm" className="mt-1 h-32 w-32 rounded-md border" />
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex justify-end gap-3">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-gray-300 text-gray-900 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-400 sm:w-auto"
                          onClick={() => setIsAddModalOpen(false)}
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-green-600 text-white text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-green-500 sm:w-auto"
                        >
                          Lưu sản phẩm
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
