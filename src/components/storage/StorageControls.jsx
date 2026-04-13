import { useState } from "react";
import "./StorageControls.css";

export default function StorageControls({ runs, onLoadRuns }) {
  const [savedFiles, setSavedFiles] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleSaveClick() {
    const fileName = window.prompt("Please enter a name to save the file:");
    
    if (!fileName) {
      return;
    }

    try {
      const dataAsText = JSON.stringify(runs);
      localStorage.setItem(`save_${fileName}`, dataAsText);
      
      if (isMenuOpen) {
         updateSavedFilesList();
      }
    } catch (error) {
      window.alert("Error! Could not save. Storage might be full.");
    }
  }

  function updateSavedFilesList() {
    const filesFound = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("save_")) {
            const justTheName = key.substring(5);
            filesFound.push(justTheName);
        }
    }
    
    setSavedFiles(filesFound);
  }

  function handleDownloadMenuClick() {
    if (!isMenuOpen) {
      updateSavedFilesList();
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  }

  function handleLoadFile(fileName) {
    try {
      const savedData = localStorage.getItem(`save_${fileName}`);
      if (savedData) {
        const parsedRuns = JSON.parse(savedData);
        onLoadRuns(parsedRuns);
      }
    } catch (error) {
      window.alert("Error loading file.");
    }
    
    setIsMenuOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="editor-button editor-button-icon"
        onClick={handleSaveClick}
        title="Save As"
      >
        <img className="editor-icon" src="/icons/upload.svg" alt="Save As" />
      </button>

      <div className="storage-dropdown-container">
        <button
          type="button"
          className="editor-button editor-button-icon"
          onClick={handleDownloadMenuClick}
          title="Load File"
        >
          <img className="editor-icon" src="/icons/download.svg" alt="Load" />
        </button>

        {isMenuOpen && (
          <div className="storage-dropdown-menu">
            {savedFiles.length === 0 ? (
              <div className="storage-dropdown-empty">No files to load</div>
            ) : (
              savedFiles.map((file) => (
                <button
                  key={file}
                  type="button"
                  className="storage-dropdown-item"
                  onClick={() => handleLoadFile(file)}
                >
                  {file}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
