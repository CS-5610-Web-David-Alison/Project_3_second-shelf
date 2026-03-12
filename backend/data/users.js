let users = [
  {
    id: "1763666945288",
    email: "john@example.com",
    passwordHash:
      "$2b$10$Nvh.4Ceur1t3O4i2At6MreGsViVJgu6SWx/GaRrRGrm7OG7gj1YLK",
    name: "john",
  },
  {
    id: "1772955746941",
    email: "david@example.com",
    passwordHash:
      "$2b$10$Hh8bjw3qLmorelmSUfJiVurc2yLbciDHbXsvIx9fb.FFw1fsdJnDW",
    name: "David Ahn",
  },
];

export const createUser = (user) => {
  const newUser = {
    id: Date.now().toString(),
    ...user,
  };
  users.push(newUser);
  return newUser;
};

export const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

export const findUserById = (id) => {
  return users.find((user) => user.id === id);
};

export const getAllUsers = () => {
  return users;
};
