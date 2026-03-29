import Keyboard from "./Keyboard";
import TextStyling from "./TextStyling";

function Editor({
  canUndo,
  isCapsLockOn,
  isVirtualShiftOn,
  keyboardMode,
  replaceValue,
  searchValue,
  typingStyle,
  onApplyAll,
  onChangeTypingStyle,
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

      <TextStyling
        typingStyle={typingStyle}
        onApplyAll={onApplyAll}
        onChangeTypingStyle={onChangeTypingStyle}
      />
    </section>
  );
}

export default Editor;
