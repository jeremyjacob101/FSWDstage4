import { getMatchRanges, getPlainText } from "../utils/Helpers";

function Screen({
  runs,
  searchValue,
  typingStyle,
  className = "",
  style,
  showCursor = true,
  onClose,
  onClick,
  onAnimationEnd,
  ariaLabel,
}) {
  const plainText = getPlainText(runs);
  const matchRanges = getMatchRanges(plainText, searchValue);
  const matchedIndexes = new Set();
  const screenClassName = className
    ? `panel screen ${className}`
    : "panel screen";

  let characterIndex = 0;
  matchRanges.forEach((range) => {
    for (let index = range.start; index < range.end; index += 1) {
      matchedIndexes.add(index);
    }
  });

  function handleKeyDown(event) {
    if (!onClick) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  }

  function handleCloseClick(event) {
    event.stopPropagation();
    onClose?.();
  }

  return (
    <section
      className={screenClassName}
      style={style}
      onAnimationEnd={onAnimationEnd}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
    >
      {onClose && (
        <button
          type="button"
          className="screen-close-button"
          onClick={handleCloseClick}
          aria-label="Close screen"
        >
          <img className="screen-close-icon" src="/icons/close.svg" alt="" />
        </button>
      )}

      <div className="screen-paper" dir="auto">
        {runs.map((run, runIndex) => (
          <span key={`run-${runIndex}`} style={run.style}>
            {Array.from(run.text).map((character, runCharacterIndex) => {
              const isMatch = matchedIndexes.has(characterIndex);
              characterIndex += 1;

              return (
                <span
                  key={`character-${runIndex}-${runCharacterIndex}`}
                  className={isMatch ? "screen-match" : ""}
                >
                  {character}
                </span>
              );
            })}
          </span>
        ))}
        {showCursor && (
          <span
            className="screen-cursor"
            style={{ height: `${typingStyle.fontSize}px` }}
          />
        )}
      </div>
    </section>
  );
}

export default Screen;
