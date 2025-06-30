'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiCalendar, FiEdit2, FiCheck } from 'react-icons/fi';

interface EmploymentTypeDto {
  id: number;
  type: string;
}

interface OrganizationTitleDto {
  id: number;
  name: string;
}

interface TerminationReasonDto {
  terminationReasonId: number;
  reason: string;
}

interface InstitutionDto {
  id: number;
  name: string;
}

interface ExperienceRecord {
  empExpeId: number | null;
  expId: number | null;
  jobTitle: string;
  institution: string;
  organizationType: string;
  reasonForTermination?: string;
  startDate: string;
  duration?: string;
  employmentType: string;
  responsibility?: string;
  salary?: number;
  endDate?: string;
  currentJobFlag: string;
  empId: string;
  empExeId: number;
  orgType: string;
  version?: number;
  employee?: {
    empId: string;
    firstName?: string;
    lastName?: string;
  };
}

interface ExperienceTabProps {
  empId: string;
}

const API_BASE_URL = 'http://localhost:8080/api';

const DEFAULT_ORGANIZATION_TYPES = ['Private', 'Public', 'Government', 'Non-profit'];
const DEFAULT_EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const DEFAULT_TERMINATION_REASONS = ['Resigned', 'Terminated', 'Contract Ended', 'Retired'];

export default function ExperienceTab({ empId }: ExperienceTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLookupsLoading, setIsLookupsLoading] = useState(true);
  const [isExperiencesLoading, setIsExperiencesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [terminationReasons, setTerminationReasons] = useState<string[]>([]);
  const [institutions, setInstitutions] = useState<string[]>([]);

  const [formData, setFormData] = useState<Omit<ExperienceRecord, 'empExpeId'>>({
    expId: null,
    jobTitle: '',
    institution: '',
    organizationType: '',
    reasonForTermination: '',
    startDate: '',
    duration: '',
    employmentType: '',
    responsibility: '',
    salary: undefined,
    endDate: '',
    currentJobFlag: 'N',
    empId: empId,
    empExeId: 0,
    orgType: 'EXTERNAL'
  });

  const processLookupData = <T extends { [key: string]: any }>(data: T[]): string[] => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => {
      if ('type' in item) return item.type;
      if ('name' in item) return item.name;
      if ('reason' in item) return item.reason;
      return JSON.stringify(item);
    }).filter(Boolean);
  };

  const fetchLookups = async () => {
    try {
      const responses = await Promise.all([
        fetch(`${API_BASE_URL}/organization-title`),
        fetch(`${API_BASE_URL}/employment-types`),
        fetch(`${API_BASE_URL}/termination-reasons`),
        fetch(`${API_BASE_URL}/institutions`)
      ]);

      const results = await Promise.all(responses.map(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          const text = await res.text();
          throw new Error(`Invalid content type: ${contentType}. Response: ${text}`);
        }
        return res.json();
      }));

      setOrganizationTypes(processLookupData(results[0]));
      setEmploymentTypes(processLookupData(results[1]));
      setTerminationReasons(processLookupData(results[2]));
      setInstitutions(processLookupData(results[3]));
    } catch (err) {
      console.error('Error fetching lookups:', err);
      setOrganizationTypes(DEFAULT_ORGANIZATION_TYPES);
      setEmploymentTypes(DEFAULT_EMPLOYMENT_TYPES);
      setTerminationReasons(DEFAULT_TERMINATION_REASONS);
      setInstitutions([]);
    } finally {
      setIsLookupsLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${empId}/experiences`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid content type: ${contentType}. Response: ${text}`);
      }
      const data = await response.json();
      setExperiences(data.experiences.map((exp: any) => ({
        ...exp,
        empExpeId: Number(exp.empExpeId),
        expId: Number(exp.expId),
        empExeId: Number(exp.empExeId),
        currentJobFlag: exp.currentJobFlag === 'Y' ? 'Y' : 'N',
        salary: exp.salary ? parseFloat(exp.salary) : undefined,
        employee: exp.employee
      })));
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load experiences');
    } finally {
      setIsExperiencesLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchExperiences(), fetchLookups()]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [empId]);

  const retryFailedRequests = () => {
    setError(null);
    fetchData();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'Y' : 'N') : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.endDate && formData.currentJobFlag !== 'Y' && 
        new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const payload = {
        ...formData,
        empExpeId: editingId,
        expId: formData.expId,
        startDate: formatDateForBackend(formData.startDate),
        endDate: formData.currentJobFlag === 'Y' ? null : formatDateForBackend(formData.endDate || ''),
        salary: formData.salary ? Number(formData.salary) : null,
        reasonForTermination: formData.currentJobFlag === 'Y' ? null : formData.reasonForTermination,
        currentJobFlag: formData.currentJobFlag,
        employee: {
          empId: empId
        }
      };

      const url = editingId 
        ? `${API_BASE_URL}/employees/${empId}/experiences/${editingId}` 
        : `${API_BASE_URL}/employees/${empId}/experiences`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to ${editingId ? 'update' : 'create'} experience`);
      }

      const savedRecord = await response.json();
      
      if (editingId) {
        setExperiences(experiences.map(exp => 
          exp.empExpeId === savedRecord.empExpeId ? {
            ...savedRecord,
            empExpeId: Number(savedRecord.empExpeId),
            expId: Number(savedRecord.expId),
            empExeId: Number(savedRecord.empExeId),
            currentJobFlag: savedRecord.currentJobFlag === 'Y' ? 'Y' : 'N',
            employee: savedRecord.employee
          } : exp
        ));
      } else {
        setExperiences([...experiences, {
          ...savedRecord,
          empExpeId: Number(savedRecord.empExpeId),
          expId: Number(savedRecord.expId),
          empExeId: Number(savedRecord.empExeId),
          currentJobFlag: savedRecord.currentJobFlag === 'Y' ? 'Y' : 'N',
          employee: savedRecord.employee
        }]);
      }

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 2000);
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save experience');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (experience: ExperienceRecord) => {
    setFormData({
      expId: experience.expId,
      jobTitle: experience.jobTitle,
      institution: experience.institution,
      organizationType: experience.organizationType,
      reasonForTermination: experience.reasonForTermination || '',
      startDate: parseDateFromBackend(experience.startDate),
      duration: experience.duration || '',
      employmentType: experience.employmentType,
      responsibility: experience.responsibility || '',
      salary: experience.salary,
      endDate: experience.endDate ? parseDateFromBackend(experience.endDate) : '',
      currentJobFlag: experience.currentJobFlag,
      empId: experience.empId,
      empExeId: experience.empExeId,
      orgType: experience.orgType
    });
    setEditingId(experience.empExpeId);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      expId: null,
      jobTitle: '',
      institution: '',
      organizationType: '',
      reasonForTermination: '',
      startDate: '',
      duration: '',
      employmentType: '',
      responsibility: '',
      salary: undefined,
      endDate: '',
      currentJobFlag: 'N',
      empId: empId,
      empExeId: 0,
      orgType: 'EXTERNAL'
    });
    setEditingId(null);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatSalary = (salary?: number) => {
    if (!salary) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(salary);
  };

  const formatDateForBackend = (dateString: string): string => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  const parseDateFromBackend = (dateString: string): string => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  const getStatusColor = (isCurrent: boolean) => {
    return isCurrent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getTerminationColor = (reason?: string) => {
    switch (reason) {
      case 'Resigned': return 'bg-blue-100 text-blue-800';
      case 'Terminated': return 'bg-red-100 text-red-800';
      case 'Contract Ended': return 'bg-purple-100 text-purple-800';
      case 'Retired': return 'bg-amber-100 text-amber-800';
      case 'Military Service': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        {isLookupsLoading && <p className="text-sm text-gray-600">Loading dropdown options...</p>}
        {isExperiencesLoading && <p className="text-sm text-gray-600">Loading experience data...</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={retryFailedRequests}
              className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200"
            >
              Retry Loading Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formTitle = editingId ? 'Edit Experience Record' : 'Add New Experience Record';

  return (
    <div className="space-y-6 relative">
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
        />
      )}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-20"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Job Title*
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Software Engineer"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Institution*
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      list="institutions-list"
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Company Name"
                      required
                    />
                    <datalist id="institutions-list">
                      {institutions.map((institution, index) => (
                        <option key={index} value={institution} />
                      ))}
                    </datalist>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Organization Type*
                    </label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select organization type</option>
                      {organizationTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Employment Type*
                    </label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select employment type</option>
                      {employmentTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Start Date*
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-2.5 text-gray-400" size={14} />
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pl-9"
                        required
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {formData.currentJobFlag === 'Y' ? "Currently Working" : "End Date"}
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-2.5 text-gray-400" size={14} />
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pl-9 disabled:bg-gray-100"
                        disabled={formData.currentJobFlag === 'Y'}
                      />
                    </div>
                    <div className="flex items-center mt-1">
                      <input
                        type="checkbox"
                        id="currentJob"
                        name="currentJobFlag"
                        checked={formData.currentJobFlag === 'Y'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentJobFlag: e.target.checked ? 'Y' : 'N'
                          })
                        }
                        className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="currentJob" className="ml-2 text-xs text-gray-700">
                        Currently working here
                      </label>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="2 years 3 months"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Salary
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="salary"
                        value={formData.salary || ''}
                        onChange={handleChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                        placeholder="50000"
                      />
                      <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-xs">USD</span>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="md:col-span-2"
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Reason for Termination
                    </label>
                    <select
                      name="reasonForTermination"
                      value={formData.reasonForTermination}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={formData.currentJobFlag === 'Y'}
                    >
                      <option value="">Select reason (if applicable)</option>
                      {terminationReasons.map((reason, index) => (
                        <option key={index} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65 }}
                    className="md:col-span-2"
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Responsibilities
                    </label>
                    <textarea
                      name="responsibility"
                      value={formData.responsibility}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[80px]"
                      placeholder="Describe your responsibilities in this role..."
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
                    disabled={isLoading}
                    className={`px-3 py-1.5 ${
                      submitSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-[#3c8dbc] hover:bg-[#367fa9]'
                    } text-white rounded-md transition-all shadow hover:shadow-md text-xs font-medium flex items-center gap-1 disabled:opacity-70`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-1 h-3 w-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {editingId ? 'Updating...' : 'Saving...'}
                      </>
                    ) : submitSuccess ? (
                      <>
                        <FiCheck size={14} />
                        Success!
                      </>
                    ) : editingId ? (
                      'Update'
                    ) : (
                      'Save'
                    )}
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div>
              <h1 className="text-[14px] font-bold">Work Experience</h1>
              <p className="text-blue-100 text-xs">Manage your professional work history</p>
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
            <FiPlus size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'NO',
                  'Job Title',
                  'Institution',
                  'Duration',
                  'Salary',
                  'Status',
                  'Termination',
                  'Actions'
                ].map((header, idx) => (
                  <motion.th
                    key={header}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="px-6 py-3 text-left font-bold text-gray-700 tracking-wider"
                    style={{ fontSize: '12px' }}
                  >
                    {header}
                  </motion.th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {experiences.map((exp, idx) => (
                <motion.tr
                  key={exp.empExpeId || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-xs">
                          {exp.jobTitle.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-xs font-semibold text-gray-500">
                          {exp.jobTitle}
                        </div>
                        <div className="text-xs text-gray-400">{exp.employmentType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-semibold text-gray-500">
                      {exp.institution}
                    </div>
                    <div className="text-xs text-gray-400">{exp.organizationType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FiCalendar className="text-gray-400" size={12} />
                      {formatDate(exp.startDate)} -{' '}
                      {exp.currentJobFlag === 'Y' ? 'Present' : formatDate(exp.endDate || '')}
                    </div>
                    <div className="text-xs text-gray-400">{exp.duration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-semibold text-gray-500">
                      {formatSalary(exp.salary)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        exp.currentJobFlag === 'Y'
                      )}`}
                    >
                      {exp.currentJobFlag === 'Y' ? 'Current' : 'Past'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getTerminationColor(
                        exp.reasonForTermination
                      )}`}
                    >
                      {exp.reasonForTermination || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(exp)}
                      className="text-[#3c8dbc] hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                    >
                      <FiEdit2 size={16} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div>
              Showing{' '}
              <span className="font-semibold">{experiences.length}</span> experience records
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                <span>Current</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-gray-500 mr-1.5"></span>
                <span>Past</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                <span>Terminated</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                <span>Resigned</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}