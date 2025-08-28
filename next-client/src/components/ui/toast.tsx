import toast from "react-hot-toast";
import s from "./toast.module.scss";

export const successToast = (data: string) => {
  toast.success(data, {
    duration: 4000,
    className: s.style,
    iconTheme: {
      primary: "var(--color-primary)",
      secondary: "#fff",
    },
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
  });
};

export const errorToast = (data: string) => {
  toast.error(data, {
    duration: 6000,
    className: s.style,
    iconTheme: {
      primary: "#fff",
      secondary: "var(--color-red)",
    },
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
  });
};
