import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions = {
  position: "top-right",
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
}

export const toastNormal = (msg, customOptions) => {
  const options = {
    ...defaultOptions,
    ...customOptions
  }
  return toast(msg, options);
}

export const toastError = (msg, customOptions) => {
  const options = {
    ...defaultOptions,
    ...customOptions
  }
  return toast.error(msg, options);
}