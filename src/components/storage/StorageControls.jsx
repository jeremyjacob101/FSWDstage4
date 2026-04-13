import { useState, useEffect, useRef } from "react";
import "./StorageControls.css";

export default function StorageControls({ runs, onLoadRuns }) {
  const [savedFiles, setSavedFiles] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    loadSavedFiles();
  }, []);

  function loadSavedFiles() {
    const files = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('save_')) {
            files.push(key.substring(5));
        }
    }
    setSavedFiles(files);
  }

  const handleSave = () => {
    const name = window.prompt("Enter a name to save this text (Save As):");
    if (!name) return;
    try {
        localStorage.setItem(`save_${name}`, JSON.stringify(runs));
        loadSavedFiles();
    } catch (e) {
        window.alert("Failed to save. Storage might be full.");
    }
  };

  const handleLoad = (name) => {
    if (!name) return;
    try {
        const data = localStorage.getItem(`save_${name}`);
        if (data) {
            const parsed = JSON.parse(data);
            onLoadRuns(parsed);
        }
    } catch (e) {
        window.alert("Failed to load file.");
    }
    setIsDropdownOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="editor-button editor-button-icon"
        onClick={handleSave}
        title="Save As"
      >
        <img className="editor-icon" src="/icons/upload.svg" alt="Save As" />
      </button>

      <div className="storage-dropdown-container" ref={dropdownRef}>
        <button
          type="button"
          className="editor-button editor-button-icon"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          title="Load"
        >
          <img className="editor-icon" src="/icons/download.svg" alt="Load" />
        </button>

        {isDropdownOpen && (
          <div className="storage-dropdown-menu">
            {savedFiles.length === 0 ? (
              <div className="storage-dropdown-empty">No saved files</div>
            ) : (
              savedFiles.map((file) => (
                <button
                  key={file}
                  type="button"
                  className="storage-dropdown-item"
                  onClick={() => handleLoad(file)}
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
