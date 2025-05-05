import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Edit, Trash2, UserPlusIcon, ChevronsLeft, ChevronsRight } from "lucide-react";
import {XMarkIcon} from "@heroicons/react/24/outline";
import API from "../service/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", address: "" });
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const res = await API.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong headers
        },
      });
      console.log("Dữ liệu API trả về:", res.data);

      if (Array.isArray(res.data)) {
        setCustomers(res.data);
      } else {
        console.error("Dữ liệu không đúng định dạng:", res.data);
        setCustomers([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
      setCustomers([]);
    }
  };

  // Open edit modal with customer data
  const handleOpenEditModal = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase()) ||
    customer.phone.includes(search)
  );

  // Thêm tính toán phân trang
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCustomers.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  

  // Handle form input change for editing customer
  const handleEditCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!currentCustomer) return;

    const { name, value } = e.target;
    setCurrentCustomer({ ...currentCustomer, [name]: value });
  };

  const handleDeleteCustomer = async (id: string) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    try {
      await API.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong headers
        },
      });
      setCustomers(customers.filter((customer) => customer._id !== id));
      setIsDeleteModalOpen(false); // Đóng modal sau khi xóa xong
    } catch (error) {
      console.error("Lỗi khi xóa khách hàng:", error);
    }
  };

  // Update existing customer
  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!currentCustomer) return;
  
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
  
    try {
      // Gửi request cập nhật lên backend
      await API.put(`/users/${currentCustomer._id}`, currentCustomer, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong headers
          "Content-Type": "application/json",
        },
      });
  
      // Cập nhật lại danh sách customers trên frontend
      setCustomers(
        customers.map((c) =>
          c._id === currentCustomer._id ? currentCustomer : c
        )
      );
  
      setIsEditModalOpen(false); // Đóng modal sau khi cập nhật thành công
    } catch (error) {
      console.error("Lỗi khi cập nhật khách hàng:", error);
    }
  };

  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách khách hàng</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-96"
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="p-3">TÊN KHÁCH HÀNG</th>
              <th className="p-3">EMAIL</th>
              <th className="p-3">SỐ ĐIỆN THOẠI</th>
              <th className="p-3">ĐỊA CHỈ</th>
              <th className="p-3">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-[200px]">{customer.address}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenEditModal(customer)}
                      className="mr-3 text-indigo-600 hover:text-indigo-900"
                      title="Sửa"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(customer)}
                      className="text-red-600 hover:text-red-900"
                      title="Xóa"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {totalItems > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-gray-500">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, totalItems)} trên {totalItems} đơn hàng
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            
            {/* Hiển thị các số trang */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className="text-black"
                >
                  {page}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
          
          {/* Dropdown chọn số đơn hàng mỗi trang */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Đơn hàng mỗi trang:</span>
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

      
      {/* Edit Customer Modal */}
      {isEditModalOpen && currentCustomer && (
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
                            Chỉnh sửa thông tin khách hàng
                          </h3>
                          <form onSubmit={handleUpdateCustomer} className="mt-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="sm:col-span-2">
                                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                                  Họ tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  id="edit-name"
                                  name="name"
                                  value={currentCustomer.name}
                                  onChange={handleEditCustomerChange}
                                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                                  Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="email"
                                  id="edit-email"
                                  name="email"
                                  value={currentCustomer.email}
                                  onChange={handleEditCustomerChange}
                                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                                  required
                                />
                              </div>
                              <div>
                          <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700">
                            Số điện thoại <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            id="edit-phone"
                            name="phone"
                            value={currentCustomer.phone}
                            onChange={handleEditCustomerChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                            required
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700">
                            Địa chỉ <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="edit-address"
                            name="address"
                            value={currentCustomer.address}
                            onChange={handleEditCustomerChange}
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                            required
                          ></textarea>
                        </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-600 sm:ml-3 sm:w-auto"
                              >
                                Lưu thay đổi
                              </button>
                              <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                onClick={() => setIsEditModalOpen(false)}
                              >
                                Hủy
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentCustomer && (
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
                      onClick={() => handleOpenDeleteModal(currentCustomer)}
                      className="text-red-600 hover:text-red-900"
                      title="Xóa"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Xóa khách hàng
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa khách hàng {currentCustomer.name}? Hành động này không thể khôi phục.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  onClick={() => handleDeleteCustomer(currentCustomer._id)}
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
    </div>
  );
}
