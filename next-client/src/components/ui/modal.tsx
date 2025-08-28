import s from "./modal.module.scss";
import { Button } from "./button";
import {
  type ReactNode,
  type CSSProperties,
  type FC,
  useRef,
  useState,
  useEffect,
} from "react";
import { X } from "lucide-react";

type Props = {
  heading?: string;
  children: ReactNode;
  onClose: () => void;
  wrapperStyle?: CSSProperties;
};

const Modal: FC<Props> = ({
  heading,
  children,
  onClose,
  wrapperStyle = {},
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 30); // slight delay to trigger transition
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(onClose, 50); // transition duration
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className={s.overlay}
      style={{
        opacity: isClosing ? 0 : isVisible ? 1 : 0,
        visibility: isClosing ? "hidden" : "visible",
      }}
    >
      <div
        ref={modalRef}
        className={s.wrapper}
        style={{
          transform: isClosing
            ? "translateY(-8px)"
            : isVisible
            ? "translateY(0)"
            : "translateY(-8px)",
          opacity: isClosing ? 0 : isVisible ? 1 : 0,
          ...wrapperStyle,
        }}
      >
        {heading && <div className={s.header}>
          <span>{heading}</span>
          <Button
            variant="bordered"
            onClick={closeModal}
            style={{ padding: "0.2rem 0.4rem" }}
          >
            <X size={18} />
          </Button>
        </div>}
        {/* Modal content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
