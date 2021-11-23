import Swal from "sweetalert2";

export const errorToast = (message: string = "Error") => {
  Swal.fire({
    toast: true,
    text: message,
    position: "bottom-end",
    icon: "error",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

export const happyToast = (message: string = "Success") => {
  Swal.fire({
    toast: true,
    text: message,
    position: "bottom-end",
    icon: "success",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};
