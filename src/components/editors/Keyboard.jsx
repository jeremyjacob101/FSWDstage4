import { getKeyboardRows, getNextKeyboardMode } from "../utils/Helpers";
import StorageControls from "../storage/StorageControls";

function Keyboard({
  runs,
  onLoadRuns,
  canUndo,
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
  const isShiftActive = isVirtualShiftOn;
  const activeKeyboard = getKeyboardRows(
    keyboardMode,
    isShiftActive,
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
        >
          <img className="editor-icon" src="/icons/globe.svg" />
        </button>
        <StorageControls runs={runs} onLoadRuns={onLoadRuns} />

        <div className="editor-find-replace">
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Find"
          />
          <input
            type="text"
            value={replaceValue}
            onChange={(event) => onReplaceChange(event.target.value)}
            placeholder="Replace"
          />
          <button
            type="button"
            className="editor-button editor-button-icon"
            onClick={onReplace}
          >
            <img className="editor-icon" src="/icons/replace.svg" />
          </button>
        </div>

        <div className="editor-top-actions">
          <button
            type="button"
            className="editor-button editor-button-icon"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <img className="editor-icon" src="/icons/undo.svg" />
          </button>
          <button
            type="button"
            className="editor-button editor-button-danger"
            onClick={onClearText}
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
            >
              {keyValue}
            </button>
          ))}

          <button
            type="button"
            className="keyboard-key keyboard-key-delete"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>

        <div className="keyboard-row">
          <button
            type="button"
            className="keyboard-key keyboard-key-tab"
            onClick={() => onInsertText("\t")}
          >
            Tab
          </button>

          {activeKeyboard[1].map((keyValue) => (
            <button
              type="button"
              key={keyValue}
              className="keyboard-key"
              onClick={() => onInsertText(keyValue)}
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
          >
            Caps
          </button>

          {activeKeyboard[2].map((keyValue) => (
            <button
              type="button"
              key={keyValue}
              className="keyboard-key"
              onClick={() => onInsertText(keyValue)}
            >
              {keyValue}
            </button>
          ))}

          <button
            type="button"
            className="keyboard-key keyboard-key-enter"
            onClick={() => onInsertText("\n")}
          >
            Enter
          </button>
        </div>

        <div className="keyboard-row">
          <button
            type="button"
            className={
              isShiftActive
                ? "keyboard-key keyboard-key-shift is-active"
                : "keyboard-key keyboard-key-shift"
            }
            onClick={onToggleVirtualShift}
          >
            Shift
          </button>

          {activeKeyboard[3].map((keyValue) => (
            <button
              type="button"
              key={keyValue}
              className="keyboard-key"
              onClick={() => onInsertText(keyValue)}
            >
              {keyValue}
            </button>
          ))}

          <button
            type="button"
            className={
              isShiftActive
                ? "keyboard-key keyboard-key-shift is-active"
                : "keyboard-key keyboard-key-shift"
            }
            onClick={onToggleVirtualShift}
          >
            Shift
          </button>
        </div>

        <div className="keyboard-bottom">
          <button
            type="button"
            className="keyboard-key keyboard-key-space"
            onClick={() => onInsertText(" ")}
          >
            Space
          </button>
        </div>
      </div>
    </div>
  );
}

export default Keyboard;
