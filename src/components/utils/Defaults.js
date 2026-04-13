export const MAX_SCREENS = 5;

export const DEFAULT_STYLE = {
  fontFamily: "Arial, sans-serif",
  fontSize: 18,
  color: "#000000",
  fontStyle: "normal",
  fontWeight: "400",
  textDecoration: "none",
};

export const DEFAULT_FONT_OPTIONS = [
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Comic Sans MS", value: "'Comic Sans MS', 'Comic Sans', cursive" },
  { label: "Courier New", value: "'Courier New', monospace" },
];

export const DEFAULT_SIZE_OPTIONS = [12, 18, 24, 32, 40];

export const DEFAULT_COLOR_OPTIONS = [
  "#ff0000",
  "#ff7f00",
  "#ffff00",
  "#00aa00",
  "#0000ff",
  "#7f00ff",
  "#000000",
];

export const DEFAULT_KEYBOARD_LAYOUTS = {
  english: [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ],
  shiftEnglish: [
    ["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", ":", '"'],
    ["Z", "X", "C", "V", "B", "N", "M", "<", ">", "?"],
  ],
  hebrew: [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["/", "'", "ק", "ר", "א", "ט", "ו", "ן", "ם", "פ", "]", "[", "\\"],
    ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל", "ך", "ף", ","],
    ["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת", "ץ", "."],
  ],
  shiftHebrew: [
    ["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+"],
    ["/", "'", "ק", "ר", "א", "ט", "ו", "ן", "ם", "פ", "}", "{", "|"],
    ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל", "ך", "ף", '"'],
    ["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת", "ץ", "?"],
  ],
};
