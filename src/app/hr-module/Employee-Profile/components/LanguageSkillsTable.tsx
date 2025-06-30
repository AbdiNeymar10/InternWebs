import React, { useState, useEffect } from "react";
import LanguageForm from "./LanguageForm";
import { FiTrash2, FiEdit2, FiPlus, FiX, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";

interface LanguageSkill {
  id: number;
  languageTypeId: number;
  languageName: string;
  reading: string;
  writing: string;
  listening: string;
  speaking: string;
}

interface LanguageOption {
  id: number;
  languageName: string;
}

const LanguageSkillsTable = ({ empId }: { empId: string }) => {
  const [showForm, setShowForm] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageSkill | null>(null);
  const [languages, setLanguages] = useState<LanguageSkill[]>([]);
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLanguages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/employees/${empId}/languages`);
      if (!response.ok) {
        throw new Error('Failed to fetch language skills');
      }
      const data = await response.json();
      setLanguages(data);
    } catch (err) {
      console.error('Error fetching language skills:', err);
      setError('Failed to load language skills');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLanguageOptions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/languages');
      if (!response.ok) {
        throw new Error('Failed to fetch language options');
      }
      const data = await response.json();
      setLanguageOptions(data);
    } catch (err) {
      console.error('Error fetching language options:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this language skill?')) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/employees/${empId}/languages/${id}`,
          { method: 'DELETE' }
        );
        
        if (!response.ok) {
          throw new Error('Failed to delete language skill');
        }
        
        fetchLanguages();
      } catch (error) {
        console.error('Error deleting language skill:', error);
        alert('Failed to delete language skill');
      }
    }
  };

  useEffect(() => {
    if (empId) {
      fetchLanguages();
      fetchLanguageOptions();
    }
  }, [empId]);

  const handleAddLanguage = async (formData: {
    languageTypeId: number;
    reading: string;
    speaking: string;
    writing: string;
    listening: string;
  }) => {
    try {
      const url = currentLanguage 
        ? `http://localhost:8080/api/employees/${empId}/languages/${currentLanguage.id}`
        : `http://localhost:8080/api/employees/${empId}/languages`;
      
      const method = currentLanguage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          languageTypeId: formData.languageTypeId,
          reading: formData.reading,
          writing: formData.writing,
          listening: formData.listening,
          speaking: formData.speaking
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error saving language skill:", response.status, errorBody);
        const baseMessage = currentLanguage ? 'Failed to update language skill' : 'Failed to add language skill';
        throw new Error(`${baseMessage}. Server responded with: ${response.status} ${errorBody || ''}`);
      }

      fetchLanguages();
      setShowForm(false);
      setCurrentLanguage(null);
    } catch (error) {
      console.error('Error saving language skill:', error);
      const message = error instanceof Error ? error.message : 'Error saving language skill. Please try again.';
      alert(message);
    }
  };

  const getSkillColor = (skill: string) => {
    const colors: Record<string, string> = {
      "Excellent": "bg-emerald-100 text-emerald-800",
      "Very Good": "bg-teal-100 text-teal-800",
      "Good": "bg-blue-100 text-blue-800",
      "Fair": "bg-amber-100 text-amber-800",
      "Poor": "bg-red-100 text-red-800",
    };
    return colors[skill] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={fetchLanguages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 bg-[#3c8dbc] rounded-lg shadow-md p-2 md:p-3 text-white h-[50px]">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2 text-blue-100" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <div>
              <h1 className="text-[14px] font-bold">Language Proficiency</h1>
              <p className="text-blue-100 text-xs">Manage your language skills</p>
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentLanguage(null);
              setShowForm(true);
            }}
            className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-md shadow-sm hover:shadow transition-all duration-300 border border-white border-opacity-20 text-xs md:text-sm mt-2 md:mt-0"
          >
            <FiPlus className="mr-1" />
            Add Language
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {showForm ? (
            <div className="p-6">
              <LanguageForm 
                onSubmit={handleAddLanguage} 
                onCancel={() => {
                  setShowForm(false);
                  setCurrentLanguage(null);
                }}
                languageOptions={languageOptions}
                initialData={currentLanguage ? {
                  languageTypeId: currentLanguage.languageTypeId,
                  reading: currentLanguage.reading,
                  writing: currentLanguage.writing,
                  listening: currentLanguage.listening,
                  speaking: currentLanguage.speaking
                } : null}
              />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider">NO</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider">Language</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider">Reading</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider">Writing</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider">Listening</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider">Speaking</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-black-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {languages.length > 0 ? (
                      languages.map((lang, index) => (
                        <tr key={lang.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-gray-500">{index + 1}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold text-xs uppercase">
                                  {lang.languageName && lang.languageName.length > 0
                                    ? lang.languageName.charAt(0)
                                    : '?'}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-xs font-semibold text-gray-500">{lang.languageName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSkillColor(lang.reading)}`}>
                              {lang.reading}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSkillColor(lang.writing)}`}>
                              {lang.writing}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSkillColor(lang.listening)}`}>
                              {lang.listening}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSkillColor(lang.speaking)}`}>
                              {lang.speaking}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium flex gap-2 justify-end">
                            <button 
                              className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200"
                              onClick={() => {
                                setCurrentLanguage(lang);
                                setShowForm(true);
                              }}
                              title="Edit"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200"
                              onClick={() => handleDelete(lang.id)}
                              title="Delete"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="text-gray-300 text-4xl mb-3 h-12 w-12" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            <h3 className="text-base font-medium text-gray-500">No language skills found</h3>
                            <p className="text-gray-400 mt-1 text-sm">Click "Add Language" to add your first language skill</p>
                            <button
                              onClick={() => setShowForm(true)}
                              className="mt-3 flex items-center bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-1.5 rounded-md shadow-sm hover:shadow transition-all duration-300 text-sm"
                            >
                              <FiPlus className="mr-1.5" />
                              Add Language
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {languages.length > 0 && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div>Showing <span className="font-semibold">{languages.length}</span> languages</div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                        <span>Expert</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                        <span>Proficient</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                        <span>Beginner</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageSkillsTable;