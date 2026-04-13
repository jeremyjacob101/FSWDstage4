import { DEFAULT_STYLE, MAX_SCREENS } from "./utils/Defaults";
import {
  applyStyleToAll,
  clearText,
  cloneRuns,
  cloneScreens,
  deleteLastCharacter,
  deleteLastWord,
  getPlainText,
  insertText,
  replaceText,
} from "./utils/Helpers";
import {
  clearStoredCurrentUser,
  createStoredUser,
  getStoredCurrentUser,
  getStoredPassword,
  hasStoredUser,
  hasUserFile,
  saveUserFile,
  setStoredCurrentUser,
} from "./utils/AuthStorage";
import { useState } from "react";
import Editor from "./editors/Editor";
import ScreensPanel from "./screens/ScreensPanel";

function Workspace() {
  const [currentUser, setCurrentUser] = useState(() => getStoredCurrentUser());
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
  const [redoHistory, setRedoHistory] = useState([]);

  const activeScreen =
    screens.find((screen) => screen.id === selectedScreenId) ??
    screens[0] ??
    null;
  const activeScreenId = activeScreen?.id ?? null;
  const runs = activeScreen ? activeScreen.runs : [];
  const isDocumentOpen = activeScreen !== null;

  function createSnapshot(
    snapshotScreens = screens,
    snapshotStyle = typingStyle,
    snapshotScreenId = activeScreenId,
  ) {
    return {
      screens: cloneScreens(snapshotScreens),
      selectedScreenId: snapshotScreenId,
      typingStyle: { ...snapshotStyle },
    };
  }

  function rememberState(
    snapshotScreens = screens,
    snapshotStyle = typingStyle,
    snapshotScreenId = activeScreenId,
  ) {
    setHistory((currentHistory) => [
      ...currentHistory.slice(-20),
      createSnapshot(snapshotScreens, snapshotStyle, snapshotScreenId),
    ]);
    setRedoHistory([]);
  }

  function restoreState(snapshot) {
    setScreens(cloneScreens(snapshot.screens));
    setSelectedScreenId(snapshot.selectedScreenId);
    setTypingStyle({ ...snapshot.typingStyle });
    setEnteringScreenId(null);
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

  function handleCreateAccount(username, password) {
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password.trim()) {
      window.alert("Enter a username and password.");
      return false;
    }

    if (trimmedUsername.includes("/")) {
      window.alert('Username cannot include "/".');
      return false;
    }

    if (hasStoredUser(trimmedUsername)) {
      window.alert("Username already exists.");
      return false;
    }

    createStoredUser(trimmedUsername, password);
    setStoredCurrentUser(trimmedUsername);
    setCurrentUser(trimmedUsername);
    return true;
  }

  function handleSignIn(username, password) {
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password.trim()) {
      window.alert("Enter a username and password.");
      return false;
    }

    if (getStoredPassword(trimmedUsername) !== password) {
      window.alert("Invalid username or password.");
      return false;
    }

    setStoredCurrentUser(trimmedUsername);
    setCurrentUser(trimmedUsername);
    return true;
  }

  function handleLogOut() {
    if (screens.length > 0) {
      const didConfirmLogOut = window.confirm(
        "Log out now? Make sure you've saved any work you want to keep.",
      );
      if (!didConfirmLogOut) {
        return false;
      }
    }

    clearStoredCurrentUser();
    setCurrentUser(null);
    setScreens([]);
    setSelectedScreenId(null);
    setEnteringScreenId(null);
    setHistory([]);
    setRedoHistory([]);
    return true;
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

  function handleSaveRuns(targetRuns = runs) {
    const fileName = window.prompt("Please enter a name to save the file:");
    const trimmedFileName = fileName?.trim();

    if (!trimmedFileName) {
      return false;
    }

    if (trimmedFileName.includes("/")) {
      window.alert('File name cannot include "/".');
      return false;
    }

    if (hasUserFile(currentUser, trimmedFileName)) {
      window.alert("File already exists.");
      return false;
    }

    try {
      saveUserFile(currentUser, trimmedFileName, targetRuns);
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

  function closeScreen(screenId) {
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
    if (!previousState) {
      return;
    }

    setRedoHistory((currentHistory) => [
      ...currentHistory.slice(-20),
      createSnapshot(),
    ]);
    restoreState(previousState);
    setHistory((currentHistory) => currentHistory.slice(0, -1));
  }

  function handleRedo() {
    const nextState = redoHistory[redoHistory.length - 1];
    if (!nextState) {
      return;
    }

    setHistory((currentHistory) => [
      ...currentHistory.slice(-20),
      createSnapshot(),
    ]);
    restoreState(nextState);
    setRedoHistory((currentHistory) => currentHistory.slice(0, -1));
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
      const shouldClose = window.confirm(
        "Close this screen? Make sure you've saved any work you want to keep.",
      );
      if (!shouldClose) {
        return;
      }
    }

    closeScreen(screenId);
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
        currentUser={currentUser}
        runs={runs}
        canUndo={isDocumentOpen && history.length > 0}
        canRedo={isDocumentOpen && redoHistory.length > 0}
        isDocumentOpen={isDocumentOpen}
        canLoadRuns={screens.length < MAX_SCREENS}
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
        onCreateAccount={handleCreateAccount}
        onLoadRuns={handleLoadRuns}
        onLogOut={handleLogOut}
        onSaveRuns={handleSaveRuns}
        onSignIn={handleSignIn}
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
        onRedo={handleRedo}
      />
    </>
  );
}

export default Workspace;
