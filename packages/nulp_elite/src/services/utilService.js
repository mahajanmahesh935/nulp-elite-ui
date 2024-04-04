export const userId = () => {
  const userIdElement = document.getElementById("userId");
  const userId = userIdElement ? userIdElement.value : "";
  return userId;
};

const userSid = () => {
  const userIdElement = document.getElementById("userSid");
  const userSid = userIdElement ? userIdElement.value : "";
  return userSid;
};

const sessionId = () => {
  const userIdElement = document.getElementById("sessionId");
  const sessionId = userIdElement ? userIdElement.value : "";
  return sessionId;
};
