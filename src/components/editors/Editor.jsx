import Keyboard from "./Keyboard";
import StorageControls from "../storage/StorageControls";
import TextStyling from "./TextStyling";

function Editor({
  runs,
  onLoadRuns,
  canUndo,
  isDocumentOpen,
  isCapsLockOn,
  isVirtualShiftOn,
  keyboardMode,
  replaceValue,
  searchValue,
  typingStyle,
  onApplyAll,
  onChangeTypingStyle,
  onResetTypingStyle,
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
  return (
    <section className="panel editor">
      <Keyboard
        canUndo={canUndo}
        isDocumentOpen={isDocumentOpen}
        isCapsLockOn={isCapsLockOn}
        isVirtualShiftOn={isVirtualShiftOn}
        keyboardMode={keyboardMode}
        replaceValue={replaceValue}
        searchValue={searchValue}
        onClearText={onClearText}
        onDeleteCharacter={onDeleteCharacter}
        onDeleteWord={onDeleteWord}
        onInsertText={onInsertText}
        onKeyboardModeChange={onKeyboardModeChange}
        onReplace={onReplace}
        onReplaceChange={onReplaceChange}
        onSearchChange={onSearchChange}
        onToggleCapsLock={onToggleCapsLock}
        onToggleVirtualShift={onToggleVirtualShift}
        onUndo={onUndo}
      />

      <div className="editor-sidebar">
        <div className="editor-sidebar-header">
          <button
            type="button"
            className="editor-button editor-button-icon"
            disabled={!isDocumentOpen}
          >
            <img className="editor-icon" src="/icons/user.svg" alt="User" />
          </button>

          <StorageControls
            runs={runs}
            canSave={isDocumentOpen}
            onLoadRuns={onLoadRuns}
          />
        </div>

        <TextStyling
          isDocumentOpen={isDocumentOpen}
          typingStyle={typingStyle}
          onApplyAll={onApplyAll}
          onChangeTypingStyle={onChangeTypingStyle}
          onResetTypingStyle={onResetTypingStyle}
        />
      </div>
    </section>
  );
}

export default Editor;
