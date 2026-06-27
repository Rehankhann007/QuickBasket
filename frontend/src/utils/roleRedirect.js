export const ROLE_HOME_MAP = {
  admin: "/admin",
  deliveryBoy: "/delivery",
  user: "/user",
};

export const getRoleHome = (role) => ROLE_HOME_MAP[role] || "/user";