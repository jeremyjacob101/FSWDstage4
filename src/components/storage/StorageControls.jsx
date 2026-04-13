import { useState } from "react";
import { listUserFiles, loadUserFile } from "../utils/AuthStorage";
import "./Storage.css";

export default function StorageControls({
  currentUser,
  runs,
  canSave,
  canLoad,
  onLoadRuns,
  onSaveRuns,
}) {
  const [savedFiles, setSavedFiles] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleSaveClick() {
    if (!canSave) {
      return;
    }

    const didSave = onSaveRuns(runs);
    if (didSave && isMenuOpen) {
      loadSavedFiles();
    }
  }

  function loadSavedFiles() {
    setSavedFiles(listUserFiles(currentUser));
  }

  function handleMenuToggle() {
    if (!canLoad) {
      return;
    }

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
      const parsedRuns = loadUserFile(currentUser, fileName);
      if (Array.isArray(parsedRuns)) {
        onLoadRuns(parsedRuns);
      } else {
        window.alert("Error loading file.");
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
          title={canLoad ? "Load File" : "Maximum of 5 screens reached"}
          disabled={!canLoad}
        >
          <img className="editor-icon" src="/icons/download.svg" alt="Load" />
        </button>

        {isMenuOpen && canLoad && (
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
