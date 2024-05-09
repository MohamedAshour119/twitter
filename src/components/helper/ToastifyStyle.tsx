import {ToastOptions, Zoom} from "react-toastify";

export const toastStyle: ToastOptions = {
    className: 'custom-toast',
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Zoom,
}
