import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faMoneyCheckAlt,
  faBoxes,
  faSearch,
  faUsers,
  faUser,
  faFileInvoiceDollar,
  faFileAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface SidebarProps {
  className?: string;
  isOpen: boolean;
}

export default function Sidebar({ className = "", isOpen }: SidebarProps) {
  const router = useRouter();
  const menuItems = [
    { icon: faTachometerAlt, label: "Dashboard" },
    { icon: faMoneyCheckAlt, label: "Payroll" },
    { icon: faBoxes, label: "Material Management" },
    { icon: faSearch, label: "Lookup Manager" },
    { icon: faUsers, label: "HR Management" },
    { icon: faUser, label: "Profile" },
    { icon: faFileInvoiceDollar, label: "Internal Revenue Finance" },
    { icon: faFileAlt, label: "Pages" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div
      className={`bg-gray-800 text-white flex flex-col sticky top-0 h-screen transition-all duration-300 ${
        isOpen ? "w-64" : "hidden"
      } ${className}`}
      id="sidebar"
    >
      <ul className="mt-6">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          >
            <FontAwesomeIcon icon={item.icon} className="mr-2" />
            {item.label}
          </li>
        ))}
      </ul>
      <div className="mt-32 mb-2 px-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 py-1 px-2 rounded text-sm font-medium transition-colors duration-200 bg-transparent"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
}
