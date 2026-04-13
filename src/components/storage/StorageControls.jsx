import { useState } from "react";
import "./StorageControls.css";

export default function StorageControls({ runs, canSave, onLoadRuns }) {
  const [savedFiles, setSavedFiles] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleSaveClick() {
    if (!canSave) {
      return;
    }

    const fileName = window.prompt("Please enter a name to save the file:");
    const trimmedFileName = fileName?.trim();

    if (!trimmedFileName) {
      return;
    }

    if (localStorage.getItem(trimmedFileName) !== null) {
      window.alert("File already exists.");
      return;
    }

    try {
      const dataAsText = JSON.stringify(runs);
      localStorage.setItem(trimmedFileName, dataAsText);

      if (isMenuOpen) {
        loadSavedFiles();
      }
    } catch {
      window.alert("Error! Could not save. Storage might be full.");
    }
  }

  function loadSavedFiles() {
    const filesFound = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        filesFound.push(key);
      }
    }

    filesFound.sort((firstFile, secondFile) =>
      firstFile.localeCompare(secondFile),
    );
    setSavedFiles(filesFound);
  }

  function handleMenuToggle() {
    if (!isMenuOpen) {
      loadSavedFiles();
      setIsMenuOpen(true);
      return;
    }

    setIsMenuOpen(false);
  }

  function handleMenuBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsMenuOpen(false);
    }
  }

  function handleLoadFile(fileName) {
    try {
      const savedData = localStorage.getItem(fileName);
      if (savedData) {
        const parsedRuns = JSON.parse(savedData);
        onLoadRuns(parsedRuns);
      }
    } catch {
      window.alert("Error loading file.");
    }

    setIsMenuOpen(false);
  }

  return (
    <div className="storage-controls-container">
      <button
        type="button"
        className="editor-button editor-button-icon"
        onClick={handleSaveClick}
        title="Save As"
        disabled={!canSave}
      >
        <img className="editor-icon" src="/icons/upload.svg" alt="Save As" />
      </button>

      <div className="storage-dropdown-container" onBlur={handleMenuBlur}>
        <button
          type="button"
          className="editor-button editor-button-icon"
          onClick={handleMenuToggle}
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
    </div>
  );
}
