import { getKeyboardRows, getNextKeyboardMode } from "../utils/Helpers";

function Keyboard({
  canUndo,
  isDocumentOpen,
  isCapsLockOn,
  isVirtualShiftOn,
  keyboardMode,
  replaceValue,
  searchValue,
  onClearText,
  onDeleteCharacter,
  onDeleteWord,
  onInsertText,
  onKeyboardModeChange,
  onReplace,
  onReplaceChange,
  onSearchChange,
  onToggleCapsLock,
  onToggleVirtualShift,
  onUndo,
}) {
  const activeKeyboard = getKeyboardRows(
    keyboardMode,
    isVirtualShiftOn,
    isCapsLockOn,
  );

  function handleDeleteClick(event) {
    if (event.altKey) {
      onDeleteWord();
      return;
    }

    onDeleteCharacter();
  }

  function handleLanguageToggle() {
    onKeyboardModeChange(getNextKeyboardMode(keyboardMode));
  }

  return (
    <div className="editor-keyboard-pane">
      <div className="editor-top-bar">
        <button
          type="button"
          className="editor-button editor-button-icon"
          onClick={handleLanguageToggle}
          disabled={!isDocumentOpen}
        >
          <img className="editor-icon" src="/icons/globe.svg" />
        </button>

        <div className="editor-find-replace">
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Find"
            disabled={!isDocumentOpen}
          />
          <input
            type="text"
            value={replaceValue}
            onChange={(event) => onReplaceChange(event.target.value)}
            placeholder="Replace"
            disabled={!isDocumentOpen}
          />
          <button
            type="button"
            className="editor-button editor-button-icon"
            onClick={onReplace}
            disabled={!isDocumentOpen}
          >
            <img className="editor-icon" src="/icons/replace.svg" />
          </button>
        </div>

        <div className="editor-top-actions">
          <button
            type="button"
            className="editor-button editor-button-icon"
            onClick={onUndo}
            disabled={!canUndo || !isDocumentOpen}
          >
            <img className="editor-icon" src="/icons/undo.svg" />
          </button>
          <button
            type="button"
            className="editor-button editor-button-danger"
            onClick={onClearText}
            disabled={!isDocumentOpen}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="editor-keyboard">
        <div className="keyboard-row">
          {activeKeyboard[0].map((keyValue) => (
            <button
              type="button"
              key={keyValue}
              className="keyboard-key"
              onClick={() => onInsertText(keyValue)}
              disabled={!isDocumentOpen}
            >
              {keyValue}
            </button>
          ))}

          <button
            type="button"
            className="keyboard-key keyboard-key-delete"
            onClick={handleDeleteClick}
            disabled={!isDocumentOpen}
          >
            Delete
          </button>
        </div>

        <div className="keyboard-row">
          <button
            type="button"
            className="keyboard-key keyboard-key-tab"
            onClick={() => onInsertText("\t")}
            disabled={!isDocumentOpen}
          >
            Tab
          </button>

          {activeKeyboard[1].map((keyValue) => (
            <button
              type="button"
              key={keyValue}
              className="keyboard-key"
              onClick={() => onInsertText(keyValue)}
              disabled={!isDocumentOpen}
            >
              {keyValue}
            </button>
          ))}
        </div>

        <div className="keyboard-row">
          <button
            type="button"
            className={
              isCapsLockOn
                ? "keyboard-key keyboard-key-caps is-active"
                : "keyboard-key keyboard-key-caps"
            }
            onClick={onToggleCapsLock}
            disabled={!isDocumentOpen}
          >
            Caps
          </button>

          {activeKeyboard[2].map((keyValue) => (
            <button
              type="button"
              key={keyValue}
              className="keyboard-key"
              onClick={() => onInsertText(keyValue)}
              disabled={!isDocumentOpen}
            >
              {keyValue}
            </button>
          ))}

          <button
            type="button"
            className="keyboard-key keyboard-key-enter"
            onClick={() => onInsertText("\n")}
            disabled={!isDocumentOpen}
          >
            Enter
          </button>
        </div>

        <div className="keyboard-row">
          <button
            type="button"
            className={
              isVirtualShiftOn
                ? "keyboard-key keyboard-key-shift is-active"
                : "keyboard-key keyboard-key-shift"
            }
            onClick={onToggleVirtualShift}
            disabled={!isDocumentOpen}
          >
            Shift
          </button>

          {activeKeyboard[3].map((keyValue) => (
            <button
              type="button"
              key={keyValue}
              className="keyboard-key"
              onClick={() => onInsertText(keyValue)}
              disabled={!isDocumentOpen}
            >
              {keyValue}
            </button>
          ))}

          <button
            type="button"
            className={
              isVirtualShiftOn
                ? "keyboard-key keyboard-key-shift is-active"
                : "keyboard-key keyboard-key-shift"
            }
            onClick={onToggleVirtualShift}
            disabled={!isDocumentOpen}
          >
            Shift
          </button>
        </div>

        <div className="keyboard-bottom">
          <button
            type="button"
            className="keyboard-key keyboard-key-space"
            onClick={() => onInsertText(" ")}
            disabled={!isDocumentOpen}
          >
            Space
          </button>
        </div>
      </div>
    </div>
  );
}

export default Keyboard;
