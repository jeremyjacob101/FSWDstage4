import { getMatchRanges, getPlainText } from "../utils/Helpers";

function Screen({ runs, searchValue, typingStyle }) {
  const plainText = getPlainText(runs);
  const matchRanges = getMatchRanges(plainText, searchValue);
  const matchedIndexes = new Set();

  let characterIndex = 0;
  matchRanges.forEach((range) => {
    for (let index = range.start; index < range.end; index += 1) {
      matchedIndexes.add(index);
    }
  });

  return (
    <section className="panel screen">
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
        <span
          className="screen-cursor"
          style={{ height: `${typingStyle.fontSize}px` }}
        />
      </div>
    </section>
  );
}

export default Screen;
