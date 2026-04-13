const USERS_STORAGE_KEY = "auth/users";
const CURRENT_USER_STORAGE_KEY = "auth/current-user";
const USER_FILES_PREFIX = "files/";
const AUTHENTICATED_USER_FILES_PREFIX = `${USER_FILES_PREFIX}user/`;
const GUEST_FILES_PREFIX = `${USER_FILES_PREFIX}no-user/`;

function getStoredUsers() {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!storedUsers) {
      return {};
    }

    const parsedUsers = JSON.parse(storedUsers);
    return typeof parsedUsers === "object" && parsedUsers !== null
      ? parsedUsers
      : {};
  } catch {
    return {};
  }
}

function setStoredUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getUserFilesPrefix(username) {
  return username
    ? `${AUTHENTICATED_USER_FILES_PREFIX}${username}/`
    : GUEST_FILES_PREFIX;
}

function getUserFileKey(username, fileName) {
  return `${getUserFilesPrefix(username)}${fileName}`;
}

export function getStoredCurrentUser() {
  const currentUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  if (!currentUser) {
    return null;
  }

  const users = getStoredUsers();
  return typeof users[currentUser] === "string" ? currentUser : null;
}

export function createStoredUser(username, password) {
  const users = getStoredUsers();
  users[username] = password;
  setStoredUsers(users);
}

export function getStoredPassword(username) {
  const users = getStoredUsers();
  return typeof users[username] === "string" ? users[username] : null;
}

export function hasStoredUser(username) {
  return getStoredPassword(username) !== null;
}

export function setStoredCurrentUser(username) {
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, username);
}

export function clearStoredCurrentUser() {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

export function hasUserFile(username, fileName) {
  return localStorage.getItem(getUserFileKey(username, fileName)) !== null;
}

export function saveUserFile(username, fileName, runs) {
  localStorage.setItem(
    getUserFileKey(username, fileName),
    JSON.stringify(runs),
  );
}

export function loadUserFile(username, fileName) {
  const savedData = localStorage.getItem(getUserFileKey(username, fileName));
  return savedData ? JSON.parse(savedData) : null;
}

export function listUserFiles(username) {
  const files = [];
  const filePrefix = getUserFilesPrefix(username);

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && key.startsWith(filePrefix)) {
      files.push(key.slice(filePrefix.length));
    }
  }

  files.sort((firstFile, secondFile) => firstFile.localeCompare(secondFile));
  return files;
}
