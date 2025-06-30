import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiPlus, FiEdit2 } from 'react-icons/fi';

interface LanguageOption {
  id: number;
  languageName: string;
}

interface LanguageFormProps {
  onSubmit: (data: {
    languageTypeId: number;
    reading: string;
    speaking: string;
    writing: string;
    listening: string;
  }) => void;
  onCancel: () => void;
  languageOptions: LanguageOption[];
  initialData?: {
    languageTypeId: number;
    reading: string;
    speaking: string;
    writing: string;
    listening: string;
  } | null;
}

const LanguageForm: React.FC<LanguageFormProps> = ({ 
  onSubmit, 
  onCancel, 
  languageOptions,
  initialData 
}) => {
  const [languageTypeId, setLanguageTypeId] = useState<number | null>(null);
  const [reading, setReading] = useState('Select Level');
  const [speaking, setSpeaking] = useState('Select Level');
  const [writing, setWriting] = useState('Select Level');
  const [listening, setListening] = useState('Select Level');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const skillLevels = ['Select Level', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  useEffect(() => {
    if (initialData) {
      setLanguageTypeId(initialData.languageTypeId);
      setReading(initialData.reading);
      setSpeaking(initialData.speaking);
      setWriting(initialData.writing);
      setListening(initialData.listening);
    } else {
      setLanguageTypeId(null);
      setReading('Select Level');
      setSpeaking('Select Level');
      setWriting('Select Level');
      setListening('Select Level');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (languageTypeId && reading !== 'Select Level' && speaking !== 'Select Level' && 
        writing !== 'Select Level' && listening !== 'Select Level') {
      onSubmit({
        languageTypeId,
        reading,
        speaking,
        writing,
        listening
      });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-[#3c8dbc]"
          >
            {initialData ? 'Edit Language' : 'Add New Language'}
          </motion.h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 transition-all"
          >
            <FiX size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Language*
              </label>
              <select
                value={languageTypeId || ''}
                onChange={(e) => setLanguageTypeId(Number(e.target.value))}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
                required
              >
                <option value="">Select Language</option>
                {languageOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.languageName}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Reading*
              </label>
              <select
                value={reading}
                onChange={(e) => setReading(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
                required
              >
                {skillLevels.map((level) => (
                  <option key={`reading-${level}`} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Speaking*
              </label>
              <select
                value={speaking}
                onChange={(e) => setSpeaking(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
                required
              >
                {skillLevels.map((level) => (
                  <option key={`speaking-${level}`} value={level}>
                    {level}
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
                Writing*
              </label>
              <select
                value={writing}
                onChange={(e) => setWriting(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
                required
              >
                {skillLevels.map((level) => (
                  <option key={`writing-${level}`} value={level}>
                    {level}
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
                Listening*
              </label>
              <select
                value={listening}
                onChange={(e) => setListening(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
                required
              >
                {skillLevels.map((level) => (
                  <option key={`listening-${level}`} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex gap-4 justify-end pt-2"
          >
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-1.5 rounded-lg text-white transition-all text-sm ${
                submitSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-[#3c8dbc] hover:bg-[#3678a8]'
              }`}
            >
              {submitSuccess ? 'Success!' : initialData ? 'Update' : 'Add'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default LanguageForm;