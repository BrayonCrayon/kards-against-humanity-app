import Swal, { SweetAlertPosition } from "sweetalert2";

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

export const happyToast = (
  message: string = "Success",
  position: SweetAlertPosition = "bottom-end"
) => {
  Swal.fire({
    toast: true,
    text: message,
    position: position,
    icon: "success",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};
