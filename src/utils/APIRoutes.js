export const host = "http://localhost:5000";
export const registerRoute = `${host}/auth/register`;
export const loginRoute = `${host}/auth/login`;
export const getAllUsersRoute = `${host}/auth/allUsers`; /* /:id */
export const getUserById = `${host}/auth/getUserById`; /* /:id */
export const addMessageRoute = `${host}/message/addMessage`;
export const getAllMessagesRoute = `${host}/message/getAllMessages`;
