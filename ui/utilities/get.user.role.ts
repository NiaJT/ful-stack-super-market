const getUserRole = () => {
  if (window && typeof window != "undefined") {
    const role = window.localStorage.getItem("role");
    return role;
  }
};
export default getUserRole;