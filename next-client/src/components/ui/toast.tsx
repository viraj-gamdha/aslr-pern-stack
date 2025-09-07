import toast from "react-hot-toast";
import s from "./toast.module.scss";
import { Info } from "lucide-react";

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

export const infoToast = (data: string) => {
  toast(data, {
    duration: 5000,
    className: s.style,
    icon: <Info size={16} color="var(--color-primary)" />,
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
  });
};

export const loaderToast = (
  promise: Promise<unknown>,
  loadingMsg = "Loading...",
  successMsg = "Done!",
  errorMsg = "Something went wrong"
) => {
  toast.promise(
    promise,
    {
      loading: loadingMsg,
      success: successMsg,
      error: errorMsg,
    },
    {
      duration: 4000,
      // Shared base styles
      style: {
        padding: "12px 16px",
        fontSize: "14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
      },
      className: s.style,
      // Per-state styles
      success: {
        iconTheme: {
          primary: "var(--color-primary)",
          secondary: "#fff",
        },
      },
      error: {
        iconTheme: {
          primary: "#fff",
          secondary: "var(--color-red)",
        },
      },
      loading: {
        iconTheme: {
          primary: "var(--color-primary)",
          secondary: "#fff",
        },
      },
      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },
    }
  );
};

type ToastFunction = () => void;

export const toastQueue = (toasts: ToastFunction[], delay = 2000) => {
  toasts.forEach((toastFn, index) => {
    setTimeout(() => {
      toastFn();
    }, index * delay);
  });
};
