"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AppModuleLayout from "../../components/AppModuleLayout";
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
  const [filteredIcfs, setFilteredIcfs] = useState<ICF[]>([]);
  const [fieldsOfStudy, setFieldsOfStudy] = useState<
    { id: number; name: string }[]
  >([]);
  const [filteredFieldsOfStudy, setFilteredFieldsOfStudy] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedFieldsOfStudy, setSelectedFieldsOfStudy] = useState<string[]>(
    []
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
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
      id?: number;
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
    axios
      .get("http://localhost:8080/api/job_types/job-titles")
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching job titles:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get<string[]>(
        "http://localhost:8080/api/job-type-details/distinct-icf-values"
      )
      .then((response) => {
        const uniqueIcfs = Array.from(new Set(response.data));
        setIcfs(
          uniqueIcfs.map((icf, index) => ({
            id: index,
            ICF: icf,
            icf,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching ICF values:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedJobTypeId) {
      axios
        .get<string[]>(
          `http://localhost:8080/api/job-type-details/icfs-by-job-type-id?jobTypeId=${selectedJobTypeId}`
        )
        .then((response) => {
          const uniqueIcfs = Array.from(new Set(response.data));
          setFilteredIcfs(
            uniqueIcfs.map((icf, index) => ({
              id: index,
              ICF: icf,
              icf,
            }))
          );
        })
        .catch((error) => {
          console.error("Error fetching filtered ICF values:", error);
        });
    } else {
      setFilteredIcfs([]);
    }
  }, [selectedJobTypeId]);

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
          setSelectedJobTypeId(jobTypeId);
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
        setFieldsOfStudy(response.data);
        setFilteredFieldsOfStudy(response.data);
      })
      .catch((error) => {
        console.error("Error fetching fields of study:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/education-levels/education-categories")
      .then((response) => {
        setEducationCategories(response.data);
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

  useEffect(() => {
    if (selectedJobTypeId && selectedICF) {
      fetchAndDisplayQualifications(Number(selectedJobTypeId), selectedICF);
    }
  }, [selectedJobTypeId, selectedICF]);

  const fetchAndDisplayQualifications = async (
    jobTypeId: number,
    icfValue: string
  ) => {
    const response = await axios.get(
      `http://localhost:8080/api/qualifications/by-job-title-and-icf-value?jobTypeId=${jobTypeId}&icfValue=${encodeURIComponent(
        icfValue
      )}`
    );
    const qualifications = response.data;
    setQualifications(
      qualifications.map((q: any) => ({
        id: q.id,
        educationCategory: q.qualification,
        educationLevel: q.educationLevel?.id?.toString() || "",
        fieldsOfStudy: q.fieldsOfStudy || [],
        minExperience: q.minExperience,
        skill: q.skill,
        knowledge: q.knowledge,
        competency: q.keyCompetency,
      }))
    );
  };

  const handleFieldOfStudyChange = (fieldName: string) => {
    setSelectedFieldsOfStudy((prevSelected) =>
      prevSelected.includes(fieldName)
        ? prevSelected.filter((name) => name !== fieldName)
        : [...prevSelected, fieldName]
    );
  };

  const handleDeleteQualification = (index: number) => {
    setQualifications((prevQualifications) =>
      prevQualifications.filter((_, i) => i !== index)
    );
  };

  const handleEditQualification = (index: number) => {
    const qualificationToEdit = qualifications[index];
    setEditingIndex(index);
    setEditingId(qualificationToEdit.id ?? null);
    setSelectedEducationCategory(qualificationToEdit.educationCategory);
    setSelectedEducationLevel(qualificationToEdit.educationLevel);
    setSelectedFieldsOfStudy(qualificationToEdit.fieldsOfStudy);
    setSelectedMinExperience(qualificationToEdit.minExperience);
    setSelectedSkill(qualificationToEdit.skill);
    setSelectedKnowledge(qualificationToEdit.knowledge);
    setSelectedCompetency(qualificationToEdit.competency);
    setShowModal(true);
  };
  const handleModalSaveQualification = () => {
    if (
      !selectedEducationCategory ||
      !selectedEducationLevel ||
      selectedFieldsOfStudy.length === 0
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const newQualification = {
      educationCategory: selectedEducationCategory,
      educationLevel: selectedEducationLevel,
      fieldsOfStudy: selectedFieldsOfStudy,
      minExperience: selectedMinExperience,
      skill: selectedSkill,
      knowledge: selectedKnowledge,
      competency: selectedCompetency,
    };

    if (editingId !== null) {
      setQualifications((prev) =>
        prev.map((q) =>
          q.id === editingId ? { ...newQualification, id: editingId } : q
        )
      );
      toast.success("Qualification updated!");
    } else {
      setQualifications((prev) => [
        ...prev,
        { ...newQualification, id: Date.now() },
      ]);
      toast.success("Qualification added!");
    }

    setEditingIndex(null);
    setEditingId(null);
    setSelectedEducationCategory("");
    setSelectedEducationLevel("");
    setSelectedFieldsOfStudy([]);
    setSelectedMinExperience(0);
    setSelectedSkill("");
    setSelectedKnowledge("");
    setSelectedCompetency("");
    setShowModal(false);
  };
  const handleSaveQualifications = async () => {
    if (qualifications.length === 0) {
      toast.error("No qualifications added.");
      return;
    }
    try {
      const payload = qualifications.map((qualification) => {
        const id =
          typeof qualification.id === "number" && qualification.id < 1000000
            ? qualification.id
            : null;

        return {
          ...(id !== null && { id }),
          jobType: { id: selectedJobTypeId },
          keyCompetency: qualification.competency,
          knowledge: qualification.knowledge,
          skill: qualification.skill,
          minExperience: qualification.minExperience,
          qualification: qualification.educationCategory,
          educationLevel: { id: Number(qualification.educationLevel) },
        };
      });

      const response = await axios.post(
        "http://localhost:8080/api/qualifications/bulk",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Qualifications saved successfully!");
        setQualifications([]);

        const savedQualifications = response.data;
        let hrFieldOfStudyPayload: any[] = [];
        savedQualifications.forEach((qualification: any, idx: number) => {
          qualifications[idx].fieldsOfStudy.forEach((fieldName: string) => {
            const field = fieldsOfStudy.find((f) => f.name === fieldName);
            if (field) {
              hrFieldOfStudyPayload.push({
                jobQualification: { id: qualification.id },
                fieldOfStudy: { id: field.id },
              });
            }
          });
        });

        if (hrFieldOfStudyPayload.length > 0) {
          await axios.post(
            "http://localhost:8080/api/hr-field-of-study/bulk",
            hrFieldOfStudyPayload
          );
        }
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
      <div className="p-2 sm:p-4 font-sans bg-white min-h-screen">
        <Toaster />
        {/* Search Job Position */}
        <h1 className="text-2xl font-bold mb-4">Search Job Position</h1>
        <div className="bg-white p-4 shadow rounded mb-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
              <span className="text-gray-700 sm:w-16">Jobs:</span>
              <select
                className="w-full sm:flex-1 border rounded p-2 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
              <span className="text-gray-700 sm:w-16">ICF:</span>
              <select
                className="w-full sm:flex-1 border rounded p-2 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                value={selectedICF}
                onChange={(e) => setSelectedICF(e.target.value)}
              >
                <option value="">--Select One--</option>
                {icfs.map((icf) => (
                  <option key={icf.id} value={icf.icf}>
                    {icf.icf}
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
          <div className="grid grid-cols-1 text-sm md:grid-cols-2 gap-4 mb-4">
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
              <label>ICF:</label>
              {filteredIcfs.some((icf) => icf.icf === selectedICF) ? (
                <span>{selectedICF}</span>
              ) : selectedICF ? (
                <span className="text-gray-500"></span>
              ) : (
                <span className="text-gray-500"></span>
              )}
            </div>
          </div>
          {/* Qualifications Table */}
          <div className="overflow-x-auto mt-6">
            <table className="w-full border border-gray-300 bg-white text-xs md:text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th colSpan={9} className="text-center py-2">
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl"
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
                      <td className="border px-2 py-2 text-xs text-center">
                        {index + 1}
                      </td>
                      <td className="border px-2 py-2 text-xs">
                        {qualification.educationCategory}
                      </td>
                      <td className="border px-2 py-2 text-xs">
                        {qualification.educationLevel}
                      </td>
                      <td className="border px-2 py-2">
                        {qualification.fieldsOfStudy.join(", ")}
                      </td>
                      <td className="border px-2 py-2 text-xs">
                        {qualification.minExperience}
                      </td>
                      <td className="border px-2 py-2 text-xs">
                        {qualification.skill}
                      </td>
                      <td className="border px-2 py-2 text-xs">
                        {qualification.knowledge}
                      </td>
                      <td className="border px-2 py-2 text-xs">
                        {qualification.competency}
                      </td>
                      <td className="border px-2 py-2 text-center">
                        <button
                          onClick={() => handleEditQualification(index)}
                          className="bg-blue-500 text-white px-2 py-1 mb-2 sm:mb-0 rounded hover:bg-blue-600 mr-2"
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
          <div className="flex flex-col sm:flex-row justify-start mt-4 gap-2">
            <button
              onClick={handleSaveQualifications}
              className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Save
            </button>
          </div>
        </div>
        {/* Modal: Add Qualification */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto border border-gray-200 backdrop-blur-sm">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-red-500"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold text-[#3c8dbc] mb-4">
                Qualification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Education Category */}
                <div>
                  <label className="block mb-2">Education Category</label>
                  <select
                    className="w-full border rounded p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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
                  <div className="w-full border-2 border-gray-200 rounded p-2 max-h-32 overflow-y-auto">
                    {/* Search Field */}
                    <input
                      type="text"
                      className="w-full border-gray-300 border-b rounded p-0.5 mb-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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
                    className="w-full border rounded p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    value={selectedEducationLevel}
                    onChange={(e) => setSelectedEducationLevel(e.target.value)}
                  >
                    <option value="">--Select One--</option>
                    {educationLevel.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.eduName}{" "}
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
                    className="w-full border rounded p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block mb-2">Skill</label>
                  <textarea
                    placeholder="Describe your skills here..."
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded p-2 h-28 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block mb-2">Knowledge</label>
                  <textarea
                    placeholder="Enter your knowledge here..."
                    value={selectedKnowledge}
                    onChange={(e) => setSelectedKnowledge(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded p-2 h-28 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block mb-2">Competency</label>
                  <textarea
                    placeholder="List your competencies here..."
                    value={selectedCompetency}
                    onChange={(e) => setSelectedCompetency(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded p-2 h-28 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
              </div>
              <div className="col-span-1 flex justify-start items-end mt-4">
                <button
                  onClick={handleModalSaveQualification}
                  className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl"
                >
                  {editingIndex !== null ? "Update" : "Add"}
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
  return (
    <AppModuleLayout>
      <JobQualification />
    </AppModuleLayout>
  );
}
