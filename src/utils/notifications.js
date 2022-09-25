import { toast } from "react-toastify";

export const successMsg = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 2000,
    });
};

export const errorMsg = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 2000,
    });
};
