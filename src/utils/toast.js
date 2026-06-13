import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: false,
});

export const showToast = (icon, title) => {
  Toast.fire({ icon, title });
};

export default Toast;
