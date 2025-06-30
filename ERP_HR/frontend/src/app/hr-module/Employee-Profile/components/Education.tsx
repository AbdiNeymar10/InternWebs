'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiX,
  FiCalendar,
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

type EducationRecord = {
  empEduId?: number;
  institution: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrentlyEnrolled?: boolean;
  paymentPayedBy: string | null;
  studyField: number;
  fieldOfStudy?: { id: number; name: string };
  eduLevelId: number;
  educationLevel?: { id: number; eduName: string };
  location: string | null;
  eduResult: string | null;
  empId?: string;
};

type EducationLevel = {
  id: number;
  eduName: string;
};

type FieldOfStudy = {
  id: number;
  name: string;
};

const EDUCATION_LEVELS_URL = 'http://localhost:8080/api/education-level';
const FIELDS_OF_STUDY_URL = 'http://localhost:8080/api/field-of-study';
const ITEMS_PER_PAGE = 5;

export default function EducationTab({ empId }: { empId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [educations, setEducations] = useState<EducationRecord[]>([]);
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);
  const [fieldsOfStudy, setFieldsOfStudy] = useState<FieldOfStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<EducationRecord>>({
    institution: '',
    startDate: '',
    endDate: '',
    isCurrentlyEnrolled: false,
    paymentPayedBy: '',
    studyField: 0,
    fieldOfStudy: undefined,
    eduLevelId: 0,
    educationLevel: undefined,
    location: '',
    eduResult: '',
  });
  const [locationSuggestions, setLocationSuggestions] = useState<{ country: string; city: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const paymentPaidByOptions = [
    'Self-paid',
    'Company-sponsored',
    'Scholarship',
    'Government-funded',
    'Loan',
    'Other',
  ];

  const compactInputClass = 'w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

  // Calculate pagination values
  const totalPages = Math.ceil(educations.length / ITEMS_PER_PAGE);
  const paginatedEducations = educations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Loading data for empId:', empId);
        const [eduData, levelsData, fieldsData] = await Promise.all([
          fetchEducationRecords(empId),
          fetchEducationLevels(),
          fetchFieldsOfStudy(),
        ]);

        setEducations(eduData);
        setEducationLevels(levelsData);
        setFieldsOfStudy(fieldsData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load data. Please try again later.';
        setError(errorMessage);
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [empId]);

  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;

    if (name === 'isCurrentlyEnrolled') {
      setFormData({
        ...formData,
        isCurrentlyEnrolled: checked,
        endDate: checked ? '' : formData.endDate,
      });
    } else if (name === 'studyField' || name === 'eduLevelId') {
      const numValue = parseInt(value);
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : numValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Location autocomplete
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, location: value });

    if (value.length > 1) {
      const filtered = cities.filter(
        (city) =>
          city.city.toLowerCase().includes(value.toLowerCase()) ||
          city.country.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectLocation = (country: string, city: string) => {
    setFormData({ ...formData, location: `${city}, ${country}` });
    setShowSuggestions(false);
  };

  // Form validation
  const validateForm = () => {
    return (
      formData.institution &&
      formData.eduLevelId &&
      formData.studyField &&
      formData.location &&
      formData.startDate &&
      formData.paymentPayedBy
    );
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        institution: formData.institution,
        startDate: formData.startDate,
        endDate: formData.isCurrentlyEnrolled ? null : formData.endDate,
        paymentPayedBy: formData.paymentPayedBy,
        studyField: formData.studyField,
        eduLevelId: formData.eduLevelId,
        location: formData.location,
        eduResult: formData.eduResult,
        empId: empId,
      };

      let response;
      if (editingId) {
        response = await fetch(`http://localhost:8080/api/employees/${empId}/education/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`http://localhost:8080/api/employees/${empId}/education`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save record');
      }

      const result = await response.json();
      
      if (editingId) {
        setEducations(educations.map(edu => 
          edu.empEduId === editingId ? result : edu
        ));
      } else {
        setEducations([...educations, result]);
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Save error:', error);
      alert(`Error saving record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Edit handler
  const handleEdit = (education: EducationRecord) => {
    setFormData({
      institution: education.institution ?? '',
      startDate: education.startDate ?? '',
      endDate: education.endDate ?? '',
      isCurrentlyEnrolled: !education.endDate || education.endDate === '#N/A' || education.endDate === '',
      paymentPayedBy: education.paymentPayedBy ?? '',
      studyField: education.studyField ?? 0,
      fieldOfStudy: education.fieldOfStudy,
      eduLevelId: education.eduLevelId ?? 0,
      educationLevel: education.educationLevel,
      location: education.location ?? '',
      eduResult: education.eduResult ?? '',
    });
    setEditingId(education.empEduId || null);
    setShowForm(true);
  };

  // Delete handler
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this education record?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/employees/${empId}/education/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete record');
      }

      setEducations(educations.filter(edu => edu.empEduId !== id));
    } catch (error) {
      console.error('Delete error:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete record');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      institution: '',
      startDate: '',
      endDate: '',
      isCurrentlyEnrolled: false,
      paymentPayedBy: '',
      studyField: 0,
      fieldOfStudy: undefined,
      eduLevelId: 0,
      educationLevel: undefined,
      location: '',
      eduResult: '',
    });
    setEditingId(null);
    setLocationSuggestions([]);
    setShowSuggestions(false);
  };

  // Utility functions
  const formatDate = (dateString: string | null): string => {
    if (!dateString || dateString === '#N/A' || dateString === '') return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getStatusColor = (isCurrent: boolean) => {
    return isCurrent ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const getCGPAColor = (eduResult: string | null) => {
    if (!eduResult) return 'bg-gray-100 text-gray-800';
    const score = parseFloat(eduResult);
    if (score >= 3.5) return 'bg-emerald-100 text-emerald-800';
    if (score >= 2.5) return 'bg-blue-100 text-blue-800';
    return 'bg-amber-100 text-amber-800';
  };

  const formTitle = editingId ? 'Edit Education Record' : 'Add New Education Record';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-10"
        />
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-20 p-4"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm w-full max-w-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl font-bold text-[#3c8dbc]"
                >
                  {formTitle}
                </motion.h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-all"
                >
                  <FiX size={18} className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Institution Name */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">Institution Name*</label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution ?? ''}
                      onChange={handleChange}
                      className={compactInputClass}
                      placeholder="University of Example"
                      required
                    />
                  </motion.div>

                  {/* Education Level */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">Education Level*</label>
                    <select
                      name="eduLevelId"
                      value={formData.eduLevelId ?? ''}
                      onChange={handleChange}
                      className={compactInputClass}
                      required
                    >
                      <option value="">Select</option>
                      {educationLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.eduName}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Field of Study */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">Field of Study*</label>
                    <select
                      name="studyField"
                      value={formData.studyField ?? ''}
                      onChange={handleChange}
                      className={compactInputClass}
                      required
                    >
                      <option value="">Select</option>
                      {fieldsOfStudy.map((field) => (
                        <option key={field.id} value={field.id}>
                          {field.name}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Location */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">Location*</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location ?? ''}
                      onChange={handleLocationChange}
                      className={compactInputClass}
                      placeholder="City, Country"
                      required
                    />
                    {showSuggestions && locationSuggestions.length > 0 && (
                      <ul className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow max-h-40 overflow-y-auto z-10">
                        {locationSuggestions.map(({ country, city }) => (
                          <li
                            key={`${city}-${country}`}
                            onClick={() => selectLocation(country, city)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                          >
                            {`${city}, ${country}`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>

                  {/* Start Date */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Date*</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate ? formatDateForInput(formData.startDate) : ''}
                      onChange={handleChange}
                      className={compactInputClass}
                      required
                    />
                  </motion.div>

                  {/* End Date */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate ? formatDateForInput(formData.endDate) : ''}
                      onChange={handleChange}
                      disabled={formData.isCurrentlyEnrolled}
                      className={compactInputClass}
                    />
                  </motion.div>

                  {/* Currently Enrolled Checkbox */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="inline-flex items-center space-x-2 text-xs font-medium text-gray-700 mb-1">
                      <input
                        type="checkbox"
                        name="isCurrentlyEnrolled"
                        checked={formData.isCurrentlyEnrolled}
                        onChange={handleChange}
                        className="form-checkbox h-4 w-4 text-blue-500"
                      />
                      <span>Currently Enrolled</span>
                    </label>
                  </motion.div>

                  {/* Payment Method */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method*</label>
                    <select
                      name="paymentPayedBy"
                      value={formData.paymentPayedBy ?? ''}
                      onChange={handleChange}
                      className={compactInputClass}
                      required
                    >
                      <option value="">Select</option>
                      {paymentPaidByOptions.map((method) => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </motion.div>

                  {/* CGPA */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">CGPA</label>
                    <input
                      type="text"
                      name="eduResult"
                      value={formData.eduResult ?? ''}
                      onChange={handleChange}
                      className={compactInputClass}
                      placeholder="3.8"
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex gap-3 justify-end"
                >
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#3c8dbc] text-white rounded-md hover:bg-[#367fa9] transition-all text-xs font-medium"
                  >
                    {editingId ? 'Update' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all text-xs font-medium"
                  >
                    Cancel
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-xl shadow-lg overflow-hidden ${showForm ? 'blur-sm' : ''}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 bg-[#3c8dbc] rounded-lg shadow-md p-2 md:p-3 text-white h-[50px]">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0 -3.332-.477 -4.5-1.253V6.253z"
              />
            </svg>
            <div>
              <h1 className="text-[14px] font-bold">Education Records</h1>
              <p className="text-blue-100 text-xs">Manage your education history</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              resetForm();
            }}
            className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-md shadow-sm hover:shadow transition-all duration-300 border border-white border-opacity-20 text-xs md:text-sm mt-2 md:mt-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 010 2h-5v5a1 1 0 01-2 0v-5H4a1 1 0 010-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'NO',
                  'Institution',
                  'Qualification',
                  'Duration',
                  'CGPA',
                  'Status',
                  'Payment Method',
                  'Actions',
                ].map((header, idx) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left font-bold text-gray-700 tracking-wider"
                    style={{ fontSize: '12px' }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedEducations.map((education, idx) => (
                <tr
                  key={education.empEduId || idx}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-xs">
                          {education.institution?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-xs font-semibold text-gray-500">{education.institution || '-'}</div>
                        <div className="text-xs text-gray-400">{education.location || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-semibold text-gray-500">
                      {fieldsOfStudy.find(f => f.id === education.studyField)?.name || 'Unknown Field'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {educationLevels.find(l => l.id === education.eduLevelId)?.eduName || 'Unknown Level'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FiCalendar className="text-gray-400" size={12} />
                      {formatDate(education.startDate)} -{' '}
                      {!education.endDate || education.endDate === '#N/A' || education.endDate === '' 
                        ? 'Present' 
                        : formatDate(education.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getCGPAColor(education.eduResult)}`}
                    >
                      {education.eduResult || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(!education.endDate || education.endDate === '#N/A' || education.endDate === '')}`}
                    >
                      {!education.endDate || education.endDate === '#N/A' || education.endDate === '' ? 'Enrolled' : 'Completed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {education.paymentPayedBy || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(education)}
                      className="text-[#3c8dbc] hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                    >
                      <FiEdit2 size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(education.empEduId!)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 ml-2"
                    >
                      <FiX size={16} />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination and Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-gray-600 mb-2 md:mb-0">
            Showing <span className="font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
            <span className="font-semibold">
              {Math.min(currentPage * ITEMS_PER_PAGE, educations.length)}
            </span>{' '}
            of <span className="font-semibold">{educations.length}</span> education records
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              <FiChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-md text-xs ${currentPage === page ? 'bg-[#3c8dbc] text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              <FiChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-center space-x-3 mt-2 md:mt-0">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
              <span className="text-xs">3.5+ GPA</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
              <span className="text-xs">2.5+ GPA</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
              <span className="text-xs">Below 2.5</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Dummy data for location suggestions
const cities = [
  { country: 'Ethiopia', city: 'Addis Ababa' },
  { country: 'USA', city: 'New York' },
  { country: 'UK', city: 'London' },
  { country: 'Canada', city: 'Toronto' },
  { country: 'Germany', city: 'Berlin' },
  { country: 'France', city: 'Paris' },
];

// Fetchers
async function fetchEducationRecords(empId: string): Promise<EducationRecord[]> {
  try {
    console.log(`Fetching education records for empId: ${empId}`);
    const response = await fetch(`http://localhost:8080/api/employees/${empId}/education`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Fetched education records:', data);

    return data.map((record: any) => ({
      empEduId: record.empEduId,
      institution: record.institution || null,
      startDate: record.startDate || null,
      endDate: record.endDate || null,
      paymentPayedBy: record.paymentPayedBy || null,
      studyField: record.studyField || 0,
      eduLevelId: record.eduLevelId || 0,
      location: record.location || null,
      eduResult: record.eduResult || null,
      fieldOfStudy: record.fieldOfStudy || undefined,
      educationLevel: record.educationLevel || undefined,
    }));
  } catch (error) {
    console.error('Error fetching education records:', error);
    throw error; // Re-throw to handle in useEffect
  }
}

async function fetchEducationLevels(): Promise<EducationLevel[]> {
  const response = await fetch(EDUCATION_LEVELS_URL);
  if (!response.ok) throw new Error('Failed to fetch education levels');
  return response.json();
}

async function fetchFieldsOfStudy(): Promise<FieldOfStudy[]> {
  const response = await fetch(FIELDS_OF_STUDY_URL);
  if (!response.ok) throw new Error('Failed to fetch fields of study');
  return response.json();
}