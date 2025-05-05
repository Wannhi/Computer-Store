
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Search, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import API from "../service/api";

type OrderStatus = "Đang xử lý" | "Đã giao" | "Đang vận chuyển" | "Đã hủy";

interface Order {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  items: {
    productId: {
      title: string;
      price: number;
    };
    quantity: number;
  }[];
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    email: string;
    address: string;
    note: string;
  };
  orderDate: string;
}



export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Tính toán đơn hàng cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Hàm chuyển trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Lấy danh sách đơn hàng từ API
  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders");
      const data = Array.isArray(response.data.orders) ? response.data.orders : [];
      setOrders(data);
      console.log("Danh sách đơn hàng:", data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Lọc đơn hàng khi thay đổi orders, activeTab hoặc searchTerm
  useEffect(() => {
    let filtered = [...orders];

    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.status === activeTab);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.shippingAddress.phone.includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, activeTab, searchTerm]);

  // Màu badge theo trạng thái đơn hàng
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Đang xử lý":
        return "bg-blue-100 text-blue-700";
      case "Đã giao":
        return "bg-yellow-100 text-yellow-700";
      case "Đang vận chuyển":
        return "bg-green-100 text-green-700";
      case "Đã hủy":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const OrderDetailDialog = ({ order }: { order: Order }) => {
    // Tính tổng tiền hàng
    const totalItemPrice = order.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    // Phí vận chuyển
    const shippingFee = 30000;

    // Tổng thanh toán
    const totalPayment = totalItemPrice + shippingFee;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{order._id}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Thông tin đơn hàng</h3>
                <p className="text-sm mb-1">
                  <span className="text-gray-500">Mã đơn hàng:</span> {order._id}
                </p>
                <p className="text-sm mb-1">
                  <span className="text-gray-500">Ngày đặt:</span>{" "}
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p className="text-sm mb-1">
                  <span className="text-gray-500">Trạng thái:</span>{" "}
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-sm mb-1">
                  <span className="text-gray-500">Phương thức thanh toán:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p className="text-sm mb-1">
                  <span className="text-gray-500">Tổng tiền:</span>{" "}
                  {order.totalPrice.toLocaleString()} đ
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
                <p className="text-sm mb-1">
                  <span className="text-gray-500">Tên:</span> {order.userId.name}
                </p>
                <p className="text-sm mb-1">
                  <span className="text-gray-500">Email:</span> {order.userId.email}
                </p>
                <p className="text-sm mb-1">
                  <span className="text-gray-500">Số điện thoại:</span>{" "}
                  {order.shippingAddress.phone}
                </p>
                <p className="text-sm mb-1">
                  <span className="text-gray-500">Địa chỉ:</span>{" "}
                  {order.shippingAddress.address}
                </p>
                <p className="text-sm mb-1">
                  <span className="text-gray-500">Ghi chú:</span>{" "}
                  {order.shippingAddress.note || "Không có"}
                </p>
              </div>
            </div>
  
            <div className="mt-4">
              <h3 className="font-medium mb-2">Sản phẩm trong đơn hàng</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">STT</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="text-right">Số lượng</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.productId.title}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {item.productId.price.toLocaleString()} đ
                        </TableCell>
                        <TableCell className="text-right">
                          {(item.productId.price * item.quantity).toLocaleString()} đ
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end items-center mt-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">
                  Tổng tiền hàng: <span className="font-medium text-black">{totalItemPrice.toLocaleString()} đ</span>
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Phí vận chuyển: <span className="font-medium text-black">{shippingFee.toLocaleString()} đ</span>
                </p>
                <p className="text-lg font-bold">
                  Tổng thanh toán: <span className="text-orange-600">{totalPayment.toLocaleString()} đ</span>
                </p>
              </div>
            </div>

            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Tìm kiếm đơn hàng, khách hàng..."
            className="w-full pl-8 md:w-[300px]"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
            }}
          />
        </div>
      </div>

      <Tabs value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val);
          setCurrentPage(1); // Reset về trang đầu khi chuyển tab
        }} 
        className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="Đang xử lý">Đang xử lý</TabsTrigger>
          <TabsTrigger value="Đang vận chuyển">Đang vận chuyển</TabsTrigger>
          <TabsTrigger value="Đã giao">Đã giao</TabsTrigger>
          <TabsTrigger value="Đã hủy">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Mã ĐH</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order._id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.userId.name}</p>
                          <p className="text-xs text-gray-500">{order.userId.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{order.items.length} sản phẩm</TableCell>
                      <TableCell>{order.totalPrice.toLocaleString()} đ</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <OrderDetailDialog order={order} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                      Không có đơn hàng nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {filteredOrders.length > itemsPerPage && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-500">
                  Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} trên {filteredOrders.length} đơn hàng
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
        </TabsContent>
      </Tabs>
    </>
  );
}
