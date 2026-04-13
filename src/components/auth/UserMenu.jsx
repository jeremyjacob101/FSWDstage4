import { useState } from "react";
import "./UserMenu.css";

function UserMenu({ currentUser, onCreateAccount, onLogOut, onSignIn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mode, setMode] = useState("sign-in");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function resetForm() {
    setUsername("");
    setPassword("");
  }

  function handleMenuToggle() {
    setIsMenuOpen((currentValue) => !currentValue);
  }

  function handleMenuBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsMenuOpen(false);
    }
  }

  function handleModeChange(nextMode) {
    setMode(nextMode);
    resetForm();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const didSucceed =
      mode === "create-account"
        ? onCreateAccount(username, password)
        : onSignIn(username, password);

    if (!didSucceed) {
      return;
    }

    resetForm();
    setIsMenuOpen(false);
  }

  function handleLogOutClick() {
    const didLogOut = onLogOut();
    if (didLogOut === false) {
      return;
    }

    setIsMenuOpen(false);
  }

  return (
    <div className="user-menu-container" onBlur={handleMenuBlur}>
      <button
        type="button"
        className="editor-button editor-button-icon"
        onClick={handleMenuToggle}
        title={currentUser ? currentUser : "User"}
      >
        <img className="editor-icon" src="/icons/user.svg" alt="User" />
      </button>

      {isMenuOpen && (
        <div className="user-menu-panel">
          {currentUser ? (
            <>
              <div className="user-menu-label">Signed in as</div>
              <div className="user-menu-name">{currentUser}</div>

              <button
                type="button"
                className="editor-button editor-button-full"
                onClick={handleLogOutClick}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <div className="user-menu-tabs">
                <button
                  type="button"
                  className={
                    mode === "sign-in"
                      ? "user-menu-tab is-active"
                      : "user-menu-tab"
                  }
                  onClick={() => handleModeChange("sign-in")}
                >
                  Sign In
                </button>

                <button
                  type="button"
                  className={
                    mode === "create-account"
                      ? "user-menu-tab is-active"
                      : "user-menu-tab"
                  }
                  onClick={() => handleModeChange("create-account")}
                >
                  Create
                </button>
              </div>

              <form className="user-menu-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="user-menu-input"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Username"
                  autoComplete="username"
                />

                <input
                  type="password"
                  className="user-menu-input"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  autoComplete={
                    mode === "create-account"
                      ? "new-password"
                      : "current-password"
                  }
                />

                <button
                  type="submit"
                  className="editor-button editor-button-primary editor-button-full"
                >
                  {mode === "create-account" ? "Create Account" : "Sign In"}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default UserMenu;
