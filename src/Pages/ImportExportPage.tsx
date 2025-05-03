import React from 'react';
import ImportExport from '../Components/ImportExport';

const ImportExportPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <ImportExport />
      </div>
    </div>
  );
};

export default ImportExportPage; 