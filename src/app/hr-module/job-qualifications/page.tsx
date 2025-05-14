"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Sidebar from "../sidbar";
import toast, { Toaster } from "react-hot-toast";

interface ICF {
  id: number;
  ICF: string;
  icf: string;
}

function JobQualification() {
  const [selectedJob, setSelectedJob] = useState<number | "">("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedICF, setSelectedICF] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [jobs, setJobs] = useState<{ id: number; jobTitle: string }[]>([]);
  const [icfs, setIcfs] = useState<ICF[]>([]);
  const [jobFamily, setJobFamily] = useState("");
  const [jobCode, setJobCode] = useState("");
  const [jobClass, setJobClass] = useState("");
  const [selectedJobTypeId, setSelectedJobTypeId] = useState<number | null>(
    null
  );
  const [fieldsOfStudy, setFieldsOfStudy] = useState<
    { id: number; name: string }[]
  >([]);
  const [filteredFieldsOfStudy, setFilteredFieldsOfStudy] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedFieldsOfStudy, setSelectedFieldsOfStudy] = useState<string[]>(
    []
  );
  const [educationCategories, setEducationCategories] = useState<string[]>([]);
  const [educationLevel, setEducationLevel] = useState<
    { id: number; eduName: string }[]
  >([]);
  const [selectedEducationCategory, setSelectedEducationCategory] =
    useState("");
  const [selectedEducationLevel, setSelectedEducationLevel] = useState("");
  const [selectedMinExperience, setSelectedMinExperience] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedKnowledge, setSelectedKnowledge] = useState("");
  const [selectedCompetency, setSelectedCompetency] = useState("");
  const [qualifications, setQualifications] = useState<
    {
      educationCategory: string;
      educationLevel: string;
      fieldsOfStudy: string[];
      minExperience: number;
      skill: string;
      knowledge: string;
      competency: string;
    }[]
  >([]);
  useEffect(() => {
    // Fetch job titles with IDs from HR_LU_JOB_TYPE table
    axios
      .get("http://localhost:8080/api/jobtypes/job-titles")
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching job titles:", error);
      });

    // Fetch ICFs
    axios
      .get("http://localhost:8080/api/qualifications/icfs")
      .then((response) => {
        setIcfs(response.data);
      });
  }, []);

  useEffect(() => {
    if (selectedJob) {
      axios
        .get(
          `http://localhost:8080/api/hr-job-types/details-by-job-title-id?jobTitleId=${selectedJob}`
        )
        .then((response) => {
          console.log("API response:", response.data);
          const { jobFamily, jobCode, jobGrade, jobTypeId } = response.data;
          setJobFamily(jobFamily);
          setJobCode(jobCode);
          setJobClass(jobGrade);
          setSelectedJobTypeId(jobTypeId); // Store the jobTypeId
        })
        .catch((error) => {
          console.error("Error fetching job details:", error);
        });
    }
  }, [selectedJob]);
  useEffect(() => {
    // Fetch fields of study from the backend
    axios
      .get("http://localhost:8080/api/fields-of-study")
      .then((response) => {
        setFieldsOfStudy(response.data); // Set the fetched fields of study
        setFilteredFieldsOfStudy(response.data); // Initialize filtered list with all fields
      })
      .catch((error) => {
        console.error("Error fetching fields of study:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/education-levels/education-categories")
      .then((response) => {
        setEducationCategories(response.data); // Set the fetched categories
      })
      .catch((error) => {
        console.error("Error fetching education categories:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch education levels from the backend
    axios
      .get("http://localhost:8080/api/education-levels/education-level")
      .then((response) => {
        setEducationLevel(response.data);
      })
      .catch((error) => {
        console.error("Error fetching education levels:", error);
      });
  }, []);

  const handleFieldOfStudyChange = (fieldName: string) => {
    setSelectedFieldsOfStudy((prevSelected) =>
      prevSelected.includes(fieldName)
        ? prevSelected.filter((name) => name !== fieldName)
        : [...prevSelected, fieldName]
    );
  };
  const handleAddQualification = () => {
    const newQualification = {
      educationCategory: selectedEducationCategory,
      educationLevel: selectedEducationLevel,
      fieldsOfStudy: selectedFieldsOfStudy,
      minExperience: selectedMinExperience,
      skill: selectedSkill,
      knowledge: selectedKnowledge,
      competency: selectedCompetency,
    };

    setQualifications((prevQualifications) => [
      ...prevQualifications,
      newQualification,
    ]);

    // Reset modal fields
    setSelectedEducationCategory("");
    setSelectedEducationLevel("");
    setSelectedFieldsOfStudy([]);
    setSelectedMinExperience(0);
    setSelectedSkill("");
    setSelectedKnowledge("");
    setSelectedCompetency("");

    // Close the modal
    setShowModal(false);
    toast.success("Qualification added!");
  };
  const handleDeleteQualification = (index: number) => {
    setQualifications((prevQualifications) =>
      prevQualifications.filter((_, i) => i !== index)
    );
  };
  const handleEditQualification = (index: number) => {
    const qualificationToEdit = qualifications[index];

    // Populate the modal fields with the selected qualification's data
    setSelectedEducationCategory(qualificationToEdit.educationCategory);
    setSelectedEducationLevel(qualificationToEdit.educationLevel);
    setSelectedFieldsOfStudy(qualificationToEdit.fieldsOfStudy);
    setSelectedMinExperience(qualificationToEdit.minExperience);
    setSelectedSkill(qualificationToEdit.skill);
    setSelectedKnowledge(qualificationToEdit.knowledge);
    setSelectedCompetency(qualificationToEdit.competency);

    // Remove the qualification from the list temporarily
    setQualifications((prevQualifications) =>
      prevQualifications.filter((_, i) => i !== index)
    );

    // Open the modal for editing
    setShowModal(true);
  };
  const handleSaveQualifications = async () => {
    try {
      const payload = qualifications.map((qualification) => ({
        jobType: { id: selectedJobTypeId },
        keyCompetency: qualification.competency,
        knowledge: qualification.knowledge,
        skill: qualification.skill,
        minExperience: qualification.minExperience,
        qualification: qualification.educationCategory,
        educationLevel: { id: Number(qualification.educationLevel) },
        fieldOfStudy:
          qualification.fieldsOfStudy.length > 0
            ? {
                id: fieldsOfStudy.find(
                  (field) => field.name === qualification.fieldsOfStudy[0]
                )?.id,
              }
            : null,
      }));

      console.log("Payload being sent:", payload); // Debugging payload

      const response = await axios.post(
        "http://localhost:8080/api/qualifications/bulk",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Qualifications saved successfully!");
        setQualifications([]);
      } else {
        toast.error("Failed to save qualifications.");
      }
    } catch (error) {
      console.error("Error saving qualifications:", error);
      toast.error("An error occurred while saving qualifications.");
    }
  };
  return (
    <>
      <div className="p-6 font-sans bg-gray-100 min-h-screen">
        <Toaster />
        {/* Search Job Position */}
        <h1 className="text-2xl font-bold mb-4">Search Job Position</h1>
        <div className="bg-white p-4 shadow rounded mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Jobs:</span>
              <select
                className="mt-1 bock w-full border rounded p-2"
                value={selectedJob}
                onChange={(e) => {
                  const selectedId =
                    e.target.value === "" ? "" : Number(e.target.value);
                  setSelectedJob(selectedId);
                  const selectedJobObj = jobs.find(
                    (job) => job.id === selectedId
                  );
                  setSelectedJobTitle(
                    selectedJobObj ? selectedJobObj.jobTitle : ""
                  );
                }}
              >
                <option value="">--Select One--</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.jobTitle}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">ICF:</span>
              <select
                className="mt-1 block w-full border rounded p-2 ml-2"
                value={selectedICF}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedICFObj = icfs.find(
                    (icf) => icf.id === Number(selectedId)
                  );
                  setSelectedICF(selectedICFObj ? selectedICFObj.ICF : "");
                }}
              >
                <option value="">--Select One--</option>
                {icfs.map((icf) => (
                  <option key={icf.id} value={icf.id}>
                    {icf.ICF}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-semibold mt-4 mb-4">
          Update Position Qualification
        </h2>
        <div className="bg-white p-4 shadow rounded mb-6 animate-fade-in">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label>Job Title:</label> {selectedJobTitle || ""}
            </div>
            <div>
              <label>Job Code:</label> {jobCode || ""}
            </div>
            <div>
              <label>Job Family:</label> {jobFamily || ""}
            </div>
            <div>
              <label>Class:</label> {jobClass || ""}
            </div>
            <div>
              <label>ICF:</label> {selectedICF || ""}
            </div>
          </div>
          {/* Qualifications Table */}
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border border-gray-300 bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th colSpan={9} className="text-center py-2">
                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Add Qualification
                    </button>
                  </th>
                </tr>
                <tr className="text-left border-t border-gray-300">
                  <th className="px-2 py-2 border">No</th>
                  <th className="px-2 py-2 border">Education Category</th>
                  <th className="px-2 py-2 border">Education Level</th>
                  <th className="px-2 py-2 border">Field of Study</th>
                  <th className="px-2 py-2 border">Min Exper</th>
                  <th className="px-2 py-2 border">Skill</th>
                  <th className="px-2 py-2 border">Knowledge</th>
                  <th className="px-2 py-2 border">Key Competency</th>
                  <th className="px-2 py-2 border">Option</th>
                </tr>
              </thead>
              <tbody>
                {qualifications.length === 0 ? (
                  <tr className="text-gray-500">
                    <td className="border px-2 py-2 text-center" colSpan={9}>
                      No qualifications added yet.
                    </td>
                  </tr>
                ) : (
                  qualifications.map((qualification, index) => (
                    <tr key={index} className="text-gray-900">
                      <td className="border px-2 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border px-2 py-2">
                        {qualification.educationCategory}
                      </td>
                      <td className="border px-2 py-2">
                        {qualification.educationLevel}
                      </td>
                      <td className="border px-2 py-2">
                        {qualification.fieldsOfStudy.join(", ")}
                      </td>
                      <td className="border px-2 py-2">
                        {qualification.minExperience}
                      </td>
                      <td className="border px-2 py-2">
                        {qualification.skill}
                      </td>
                      <td className="border px-2 py-2">
                        {qualification.knowledge}
                      </td>
                      <td className="border px-2 py-2">
                        {qualification.competency}
                      </td>
                      <td className="border px-2 py-2 text-center">
                        <button
                          onClick={() => handleEditQualification(index)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteQualification(index)}
                          className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Save Button */}
          <div className="flex justify-start mt-4">
            <button
              onClick={handleSaveQualifications}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>

        {/* Modal: Add Qualification */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-red-500"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Qualification</h2>
              <div className="grid grid-cols-2 gap-1">
                {/* Education Category */}
                <div>
                  <label className="block mb-2">Education Category</label>
                  <select
                    className="w-full border rounded p-2"
                    value={selectedEducationCategory}
                    onChange={(e) =>
                      setSelectedEducationCategory(e.target.value)
                    }
                  >
                    <option value="">--Select One--</option>
                    {educationCategories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Field of Study</label>
                  <div className="w-full border-2 border-gray-200  rounded p-2 max-h-32 overflow-y-auto">
                    {/* Search Field */}
                    <input
                      type="text"
                      className="w-full border-gray-300 border-b rounded p-0.5 mb-1"
                      onChange={(e) => {
                        const searchValue = e.target.value.toLowerCase();
                        setFilteredFieldsOfStudy(
                          fieldsOfStudy.filter((field) =>
                            field.name.toLowerCase().includes(searchValue)
                          )
                        );
                      }}
                    />
                    <label className="block">
                      <input type="checkbox" value="" /> --Select One--
                    </label>

                    {/* Filtered Fields of Study */}
                    {filteredFieldsOfStudy.length === 0 ? (
                      <p>No fields of study found.</p>
                    ) : (
                      filteredFieldsOfStudy.map((field) => (
                        <label key={field.id} className="block">
                          <input
                            type="checkbox"
                            value={field.name}
                            checked={selectedFieldsOfStudy.includes(field.name)}
                            onChange={() =>
                              handleFieldOfStudyChange(field.name)
                            }
                          />{" "}
                          {field.name}
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <label className="block mt-2">Education Level</label>
                  <select
                    className="w-full border rounded p-2"
                    value={selectedEducationLevel}
                    onChange={(e) => setSelectedEducationLevel(e.target.value)}
                  >
                    <option value="">--Select One--</option>
                    {educationLevel.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.eduName}{" "}
                        {/* Display the name, but send the ID */}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Min expr</label>
                  <input
                    type="number"
                    value={selectedMinExperience}
                    onChange={(e) =>
                      setSelectedMinExperience(Number(e.target.value))
                    }
                    className="w-full border rounded p-2"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block mb-2">Skill</label>
                  <textarea
                    placeholder="Describe your skills here..."
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded p-2 h-28"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block mb-2">Knowledge</label>
                  <textarea
                    placeholder="Enter your knowledge here..."
                    value={selectedKnowledge}
                    onChange={(e) => setSelectedKnowledge(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded p-2 h-28"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block mb-2">Competency</label>
                  <textarea
                    placeholder="List your competencies here..."
                    value={selectedCompetency}
                    onChange={(e) => setSelectedCompetency(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded p-2 h-28"
                  />
                </div>
              </div>
              <div className="col-span-1 flex justify-start items-end">
                <button
                  onClick={handleAddQualification}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function QualificationPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar hidden={!isSidebarOpen} />
        <div className="flex-1 p-4 transition-all duration-300">
          <JobQualification />
        </div>
      </div>
      <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} INSA ERP. All rights reserved.
      </footer>
    </div>
  );
}
