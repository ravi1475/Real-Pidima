import React, { useState } from 'react';
import { FaFileImport, FaFileExport, FaFileDownload, FaInfoCircle } from 'react-icons/fa';
import { isDarkModeEnabled } from '../utils/themeUtils';

const ImportExport: React.FC = () => {
  const [isDarkMode] = useState(isDarkModeEnabled());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  // Handle import button click
  const handleImport = () => {
    if (!selectedFile) {
      alert('Please select a file to import');
      return;
    }
    // Implement actual import logic here
    console.log('Importing file:', selectedFile.name);
    // Reset selected file after import
    setSelectedFile(null);
  };

  // Handle export button click
  const handleExport = () => {
    // Implement actual export logic here
    console.log('Exporting data...');
  };

  // Handle download template button click
  const handleDownloadTemplate = () => {
    // Implement actual template download logic here
    console.log('Downloading template...');
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Import & Export Data
        </h1>

        <div className={`mb-8 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Import Data
          </h2>
          
          <div className="mb-4">
            <div className={`flex items-center mb-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <FaInfoCircle className="mr-2" />
              <span>Select a properly formatted file to import data into the system.</span>
            </div>
            
            <div className={`relative border rounded-md p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-center">
                <FaFileImport className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span>{selectedFile ? selectedFile.name : 'Choose file...'}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleImport}
            disabled={!selectedFile}
            className={`flex items-center justify-center py-2 px-4 rounded-md font-medium transition-colors duration-150 
              ${!selectedFile 
                ? (isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-500 cursor-not-allowed') 
                : (isDarkMode ? 'bg-primary-dark hover:bg-primary-dark/90 text-white' : 'bg-primary hover:bg-primary/90 text-white')
              }`}
          >
            <FaFileImport className="mr-2" />
            Import Data
          </button>
        </div>

        <div className={`mb-8 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Export Data
          </h2>
          
          <div className="mb-4">
            <div className={`flex items-center mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <FaInfoCircle className="mr-2" />
              <span>Export your system data for backup or transfer purposes.</span>
            </div>
          </div>
          
          <button
            onClick={handleExport}
            className={`flex items-center justify-center py-2 px-4 rounded-md font-medium transition-colors duration-150 ${
              isDarkMode 
                ? 'bg-primary-dark hover:bg-primary-dark/90 text-white' 
                : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            <FaFileExport className="mr-2" />
            Export Data
          </button>
        </div>

        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Templates
          </h2>
          
          <div className="mb-4">
            <div className={`flex items-center mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <FaInfoCircle className="mr-2" />
              <span>Download import file templates to ensure your data is properly formatted.</span>
            </div>
          </div>
          
          <button
            onClick={handleDownloadTemplate}
            className={`flex items-center justify-center py-2 px-4 rounded-md font-medium transition-colors duration-150 ${
              isDarkMode 
                ? 'bg-accent-dark hover:bg-accent-dark/90 text-white' 
                : 'bg-accent hover:bg-accent/90 text-white'
            }`}
          >
            <FaFileDownload className="mr-2" />
            Download Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportExport; 