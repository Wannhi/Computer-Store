import { NavLink } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  LaptopIcon,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  // Monitor,
  Layers,
  X
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface SidebarLink {
  path: string;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  // Define sidebar links
  const links: SidebarLink[] = [
    // { path: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5 " /> },
    { path: "/admin/products", label: "Sản phẩm", icon: <Package className="h-5 w-5" /> },
    // { path: "/categories", label: "Danh mục", icon: <Layers className="h-5 w-5" /> },
    { path: "/admin/orders", label: "Đơn hàng", icon: <ShoppingCart className="h-5 w-5" /> },
    { path: "/admin/customers", label: "Khách hàng", icon: <Users className="h-5 w-5" /> },
    // { path: "/laptops", label: "Laptop", icon: <LaptopIcon className="h-5 w-5" /> },
    // { path: "/monitors", label: "Màn hình", icon: <Monitor className="h-5 w-5" /> },
    // { path: "/admin/settings", label: "Cài đặt", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Sidebar backdrop (mobile) */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900 bg-opacity-30 transition-opacity duration-200 md:hidden ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
      // z-40: z-index: 40
        className={`absolute inset-y-0 left-0 z-30 w-64 transform bg-white p-4 shadow-lg transition-all duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Sidebar header */}
        <div className="mb-6 flex items-center justify-between pr-3 md:pr-0">
          {/* Logo : xóa logo vì 1 trang 1 logo là được  */}
          {/* <NavLink to="/" className="flex items-center gap-2">
            <img
              src="https://khoavang.vn/public/v2/images/default/logo.png"
              alt="Khóa Vàng Logo"
              className="h-8 w-auto"
            />
            <span className="hidden text-lg font-bold text-gray-800 md:inline">
              Khóa Vàng
            </span>
          </NavLink> */}

          {/* Close button for mobile view */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {/* Sidebar links */}
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {link.icon}
              <span className="ml-3">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};
