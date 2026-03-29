import {
  DEFAULT_COLOR_OPTIONS,
  DEFAULT_FONT_OPTIONS,
  DEFAULT_SIZE_OPTIONS,
} from "../utils/Defaults";

function TextStyling({ typingStyle, onApplyAll, onChangeTypingStyle }) {
  function toggleStyle(key, activeValue, inactiveValue) {
    onChangeTypingStyle(
      key,
      typingStyle[key] === activeValue ? inactiveValue : activeValue,
    );
  }

  return (
    <div className="editor-controls-pane">
      <div className="editor-section">
        <div className="editor-control-grid">
          <select
            value={typingStyle.fontFamily}
            onChange={(event) =>
              onChangeTypingStyle("fontFamily", event.target.value)
            }
          >
            {DEFAULT_FONT_OPTIONS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>

          <select
            value={typingStyle.fontSize}
            onChange={(event) =>
              onChangeTypingStyle("fontSize", Number(event.target.value))
            }
          >
            {DEFAULT_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        <div className="editor-format-buttons">
          <button
            type="button"
            className={
              typingStyle.fontWeight === "700"
                ? "editor-button editor-format-button is-active"
                : "editor-button editor-format-button"
            }
            onClick={() => toggleStyle("fontWeight", "700", "400")}
          >
            B
          </button>

          <button
            type="button"
            className={
              typingStyle.fontStyle === "italic"
                ? "editor-button editor-format-button is-active"
                : "editor-button editor-format-button"
            }
            onClick={() => toggleStyle("fontStyle", "italic", "normal")}
          >
            I
          </button>

          <button
            type="button"
            className={
              typingStyle.textDecoration === "underline"
                ? "editor-button editor-format-button is-active"
                : "editor-button editor-format-button"
            }
            onClick={() => toggleStyle("textDecoration", "underline", "none")}
          >
            U
          </button>
        </div>

        <div className="editor-colors">
          {DEFAULT_COLOR_OPTIONS.map((color) => (
            <button
              type="button"
              key={color}
              className={
                typingStyle.color === color
                  ? "editor-color is-active"
                  : "editor-color"
              }
              style={{ backgroundColor: color }}
              onClick={() => onChangeTypingStyle("color", color)}
            />
          ))}
        </div>

        <button
          type="button"
          className="editor-button editor-button-primary editor-button-full"
          onClick={onApplyAll}
        >
          Apply All
        </button>
      </div>
    </div>
  );
}

export default TextStyling;
