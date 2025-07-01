import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Header({ toggleSidebar }) {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center sticky top-0 z-10 w-full">
      {/* Left Section: Logo and Menu Icon */}
      <div className="flex items-center">
        <button className="mr-4 focus:outline-none" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <div className="text-xl font-bold">INSA ERP</div>
      </div>

      {/* Right Section: Search and Profile */}
      <div className="flex items-center">
        {/* Search Input */}
        <div className="relative mr-4">
          <input
            className="border rounded px-4 py-2 pl-10 text-gray-800"
            placeholder="Search"
            type="text"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-3 text-gray-500"
          />
        </div>

        {/* User Profile Picture */}
        <img
          alt="User profile picture"
          className="w-10 h-10 rounded-full"
          src="/user.PNG"
        />
      </div>
    </header>
  );
}
