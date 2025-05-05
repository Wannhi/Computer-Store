import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Laptop, Package, ShoppingCart, Users, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("month");

  // Stats data (mô phỏng)
  const stats = [
    { title: "Tổng sản phẩm", value: "1,234", icon: <Package className="h-6 w-6" />, change: "+12%", changeType: "increase" },
    { title: "Đơn hàng tháng này", value: "156", icon: <ShoppingCart className="h-6 w-6" />, change: "+24%", changeType: "increase" },
    { title: "Khách hàng mới", value: "56", icon: <Users className="h-6 w-6" />, change: "+5%", changeType: "increase" },
    { title: "Doanh thu tháng", value: "120.5M", icon: <DollarSign className="h-6 w-6" />, change: "+18%", changeType: "increase" },
  ];

  // Top selling products (mô phỏng)
  const topProducts = [
    { id: 1, name: "Laptop Dell Precision 7910", category: "Laptop Dell", price: "45.500.000 đ", sales: 35 },
    { id: 2, name: "HP EliteBook 840 G5", category: "Laptop HP", price: "18.900.000 đ", sales: 28 },
    { id: 3, name: "Dell Alienware M16 R1", category: "Laptop Gaming", price: "65.900.000 đ", sales: 24 },
    { id: 4, name: "Laptop HP Victus", category: "Laptop Gaming", price: "22.500.000 đ", sales: 22 },
    { id: 5, name: "Lenovo ThinkPad T15 Gen 2", category: "Laptop Lenovo", price: "17.500.000 đ", sales: 20 },
  ];

  // Recent orders (mô phỏng)
  const recentOrders = [
    { id: "ORD-8723", customer: "Nguyễn Văn A", products: 3, date: "24/03/2025", status: "Hoàn thành", total: "15.900.000 đ" },
    { id: "ORD-8722", customer: "Trần Thị B", products: 1, date: "23/03/2025", status: "Đang xử lý", total: "45.500.000 đ" },
    { id: "ORD-8721", customer: "Lê Văn C", products: 2, date: "23/03/2025", status: "Đang vận chuyển", total: "22.800.000 đ" },
    { id: "ORD-8720", customer: "Phạm Thị D", products: 4, date: "22/03/2025", status: "Hoàn thành", total: "87.300.000 đ" },
    { id: "ORD-8719", customer: "Hoàng Văn E", products: 1, date: "22/03/2025", status: "Hoàn thành", total: "12.500.000 đ" },
  ];

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="flex justify-end gap-2">
          <select
            className="rounded-md border-gray-200 text-sm"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</h3>
                  <p className={`mt-1 flex items-center text-xs ${stat.changeType === "increase" ? "text-emerald-500" : "text-red-500"}`}>
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {stat.change} so với tháng trước
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-3 text-orange-500">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Top selling products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <CardDescription>Top 5 sản phẩm bán chạy nhất tháng này</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-2 pt-3 font-medium">Sản phẩm</th>
                    <th className="pb-2 pt-3 font-medium">Danh mục</th>
                    <th className="pb-2 pt-3 font-medium">Giá</th>
                    <th className="pb-2 pt-3 font-medium text-right">Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.id} className="border-b text-sm">
                      <td className="py-3">{product.name}</td>
                      <td className="py-3">{product.category}</td>
                      <td className="py-3">{product.price}</td>
                      <td className="py-3 text-right">{product.sales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>5 đơn hàng gần đây nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-2 pt-3 font-medium">Mã</th>
                    <th className="pb-2 pt-3 font-medium">Khách hàng</th>
                    <th className="pb-2 pt-3 font-medium">Ngày</th>
                    <th className="pb-2 pt-3 font-medium">Trạng thái</th>
                    <th className="pb-2 pt-3 font-medium text-right">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b text-sm">
                      <td className="py-3 font-medium">{order.id}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">{order.date}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            order.status === "Hoàn thành"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Đang xử lý"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
