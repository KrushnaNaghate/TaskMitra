// src/utils/toast.js

let snackbar = null;

export const setSnackbarRef = ref => {
  snackbar = ref;
};

export const showToast = (message, type = 'info') => {
  if (snackbar) {
    snackbar.show({message, type});
  } else {
    console.log('[Toast]', message);
  }
};
