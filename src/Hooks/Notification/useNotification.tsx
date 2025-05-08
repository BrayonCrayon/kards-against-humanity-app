export const useNotification = () => {
  // element state is pulled in from KAHNotification

  // showNotification method
  // handle show of state
  const showNotification = () => {
    console.log("show notification");
  };

  // hideNotification method
  // handle hide of state

  return {
    showNotification,
  };
};
