export const getAuth = () => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
};

export const setAuth = (data) => {
  localStorage.setItem("auth", JSON.stringify(data));
};

export const removeAuth = () => {
  localStorage.removeItem("auth");
};