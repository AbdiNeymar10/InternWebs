"use client";
import { useState, useEffect } from "react";
import { authFetch } from "@/utils/authFetch";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiX,
  FiChevronDown,
  FiBriefcase,
  FiRefreshCw,
} from "react-icons/fi";

interface Address {
  id?: number;
  employeeId: string;
  addressType: number;
  addressTypeDetails?: {
    id: number;
    addressType: string;
    description: string;
  };
  wereda: string;
  kebele: string;
  telephoneOffice: string;
  email: string;
  poBox: string;
  mobileNumber: string;
  zone: string;
  kifleketema: string;
  teleHome: string;
  houseNo: string;
  region: string;
  regionDetails?: {
    id: number;
    regionName: string;
    description: string;
  };
}

interface Region {
  id: number;
  regionName: string;
  description: string;
}

interface HrLuAddressTypeDTO {
  id: number;
  addressType: string;
  description?: string;
}

interface CountryCode {
  code: string;
  dialCode: string;
  flag: string;
}

const countryCodes: CountryCode[] = [
  { code: "ET", dialCode: "+251", flag: "🇪🇹" },
  { code: "US", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { code: "BR", dialCode: "+55", flag: "🇧🇷" },
  { code: "CN", dialCode: "+86", flag: "🇨🇳" },
  { code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { code: "MX", dialCode: "+52", flag: "🇲🇽" },
  { code: "ZA", dialCode: "+27", flag: "🇿🇦" },
];

export default function AddressPage({ empId }: { empId: string }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [regionsLoading, setRegionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [addressTypes, setAddressTypes] = useState<HrLuAddressTypeDTO[]>([]);
  const [addressTypesLoading, setAddressTypesLoading] = useState(false);

  const fetchAddressTypes = async () => {
    try {
      setAddressTypesLoading(true);
      const response = await authFetch(
        "http://localhost:8080/api/hr-lu-address-type",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      if (!data || data.length === 0) {
        setAddressTypes([]);
        return;
      }

      const validTypes = data.map((type: HrLuAddressTypeDTO) => ({
        id: type.id,
        addressType: type.addressType,
        description: type.description || "",
      }));

      setAddressTypes(validTypes);
    } catch (err) {
      console.error("Error fetching address types:", err);
      setError("Failed to load address types. Please try again later.");
      setAddressTypes([]);
    } finally {
      setAddressTypesLoading(false);
    }
  };

  const fetchRegions = async () => {
    try {
      setRegionsLoading(true);
      const response = await authFetch(
        "http://localhost:8080/api/hr-lu-region",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      if (!data || data.length === 0) {
        setRegions([]);
        return;
      }

      const validRegions = data.map((region: Region) => ({
        id: region.id,
        regionName: region.regionName,
        description: region.description || "",
      }));

      setRegions(validRegions);
    } catch (err) {
      console.error("Error fetching regions:", err);
      setError("Failed to load regions. Please try again later.");
      setRegions([]);
    } finally {
      setRegionsLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await authFetch(
        `http://localhost:8080/api/employees/${empId}/addresses`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const processedData = (data || []).map((addr: any) => ({
        ...addr,
        id: addr.id ? Number(addr.id) : 0,
        addressType: addr.addressType ? Number(addr.addressType) : 0,
        regionDetails: addr.regionId
          ? {
              id: Number(addr.regionId),
              regionName: addr.regionName || "",
              description: addr.regionDescription || "",
            }
          : undefined,
      }));

      setAddresses(processedData);
      setError(null);
    } catch (err: any) {
      let errorMessage = "Failed to fetch addresses";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = async (addressData: Address) => {
    try {
      const payload = {
        ...addressData,
        addressType: Number(addressData.addressType),
        employeeId: empId,
      };

      let response;
      if (addressData.id) {
        response = await authFetch(
          `http://localhost:8080/api/employees/${empId}/addresses/${addressData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        const { id, ...rest } = payload;
        response = await authFetch(
          `http://localhost:8080/api/employees/${empId}/addresses`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(rest),
          }
        );
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to save address. Server responded with: ${response.status} ${
            errorBody || ""
          }`
        );
      }

      await fetchAddresses();
      return true;
    } catch (err: any) {
      console.error("Error saving address:", err);
      setError(err instanceof Error ? err.message : "Failed to save address");
      return false;
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      const response = await authFetch(
        `http://localhost:8080/api/employees/${empId}/addresses/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to delete address. Server responded with: ${
            response.status
          } ${errorBody || ""}`
        );
      }
      await fetchAddresses();
      return true;
    } catch (err) {
      console.error("Error deleting address:", err);
      setError("Failed to delete address");
      return false;
    }
  };

  const handleEdit = (address: Address) => {
    setCurrentAddress(address);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: Address) => {
    const success = await saveAddress(formData);
    if (success) {
      setIsFormOpen(false);
      setCurrentAddress(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(id);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("251") && cleaned.length >= 12) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
        6,
        9
      )} ${cleaned.slice(9)}`;
    }
    if (cleaned.startsWith("1") && cleaned.length === 11) {
      return `+${cleaned.slice(0, 1)} ${cleaned.slice(1, 4)} ${cleaned.slice(
        4,
        7
      )} ${cleaned.slice(7)}`;
    }
    if (cleaned.startsWith("44") && cleaned.length >= 12) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(
        5,
        8
      )} ${cleaned.slice(8)}`;
    }
    return phone;
  };

  useEffect(() => {
    fetchAddresses();
    fetchRegions();
    fetchAddressTypes();
  }, [empId]);

  function AddressForm({
    address,
    onClose,
    onSubmit,
  }: {
    address: Address | null;
    onClose: () => void;
    onSubmit: (address: Address) => void;
  }) {
    const [formData, setFormData] = useState<Omit<Address, "id">>({
      employeeId: empId,
      addressType: address?.addressType || 2,
      wereda: address?.wereda || "",
      kebele: address?.kebele || "",
      telephoneOffice: address?.telephoneOffice || "",
      email: address?.email || "",
      poBox: address?.poBox || "",
      mobileNumber: address?.mobileNumber || "",
      zone: address?.zone || "",
      kifleketema: address?.kifleketema || "",
      teleHome: address?.teleHome || "",
      houseNo: address?.houseNo || "",
      region: address?.region || "",
    });

    const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
      countryCodes[0]
    );
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [errors, setErrors] = useState<
      Partial<Record<keyof Omit<Address, "id">, string>>
    >({});

    useEffect(() => {
      if (address?.mobileNumber) {
        const country = countryCodes.find((c) =>
          address.mobileNumber.startsWith(c.dialCode)
        );
        if (country) {
          setSelectedCountry(country);
          setPhoneNumber(address.mobileNumber.slice(country.dialCode.length));
        } else {
          setSelectedCountry(countryCodes[0]);
          setPhoneNumber(address.mobileNumber.replace(/\D/g, ""));
        }
      }
    }, [address]);

    const handleCountrySelect = (country: CountryCode) => {
      setSelectedCountry(country);
      setIsCountryDropdownOpen(false);
      setFormData((prev) => ({
        ...prev,
        mobileNumber: `${country.dialCode}${phoneNumber}`,
      }));
    };

    const handlePhoneNumberChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = e.target;
      const cleanedValue = value.replace(/\D/g, "");
      setPhoneNumber(cleanedValue);
      setFormData((prev) => ({
        ...prev,
        mobileNumber: `${selectedCountry.dialCode}${cleanedValue}`,
      }));
      setErrors((prev) => ({ ...prev, mobileNumber: "" }));
    };

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "addressType" ? parseInt(value) : value,
      }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
      const newErrors: Partial<Record<keyof Omit<Address, "id">, string>> = {};
      let isValid = true;

      if (!formData.addressType) {
        newErrors.addressType = "Address type is required";
        isValid = false;
      }
      if (!formData.mobileNumber) {
        newErrors.mobileNumber = "Mobile number is required";
        isValid = false;
      } else if (!/^(\+?\d{10,15})$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = "Please enter a valid mobile number";
        isValid = false;
      }
      if (!formData.region) {
        newErrors.region = "Region is required";
        isValid = false;
      }

      setErrors(newErrors);
      return isValid;
    };

    const handleSubmitForm = (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        onSubmit({
          id: address?.id || 0,
          ...formData,
        });
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="fixed inset-0 bg-black/30" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-[#3c8dbc]">
              {address ? "Edit Address" : "Add New Address"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <FiX size={20} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address Type */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Address Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {addressTypesLoading ? (
                    <div className="w-full p-2 border border-gray-300 rounded-lg">
                      Loading...
                    </div>
                  ) : addressTypes.length === 0 ? (
                    <div className="text-red-500 text-xs">
                      Failed to load address types
                    </div>
                  ) : (
                    <select
                      name="addressType"
                      value={formData.addressType}
                      onChange={handleChange}
                      className={`w-full p-2 border ${
                        errors.addressType
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">-- Select Address Type --</option>
                      {addressTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.addressType}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {errors.addressType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.addressType}
                  </p>
                )}
              </div>

              {/* Region */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Region <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {regionsLoading ? (
                    <div className="w-full p-2 border border-gray-300 rounded-lg">
                      Loading...
                    </div>
                  ) : regions.length === 0 ? (
                    <div className="text-red-500 text-xs">
                      Failed to load regions
                    </div>
                  ) : (
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={`w-full p-2 border ${
                        errors.region ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">-- Select Region --</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.regionName}>
                          {region.regionName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {errors.region && (
                  <p className="text-red-500 text-xs mt-1">{errors.region}</p>
                )}
              </div>
              {/* Mobile Number */}
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100"
                      onClick={() =>
                        setIsCountryDropdownOpen(!isCountryDropdownOpen)
                      }
                    >
                      <div className="flex items-center">
                        <span className="mr-1">{selectedCountry.flag}</span>
                        <span className="text-xs truncate">
                          {selectedCountry.dialCode}
                        </span>
                      </div>
                      <FiChevronDown className="h-4 w-4 text-gray-400 min-w-[16px]" />
                    </button>
                    {isCountryDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
                        {countryCodes.map((country) => (
                          <div
                            key={country.code}
                            className={`px-2 py-1 text-xs cursor-pointer ${
                              selectedCountry.code === country.code
                                ? "bg-blue-50"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => handleCountrySelect(country)}
                          >
                            <div className="flex items-center">
                              <span className="mr-2">{country.flag}</span>
                              <span className="truncate">
                                {country.dialCode}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-2">
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="912 345 678"
                      className={`w-full p-2 border ${
                        errors.mobileNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>
                </div>
                {errors.mobileNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.mobileNumber}
                  </p>
                )}
              </div>

              {/* Other fields */}
              {[
                { name: "wereda", label: "Wereda" },
                { name: "kebele", label: "Kebele" },
                { name: "zone", label: "Zone" },
                { name: "kifleketema", label: "Kifleketema" },
                { name: "telephoneOffice", label: "Telephone (Office)" },
                { name: "email", label: "Email" },
                { name: "poBox", label: "PO Box" },
                { name: "teleHome", label: "Tele (Home)" },
                { name: "houseNo", label: "House No" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={
                      field.name.includes("tele")
                        ? "tel"
                        : field.name === "email"
                        ? "email"
                        : "text"
                    }
                    name={field.name}
                    value={
                      typeof formData[field.name as keyof typeof formData] ===
                      "object"
                        ? (formData[field.name as keyof typeof formData] as any)
                            ?.id || ""
                        : formData[field.name as keyof typeof formData]
                    }
                    onChange={handleChange}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-end pt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl"
              >
                {address ? "Update " : "Save"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Blur overlay for Form */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-10"
        />
      )}

      {/* Address Form Popup */}
      <AnimatePresence>
        {isFormOpen && (
          <AddressForm
            address={currentAddress}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>

      {/* Main Address Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-white rounded-xl shadow-lg overflow-hidden ${
          isFormOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 bg-[#3c8dbc] rounded-lg shadow-md p-2 md:p-3 text-white h-[50px]">
          <div className="flex items-center">
            <FiBriefcase size={20} className="h-5 w-5 mr-2 text-blue-100" />
            <div>
              <h1 className="text-[14px] font-bold">Address</h1>
              <p className="text-blue-100 text-xs">
                Manage your address information
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAddresses}
              className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-md shadow-sm hover:shadow transition-all duration-300 border border-white border-opacity-20 text-xs md:text-sm"
              title="Refresh Addresses"
              disabled={loading}
            >
              <FiRefreshCw size={16} />
            </button>
            <button
              onClick={() => {
                setCurrentAddress(null);
                setIsFormOpen(true);
              }}
              className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-md shadow-sm hover:shadow transition-all duration-300 border border-white border-opacity-20 text-xs md:text-sm"
            >
              <FiPlus size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {addresses.length === 0 && !loading ? (
            <div className="p-4 text-center text-gray-500">
              No addresses found. Add your first address.
            </div>
          ) : loading && addresses.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Loading addresses...
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "NO",
                    "Type",
                    "Mobile",
                    "Region",
                    "Wereda",
                    "Zone",
                    "Kifleketema",
                    "Kebele",
                    "House No",
                    "Tele/Home",
                    "Email",
                    "Actions",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-3 text-left font-bold text-gray-700 tracking-wider"
                      style={{ fontSize: "12px" }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {addresses.map((address, idx) => (
                  <tr key={address.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {addressTypes.find((t) => t.id === address.addressType)
                        ?.addressType || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {formatPhoneNumber(address.mobileNumber)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {address.region || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {address.wereda || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {address.zone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {address.kifleketema || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {address.kebele || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {address.houseNo || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {address.teleHome || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {address.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(address)}
                          className="text-[#3c8dbc] hover:text-blue-600 p-1 rounded-full hover:bg-blue-50"
                          title="Edit Address"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(address.id as number)}
                          className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                          title="Delete Address"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
