import classNames from "classnames";
import styles from "./dropdown.module.scss";
import { usePathname } from "next/navigation";
import {
  ReactNode,
  FC,
  useState,
  useRef,
  useEffect,
  CSSProperties,
  createContext,
  useContext,
  RefObject,
  HTMLAttributes,
  ButtonHTMLAttributes,
  useLayoutEffect,
  useCallback,
} from "react";

// dropdown context & hook
interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleDropdown: () => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
  menuRef?: RefObject<HTMLDivElement | null>;
  menuPosition: { top: number; left: number };
  animationDuration: number;
  isAnimating: boolean;
  shouldRenderMenu: boolean;
  onClose?: () => void;
  triggerWidth: number;
  isReadyForDisplay: boolean;
}

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

export const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error(
      "Dropdown components must be used within a DropDown provider"
    );
  }
  return context;
};

// Main dropdown container
export interface DropDownProps {
  style?: CSSProperties;
  className?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  closeOnPathChange?: boolean;
  closeOnClickOutside?: boolean;
  animationDuration?: number;
  children?: ReactNode;
  onClose?: () => void;
  position?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export const DropDown: FC<DropDownProps> = ({
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  closeOnPathChange = true,
  closeOnClickOutside = true,
  animationDuration = 100,
  className,
  style,
  children,
  onClose,
  position = "bottom",
  align = "center",
}) => {
  const isControlled =
    controlledIsOpen !== undefined && controlledSetIsOpen !== undefined;
  const [internalIsOpen, internalSetIsOpen] = useState(false);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReadyForDisplay, setIsReadyForDisplay] = useState(false);

  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const setIsOpen = isControlled ? controlledSetIsOpen : internalSetIsOpen;

  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [triggerWidth, setTriggerWidth] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const path = usePathname();

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRenderMenu(true);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRenderMenu(false);
        setIsReadyForDisplay(false);
        if (onClose) onClose();
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDuration, onClose]);

  const calculatePosition = useCallback(() => {
    if (dropdownRef.current && menuRef.current) {
      const triggerRect = dropdownRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const { innerWidth, innerHeight } = window;

      const GAP = 4;
      const PADDING = 8;

      const newPos = { top: 0, left: 0 };

      // Vertical positioning
      switch (position) {
        case "top":
          newPos.top = triggerRect.top - menuRect.height - GAP;
          break;
        case "left":
        case "right":
          if (align === "start") newPos.top = triggerRect.top;
          else if (align === "end")
            newPos.top = triggerRect.bottom - menuRect.height;
          else
            newPos.top =
              triggerRect.top + triggerRect.height / 2 - menuRect.height / 2;
          break;
        default: // 'bottom'
          newPos.top = triggerRect.bottom + GAP;
          break;
      }

      // Horizontal positioning
      switch (position) {
        case "left":
          newPos.left = triggerRect.left - menuRect.width - GAP;
          break;
        case "right":
          newPos.left = triggerRect.right + GAP;
          break;
        default: // 'top' or 'bottom'
          if (align === "start") newPos.left = triggerRect.left;
          else if (align === "end")
            newPos.left = triggerRect.right - menuRect.width;
          else
            newPos.left =
              triggerRect.left + triggerRect.width / 2 - menuRect.width / 2;
          break;
      }

      // Viewport Collision Detection & Adjustment
      const topSpace = triggerRect.top;
      const bottomSpace = innerHeight - triggerRect.bottom;
      const prefersBottom = bottomSpace > topSpace;

      if (
        position === "bottom" &&
        newPos.top + menuRect.height > innerHeight - PADDING &&
        topSpace > bottomSpace
      ) {
        newPos.top = triggerRect.top - menuRect.height - GAP;
      }
      if (position === "top" && newPos.top < PADDING && prefersBottom) {
        newPos.top = triggerRect.bottom + GAP;
      }

      // Corrected horizontal collision logic
      if (newPos.left + menuRect.width > innerWidth - PADDING) {
        newPos.left = innerWidth - menuRect.width - PADDING;
      }
      if (newPos.left < PADDING) {
        newPos.left = PADDING;
      }
      if (newPos.top + menuRect.height > innerHeight - PADDING) {
        newPos.top = innerHeight - menuRect.height - PADDING;
      }
      if (newPos.top < PADDING) {
        newPos.top = PADDING;
      }

      setMenuPosition({ top: newPos.top, left: newPos.left });
      setTriggerWidth(triggerRect.width);

      setIsReadyForDisplay(true);
      setTimeout(() => setIsAnimating(true), 10);
    }
  }, [position, align]);

  useLayoutEffect(() => {
    if (shouldRenderMenu && menuRef.current) {
      calculatePosition();

      const observer = new ResizeObserver(() => {
        calculatePosition();
      });

      observer.observe(menuRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [shouldRenderMenu, calculatePosition]);

  useEffect(() => {
    if (isOpen) {
      const handleEvents = () => {
        calculatePosition();
      };
      window.addEventListener("scroll", handleEvents, true);
      window.addEventListener("resize", handleEvents);
      return () => {
        window.removeEventListener("scroll", handleEvents, true);
        window.removeEventListener("resize", handleEvents);
      };
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    if (closeOnPathChange) setIsOpen(false);
  }, [path, closeOnPathChange, setIsOpen]);

  useEffect(() => {
    if (!closeOnClickOutside) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeOnClickOutside, setIsOpen]);

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleDropdown,
        dropdownRef,
        menuRef,
        menuPosition,
        animationDuration,
        isAnimating,
        shouldRenderMenu,
        onClose,
        triggerWidth,
        isReadyForDisplay,
      }}
    >
      <div
        className={classNames(styles.container, className)}
        ref={dropdownRef}
        style={style}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

// Dropdown trigger (button)
export interface DropDownTriggerCommonProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  asChild?: boolean;
}

type ButtonProps = DropDownTriggerCommonProps &
  ButtonHTMLAttributes<HTMLButtonElement>;
type DivProps = DropDownTriggerCommonProps & HTMLAttributes<HTMLDivElement>;

export const DropDownTrigger: FC<ButtonProps | DivProps> = ({
  children,
  className,
  style,
  asChild = false,
  ...rest
}) => {
  const { isOpen, toggleDropdown } = useDropdown();

  if (asChild) {
    return (
      <div
        className={classNames(styles.button, className)}
        style={style}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={classNames(styles.button, className)}
      style={style}
      onClick={toggleDropdown}
      aria-expanded={isOpen}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

// Dropdown menu
export interface DropDownMenuProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const DropDownMenu: FC<DropDownMenuProps> = ({
  children,
  className,
  style,
}) => {
  const {
    shouldRenderMenu,
    isAnimating,
    animationDuration,
    menuPosition,
    menuRef,
    triggerWidth,
    isReadyForDisplay,
  } = useDropdown();

  if (!shouldRenderMenu) return null;

  return (
    <div
      ref={menuRef}
      className={classNames(styles.menu_wrapper, className)}
      style={{
        top: menuPosition.top,
        left: menuPosition.left,
        minWidth: triggerWidth,
        opacity: isAnimating ? 1 : 0,
        transition: `opacity ${animationDuration}ms ease-in-out`,
        visibility: isReadyForDisplay ? "visible" : "hidden",
        position: "fixed",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
