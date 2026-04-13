import Screen from "./Screen";

function ScreensPanel({
  screens,
  selectedScreenId,
  enteringScreenId,
  searchValue,
  typingStyle,
  canCreateScreen,
  onCreateScreen,
  onCloseScreen,
  onSelectScreen,
  onScreenAnimationEnd,
}) {
  if (screens.length === 0) {
    return (
      <section className="panel screen screen-empty-state">
        <button
          type="button"
          className="screen-add-button screen-add-button-large"
          onClick={() => onCreateScreen()}
          aria-label="Add screen"
        >
          <span className="screen-add-circle">+</span>
        </button>
      </section>
    );
  }

  const activeScreen =
    screens.find((screen) => screen.id === selectedScreenId) ?? screens[0];

  return (
    <div className="screen-collection">
      <div
        className="screen-stage"
        style={{
          gridTemplateColumns: `repeat(${screens.length}, minmax(0, 1fr))`,
        }}
      >
        {screens.map((screen) => {
          const isActive = screen.id === activeScreen.id;
          const screenClassName = isActive
            ? screen.id === enteringScreenId
              ? "screen-focus is-entering"
              : "screen-focus"
            : "screen-preview";

          return (
            <Screen
              key={screen.id}
              runs={screen.runs}
              searchValue={isActive ? searchValue : ""}
              typingStyle={typingStyle}
              className={screenClassName}
              showCursor={isActive}
              onClose={() => onCloseScreen(screen.id)}
              onClick={isActive ? undefined : () => onSelectScreen(screen.id)}
              onAnimationEnd={
                isActive && screen.id === enteringScreenId
                  ? () => onScreenAnimationEnd(screen.id)
                  : undefined
              }
              ariaLabel={isActive ? undefined : `Open screen ${screen.id}`}
            />
          );
        })}
      </div>

      {canCreateScreen && (
        <button
          type="button"
          className="screen-add-button screen-add-button-side"
          onClick={() => onCreateScreen()}
          aria-label="Add screen"
        >
          <span className="screen-add-circle screen-add-circle-small">+</span>
        </button>
      )}
    </div>
  );
}

export default ScreensPanel;
