export const asyncLocalStorage = {
  setItem: async (key, value) => {
    return Promise.resolve().then(() => {
      localStorage.setItem(key, value);
    });
  },
  getItem: async (key) => {
    return Promise.resolve().then(() => {
      const token = localStorage.getItem(key);
      if (!token) {
        return '0'
      }
      return token
    });
  },
  removeItem: async (key) => {
    return Promise.resolve().then(() => {
      localStorage.removeItem(key);
    });
  }
};
