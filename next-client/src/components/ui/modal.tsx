import s from "./modal.module.scss";
import { Button } from "./button";
import {
  type ReactNode,
  type CSSProperties,
  type FC,
  useRef,
  useState,
  useEffect,
  RefObject,
  useCallback,
  useLayoutEffect,
} from "react";
import { createContext, useContext } from "react";
import { X } from "lucide-react";
import classNames from "classnames";

type ModalContextType = {
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement | null>;
  isVisible: boolean;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Modal components must be used within Modal");
  return ctx;
};

type ModalProps = {
  isOpen?: boolean;
  children: ReactNode;
  onClose: () => void;
  animationDuration?: number;
  style?: CSSProperties;
  className?: string;
  closeOnOutsideClick?: boolean;
};

export const Modal: FC<ModalProps> = ({
  isOpen = false,
  onClose,
  animationDuration = 200,
  children,
  className,
  style = {},
  closeOnOutsideClick = true,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Phase 1: Trigger render
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else if (shouldRender) {
      setIsVisible(false);
      setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "auto";
      }, animationDuration);
    }
  }, [isOpen, shouldRender, animationDuration]);

  // Phase 2: Trigger animation after DOM mount
  useLayoutEffect(() => {
    if (shouldRender) {
      const id = requestAnimationFrame(() => {
        setIsVisible(true);
        document.body.style.overflow = "hidden";
      });
      return () => cancelAnimationFrame(id);
    }
  }, [shouldRender]);

  const closeModal = useCallback(() => {
    if (!isOpen) return;
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = "auto";
      onCloseRef.current();
    }, animationDuration);
  }, [isOpen, animationDuration]);

  useEffect(() => {
    if (!closeOnOutsideClick || !shouldRender) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shouldRender, closeOnOutsideClick, closeModal]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <ModalContext.Provider value={{ closeModal, modalRef, isVisible }}>
      <div
        className={classNames(s.overlay, className)}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: `opacity ${animationDuration}ms ease-in-out`,
        }}
      >
        <div
          ref={modalRef}
          className={s.wrapper}
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(-8px)",
            opacity: isVisible ? 1 : 0,
            transition: `transform ${animationDuration}ms ease-in-out, opacity ${animationDuration}ms ease-in-out`,
            ...style,
          }}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

// Modal header wrapper
type ModalHeaderProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  showCloseButton?: boolean;
};

export const ModalHeader: FC<ModalHeaderProps> = ({
  children,
  className,
  style,
  showCloseButton = true,
}) => {
  const { closeModal } = useModal();

  return (
    <div className={classNames(s.header, className)} style={style}>
      {children}
      {showCloseButton && (
        <Button variant="bordered_sm" onClick={closeModal}>
          <span>
            <X size={18} />
          </span>
        </Button>
      )}
    </div>
  );
};

// Modal content wrapper
type ModalContentProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const ModalContent: FC<ModalContentProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <div className={classNames(s.modal_content, className)} style={style}>
      {children}
    </div>
  );
};
