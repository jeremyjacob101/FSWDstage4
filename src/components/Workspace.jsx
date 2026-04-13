import { DEFAULT_STYLE } from "./utils/Defaults";
import {
  applyStyleToAll,
  clearText,
  cloneRuns,
  deleteLastCharacter,
  deleteLastWord,
  insertText,
  replaceText,
} from "./utils/Helpers";
import { useState } from "react";
import Editor from "./editors/Editor";
import Screen from "./screens/Screen";

function Workspace() {
  const [runs, setRuns] = useState([]);
  const [typingStyle, setTypingStyle] = useState(DEFAULT_STYLE);
  const [keyboardMode, setKeyboardMode] = useState("english");
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [isVirtualShiftOn, setIsVirtualShiftOn] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [history, setHistory] = useState([]);

  function rememberState(snapshotRuns = runs, snapshotStyle = typingStyle) {
    setHistory((currentHistory) => [
      ...currentHistory.slice(-20),
      {
        runs: cloneRuns(snapshotRuns),
        typingStyle: { ...snapshotStyle },
      },
    ]);
  }

  function updateRuns(nextRuns) {
    if (nextRuns === runs) {
      return;
    }

    rememberState();
    setRuns(nextRuns);
  }

  function handleChangeTypingStyle(key, value) {
    setTypingStyle((currentStyle) => ({
      ...currentStyle,
      [key]: value,
    }));
  }

  function handleInsertText(value) {
    updateRuns(insertText(runs, value, typingStyle));

    if (isVirtualShiftOn) {
      setIsVirtualShiftOn(false);
    }
  }

  function handleUndo() {
    const previousState = history[history.length - 1];
    if (!previousState) return;

    setRuns(cloneRuns(previousState.runs));
    setTypingStyle({ ...previousState.typingStyle });
    setHistory((currentHistory) => currentHistory.slice(0, -1));
  }

  const screenProps = {
    runs,
    searchValue,
    typingStyle,
  };

  const editorProps = {
    runs,
    onLoadRuns: (newRuns) => {
      rememberState();
      setRuns(newRuns);
    },
    canUndo: history.length > 0,
    isCapsLockOn,
    isVirtualShiftOn,
    keyboardMode,
    replaceValue,
    searchValue,
    typingStyle,
    onApplyAll: () => updateRuns(applyStyleToAll(runs, typingStyle)),
    onChangeTypingStyle: handleChangeTypingStyle,
    onClearText: () => updateRuns(clearText(runs)),
    onDeleteCharacter: () => updateRuns(deleteLastCharacter(runs)),
    onDeleteWord: () => updateRuns(deleteLastWord(runs)),
    onInsertText: handleInsertText,
    onKeyboardModeChange: setKeyboardMode,
    onToggleCapsLock: () => setIsCapsLockOn((currentValue) => !currentValue),
    onToggleVirtualShift: () =>
      setIsVirtualShiftOn((currentValue) => !currentValue),
    onReplace: () => updateRuns(replaceText(runs, searchValue, replaceValue)),
    onReplaceChange: setReplaceValue,
    onSearchChange: setSearchValue,
    onUndo: handleUndo,
  };

  return (
    <>
      <Screen {...screenProps} />
      <Editor {...editorProps} />
    </>
  );
}

export default Workspace;
