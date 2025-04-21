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
} from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
  className?: string;
  isOpen: boolean; // Prop to control sidebar visibility
}

export default function Sidebar({ className = "", isOpen }: SidebarProps) {
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

  return (
    <div
      className={`bg-gray-800 text-white flex flex-col sticky top-0 h-screen transition-all duration-300 ${
        isOpen ? "w-64" : "hidden"
      } ${className}`}
      id="sidebar"
    >
      <ul className="mt-6 flex-1">
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
    </div>
  );
}
