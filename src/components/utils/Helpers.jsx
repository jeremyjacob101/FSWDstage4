import { DEFAULT_STYLE, DEFAULT_KEYBOARD_LAYOUTS } from "./Defaults";

function mapLetterCase(row, transform) {
  return row.map((key) => (/^[a-zA-Z]$/.test(key) ? transform(key) : key));
}

export function getKeyboardRows(keyboardMode, isShiftActive, isCapsLockOn) {
  if (keyboardMode === "hebrew") {
    return DEFAULT_KEYBOARD_LAYOUTS[isShiftActive ? "shiftHebrew" : "hebrew"];
  }

  if (!isCapsLockOn) {
    return DEFAULT_KEYBOARD_LAYOUTS[isShiftActive ? "shiftEnglish" : "english"];
  }

  return DEFAULT_KEYBOARD_LAYOUTS[
    isShiftActive ? "shiftEnglish" : "english"
  ].map((row) =>
    mapLetterCase(row, (key) =>
      isShiftActive ? key.toLowerCase() : key.toUpperCase(),
    ),
  );
}

export function getNextKeyboardMode(keyboardMode) {
  return keyboardMode === "english" ? "hebrew" : "english";
}

export function cloneRuns(runs) {
  return runs.map((run) => ({
    text: run.text,
    style: { ...run.style },
  }));
}

export function cloneScreens(screens) {
  return screens.map((screen) => ({
    id: screen.id,
    runs: cloneRuns(screen.runs),
  }));
}

export function sameStyle(firstStyle, secondStyle) {
  return (
    firstStyle.fontFamily === secondStyle.fontFamily &&
    firstStyle.fontSize === secondStyle.fontSize &&
    firstStyle.color === secondStyle.color &&
    firstStyle.fontStyle === secondStyle.fontStyle &&
    firstStyle.fontWeight === secondStyle.fontWeight &&
    firstStyle.textDecoration === secondStyle.textDecoration
  );
}

export function getPlainText(runs) {
  return runs.map((run) => run.text).join("");
}

function getCharacterEntries(runs) {
  return runs.flatMap((run) =>
    Array.from(run.text).map((character) => ({
      character,
      style: { ...run.style },
    })),
  );
}

export function getMatchRanges(text, searchValue) {
  if (!searchValue) {
    return [];
  }

  const textCharacters = Array.from(text);
  const searchCharacters = Array.from(searchValue);
  const ranges = [];
  let searchIndex = 0;

  while (searchIndex <= textCharacters.length - searchCharacters.length) {
    let isMatch = true;

    for (let offset = 0; offset < searchCharacters.length; offset += 1) {
      if (textCharacters[searchIndex + offset] !== searchCharacters[offset]) {
        isMatch = false;
        break;
      }
    }

    if (!isMatch) {
      searchIndex += 1;
      continue;
    }

    ranges.push({
      start: searchIndex,
      end: searchIndex + searchCharacters.length,
    });

    searchIndex += searchCharacters.length;
  }

  return ranges;
}

function mergeRuns(runs) {
  const mergedRuns = [];

  runs.forEach((run) => {
    if (!run.text) {
      return;
    }

    const previousRun = mergedRuns[mergedRuns.length - 1];

    if (previousRun && sameStyle(previousRun.style, run.style)) {
      previousRun.text += run.text;
      return;
    }

    mergedRuns.push({
      text: run.text,
      style: { ...run.style },
    });
  });

  return mergedRuns;
}

function removeLastCharacter(runs) {
  const lastRun = runs[runs.length - 1];
  const characters = Array.from(lastRun.text);
  characters.pop();

  if (characters.length === 0) {
    runs.pop();
    return;
  }

  lastRun.text = characters.join("");
}

function getLastCharacter(runs) {
  const lastRun = runs[runs.length - 1];
  const characters = Array.from(lastRun.text);
  return characters[characters.length - 1] ?? "";
}

export function clearText(runs) {
  return runs.length ? [] : runs;
}

export function insertText(runs, value, style) {
  const text = Array.from(value ?? "").join("");

  if (!text) {
    return runs;
  }

  const nextRuns = cloneRuns(runs);
  const lastRun = nextRuns[nextRuns.length - 1];

  if (lastRun && sameStyle(lastRun.style, style)) {
    lastRun.text += text;
    return nextRuns;
  }

  nextRuns.push({
    text,
    style: { ...style },
  });

  return nextRuns;
}

export function deleteLastCharacter(runs) {
  if (runs.length === 0) {
    return runs;
  }

  const nextRuns = cloneRuns(runs);
  removeLastCharacter(nextRuns);
  return nextRuns;
}

export function deleteLastWord(runs) {
  if (runs.length === 0) {
    return runs;
  }

  const nextRuns = cloneRuns(runs);

  while (nextRuns.length > 0 && /\s/.test(getLastCharacter(nextRuns))) {
    removeLastCharacter(nextRuns);
  }
  while (nextRuns.length > 0 && !/\s/.test(getLastCharacter(nextRuns))) {
    removeLastCharacter(nextRuns);
  }

  return nextRuns;
}

export function applyStyleToAll(runs, style) {
  if (!runs.length || runs.every((run) => sameStyle(run.style, style))) {
    return runs;
  }
  return [{ text: getPlainText(runs), style: { ...style } }];
}

export function replaceText(runs, searchValue, replaceValue) {
  if (!searchValue || runs.length === 0) {
    return runs;
  }

  const characterEntries = getCharacterEntries(runs);
  const plainText = characterEntries.map((entry) => entry.character).join("");
  const matchRanges = getMatchRanges(plainText, searchValue);

  if (matchRanges.length === 0) {
    return runs;
  }

  const nextEntries = [];
  let currentIndex = 0;

  matchRanges.forEach((range) => {
    while (currentIndex < range.start) {
      nextEntries.push(characterEntries[currentIndex]);
      currentIndex += 1;
    }

    const replacementStyle =
      characterEntries[range.start]?.style ?? DEFAULT_STYLE;

    Array.from(replaceValue).forEach((character) => {
      nextEntries.push({
        character,
        style: { ...replacementStyle },
      });
    });

    currentIndex = range.end;
  });

  while (currentIndex < characterEntries.length) {
    nextEntries.push(characterEntries[currentIndex]);
    currentIndex += 1;
  }

  const nextRuns = nextEntries.map((entry) => ({
    text: entry.character,
    style: { ...entry.style },
  }));

  return mergeRuns(nextRuns);
}
