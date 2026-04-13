import Keyboard from "./Keyboard";
import UserMenu from "../auth/UserMenu";
import StorageControls from "../storage/StorageControls";
import TextStyling from "./TextStyling";
import "./Editors.css";

function Editor({
  currentUser,
  runs,
  canLoadRuns,
  onLoadRuns,
  onCreateAccount,
  onLogOut,
  onSaveRuns,
  onSignIn,
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
          <UserMenu
            currentUser={currentUser}
            onCreateAccount={onCreateAccount}
            onLogOut={onLogOut}
            onSignIn={onSignIn}
          />

          <StorageControls
            currentUser={currentUser}
            runs={runs}
            canSave={isDocumentOpen}
            canLoad={canLoadRuns}
            onLoadRuns={onLoadRuns}
            onSaveRuns={onSaveRuns}
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
