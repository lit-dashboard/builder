const callbacks = {};

export const onEvent = (eventName, callback) => {
  if (typeof callbacks[eventName] === 'undefined') {
    callbacks[eventName] = [];
  }

  callbacks[eventName].push(callback);
};

export const triggerEvent = (eventName, ...args) => {
  if (eventName in callbacks) {
    callbacks[eventName].forEach(callback => {
      if (typeof callback === 'function') {
        callback(...args);
      }
    });
  }
};
