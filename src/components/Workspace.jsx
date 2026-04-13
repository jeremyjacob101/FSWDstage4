import { DEFAULT_STYLE } from "./utils/Defaults";
import {
  applyStyleToAll,
  clearText,
  cloneRuns,
  deleteLastCharacter,
  deleteLastWord,
  getPlainText,
  insertText,
  replaceText,
} from "./utils/Helpers";
import { useState } from "react";
import Editor from "./editors/Editor";
import ScreensPanel from "./screens/ScreensPanel";

const MAX_SCREENS = 5;

function cloneScreens(screens) {
  return screens.map((screen) => ({
    id: screen.id,
    runs: cloneRuns(screen.runs),
  }));
}

function Workspace() {
  const [screens, setScreens] = useState([]);
  const [selectedScreenId, setSelectedScreenId] = useState(null);
  const [enteringScreenId, setEnteringScreenId] = useState(null);
  const [nextScreenId, setNextScreenId] = useState(1);
  const [typingStyle, setTypingStyle] = useState(DEFAULT_STYLE);
  const [keyboardMode, setKeyboardMode] = useState("english");
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [isVirtualShiftOn, setIsVirtualShiftOn] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [history, setHistory] = useState([]);
  const activeScreen =
    screens.find((screen) => screen.id === selectedScreenId) ??
    screens[0] ??
    null;
  const activeScreenId = activeScreen?.id ?? null;
  const runs = activeScreen ? activeScreen.runs : [];
  const isDocumentOpen = activeScreen !== null;

  function rememberState(
    snapshotScreens = screens,
    snapshotStyle = typingStyle,
    snapshotScreenId = activeScreenId,
  ) {
    setHistory((currentHistory) => [
      ...currentHistory.slice(-20),
      {
        screens: cloneScreens(snapshotScreens),
        selectedScreenId: snapshotScreenId,
        typingStyle: { ...snapshotStyle },
      },
    ]);
  }

  function updateRuns(nextRuns) {
    if (!activeScreen || nextRuns === runs) {
      return;
    }

    rememberState();
    setScreens((currentScreens) =>
      currentScreens.map((screen) =>
        screen.id === activeScreen.id
          ? {
              ...screen,
              runs: nextRuns,
            }
          : screen,
      ),
    );
  }

  function handleChangeTypingStyle(key, value) {
    setTypingStyle((currentStyle) => ({
      ...currentStyle,
      [key]: value,
    }));
  }

  function handleResetTypingStyle() {
    setTypingStyle({ ...DEFAULT_STYLE });
  }

  function handleCreateScreen(initialRuns = []) {
    if (screens.length >= MAX_SCREENS) {
      return;
    }

    const nextRuns = Array.isArray(initialRuns) ? cloneRuns(initialRuns) : [];

    const nextScreen = {
      id: nextScreenId,
      runs: nextRuns,
    };

    rememberState();
    setScreens((currentScreens) => [...currentScreens, nextScreen]);
    setSelectedScreenId(nextScreen.id);
    setEnteringScreenId(nextScreen.id);
    setNextScreenId((currentId) => currentId + 1);
  }

  function saveRunsToLocalStorage(targetRuns) {
    const fileName = window.prompt("Please enter a name to save the file:");
    const trimmedFileName = fileName?.trim();

    if (!trimmedFileName) {
      return false;
    }

    if (localStorage.getItem(trimmedFileName) !== null) {
      window.alert("File already exists.");
      return false;
    }

    try {
      localStorage.setItem(trimmedFileName, JSON.stringify(targetRuns));
      return true;
    } catch {
      window.alert("Error! Could not save. Storage might be full.");
      return false;
    }
  }

  function handleSelectScreen(screenId) {
    setSelectedScreenId(screenId);
    setEnteringScreenId(null);
  }

  function handleScreenAnimationEnd(screenId) {
    if (screenId === enteringScreenId) {
      setEnteringScreenId(null);
    }
  }

  function handleInsertText(value) {
    if (!activeScreen) {
      return;
    }

    updateRuns(insertText(runs, value, typingStyle));

    if (isVirtualShiftOn) {
      setIsVirtualShiftOn(false);
    }
  }

  function handleUndo() {
    const previousState = history[history.length - 1];
    if (!previousState) return;

    setScreens(cloneScreens(previousState.screens));
    setSelectedScreenId(previousState.selectedScreenId);
    setTypingStyle({ ...previousState.typingStyle });
    setEnteringScreenId(null);
    setHistory((currentHistory) => currentHistory.slice(0, -1));
  }

  function handleLoadRuns(newRuns) {
    if (screens.length >= MAX_SCREENS) {
      window.alert("Maximum of 5 screens reached.");
      return;
    }

    handleCreateScreen(newRuns);
  }

  function handleCloseScreen(screenId) {
    const screenToClose = screens.find((screen) => screen.id === screenId);
    if (!screenToClose) {
      return;
    }

    const hasContent = getPlainText(screenToClose.runs).trim() !== "";
    if (hasContent) {
      const shouldSave = window.confirm("Save this screen before closing?");
      if (shouldSave && !saveRunsToLocalStorage(screenToClose.runs)) {
        return;
      }
    }

    rememberState();

    const remainingScreens = screens.filter((screen) => screen.id !== screenId);
    setScreens(remainingScreens);
    setEnteringScreenId(null);

    if (remainingScreens.length === 0) {
      setSelectedScreenId(null);
      return;
    }

    if (selectedScreenId !== screenId) {
      return;
    }

    const closedScreenIndex = screens.findIndex(
      (screen) => screen.id === screenId,
    );
    const fallbackScreen =
      remainingScreens[closedScreenIndex] ??
      remainingScreens[closedScreenIndex - 1] ??
      remainingScreens[0];

    setSelectedScreenId(fallbackScreen.id);
  }

  return (
    <>
      <ScreensPanel
        screens={screens}
        selectedScreenId={selectedScreenId}
        enteringScreenId={enteringScreenId}
        searchValue={searchValue}
        typingStyle={typingStyle}
        canCreateScreen={screens.length < MAX_SCREENS}
        onCreateScreen={handleCreateScreen}
        onCloseScreen={handleCloseScreen}
        onSelectScreen={handleSelectScreen}
        onScreenAnimationEnd={handleScreenAnimationEnd}
      />
      <Editor
        runs={runs}
        canUndo={isDocumentOpen && history.length > 0}
        isDocumentOpen={isDocumentOpen}
        isCapsLockOn={isCapsLockOn}
        isVirtualShiftOn={isVirtualShiftOn}
        keyboardMode={keyboardMode}
        replaceValue={replaceValue}
        searchValue={searchValue}
        typingStyle={typingStyle}
        onApplyAll={() => updateRuns(applyStyleToAll(runs, typingStyle))}
        onChangeTypingStyle={handleChangeTypingStyle}
        onResetTypingStyle={handleResetTypingStyle}
        onClearText={() => updateRuns(clearText(runs))}
        onDeleteCharacter={() => updateRuns(deleteLastCharacter(runs))}
        onDeleteWord={() => updateRuns(deleteLastWord(runs))}
        onInsertText={handleInsertText}
        onKeyboardModeChange={setKeyboardMode}
        onLoadRuns={handleLoadRuns}
        onToggleCapsLock={() =>
          setIsCapsLockOn((currentValue) => !currentValue)
        }
        onToggleVirtualShift={() =>
          setIsVirtualShiftOn((currentValue) => !currentValue)
        }
        onReplace={() =>
          updateRuns(replaceText(runs, searchValue, replaceValue))
        }
        onReplaceChange={setReplaceValue}
        onSearchChange={setSearchValue}
        onUndo={handleUndo}
      />
    </>
  );
}

export default Workspace;
