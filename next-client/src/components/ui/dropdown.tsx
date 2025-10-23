import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  type CSSProperties,
  type ReactNode,
  type FC,
  type RefObject,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import classNames from "classnames";
import styles from "./dropdown.module.scss";
import { usePathname } from "next/navigation";

// ─── Context ─────────────────────────────
interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
  menuRef: RefObject<HTMLDivElement | null>;
  coords: { top: number; left: number };
  isMeasured: boolean;
  shouldRender: boolean;
  animationDuration: number;
  triggerWidth: number;
}

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

export const useDropdown = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("useDropdown must be used within DropDown");
  return ctx;
};

// ─── DropDown Component ─────────────────
interface DropDownProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  position?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  offset?: number;
  animationDuration?: number;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  closeOnClickOutside?: boolean;
  closeOnPathChange?: boolean;
  onClose?: () => void;
}

export const DropDown: FC<DropDownProps> = ({
  children,
  className,
  style,
  position = "bottom",
  align = "center",
  offset = 8,
  animationDuration = 200,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  closeOnClickOutside = true,
  closeOnPathChange = true,
  onClose,
}) => {
  const path = usePathname();
  const isControlled =
    controlledIsOpen !== undefined && controlledSetIsOpen !== undefined;
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isControlled ? controlledIsOpen! : internalIsOpen;
  const setIsOpen = isControlled ? controlledSetIsOpen! : setInternalIsOpen;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [shouldRender, setShouldRender] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState(0);

  // ─── Calculate Menu Position ─────────────
  const calculatePosition = useCallback(() => {
    if (!dropdownRef.current || !menuRef.current) return;

    const triggerRect = dropdownRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const { innerWidth, innerHeight } = window;

    let top = 0;
    let left = 0;

    // ─── Main axis positioning (offset applies here) ─────
    switch (position) {
      case "top":
        top = triggerRect.top - menuRect.height - offset; // vertical gap above trigger
        break;
      case "bottom":
        top = triggerRect.bottom + offset; // vertical gap below trigger
        break;
      case "left":
        left = triggerRect.left - menuRect.width - offset; // horizontal gap to the left
        break;
      case "right":
        left = triggerRect.right + offset; // horizontal gap to the right
        break;
    }

    // ─── Cross axis positioning (align applies here) ─────
    switch (position) {
      case "top":
      case "bottom":
        // horizontal alignment
        if (align === "start") left = triggerRect.left;
        else if (align === "end") left = triggerRect.right - menuRect.width;
        else left = triggerRect.left + (triggerRect.width - menuRect.width) / 2;
        break;
      case "left":
      case "right":
        // vertical alignment
        if (align === "start") top = triggerRect.top;
        else if (align === "end") top = triggerRect.bottom - menuRect.height;
        else
          top = triggerRect.top + triggerRect.height / 2 - menuRect.height / 2;
        break;
    }

    // ─── Collision detection ──────────────
    const PADDING = 8;
    top = Math.max(
      PADDING,
      Math.min(top, innerHeight - menuRect.height - PADDING)
    );
    left = Math.max(
      PADDING,
      Math.min(left, innerWidth - menuRect.width - PADDING)
    );

    setCoords({ top, left });
    setTriggerWidth(triggerRect.width);
    setIsMeasured(true);
  }, [position, align, offset]);

  // ─── Open / Close Handling ─────────────
  // This effect handles the rendering and unmounting of the dropdown menu
  // whenever `isOpen` changes.
  // - When opening: `shouldRender` is set to true so that the menu is added to the DOM.
  // - When closing: we first mark it as not measured (so opacity/animation can reset),
  //   then after `animationDuration` we remove it from DOM (`shouldRender = false`)
  //   and call the optional `onClose` callback.
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      setIsMeasured(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        if (onClose) onClose();
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDuration, onClose]);

  // ─── Measure after menu is rendered ─────
  // This layout effect runs after the menu has been rendered to the DOM.
  // - Ensures we can measure its size (`menuRef.current.getBoundingClientRect()`)
  //   and calculate the correct top/left coordinates.
  // - We also attach a `ResizeObserver` to the menu so that if its size changes
  //   (dynamic content, list items added, etc.), we recalculate the position.
  // - Clean up observer on unmount or re-render.
  useLayoutEffect(() => {
    if (shouldRender && menuRef.current) {
      calculatePosition();
      const observer = new ResizeObserver(() => calculatePosition());
      observer.observe(menuRef.current);
      return () => observer.disconnect();
    }
  }, [shouldRender, calculatePosition]);

  // ─── Recalculate on scroll / resize ─────
  useEffect(() => {
    if (!isOpen) return;
    const handler = () => {
      if (isMeasured) calculatePosition();
    };
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [isOpen, isMeasured, calculatePosition]);

  // ─── Close on path change ──────────────
  useEffect(() => {
    if (closeOnPathChange) setIsOpen(false);
  }, [path, closeOnPathChange, setIsOpen]);

  // ─── Close on outside click ────────────
  useEffect(() => {
    if (!closeOnClickOutside) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [closeOnClickOutside, setIsOpen]);

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        setIsOpen,
        dropdownRef,
        menuRef,
        coords,
        isMeasured,
        shouldRender,
        animationDuration,
        triggerWidth,
      }}
    >
      <div
        ref={dropdownRef}
        className={classNames(styles.container, className)}
        style={style}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

// ─── Trigger ─────────────────────────────
interface DropDownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  asChild?: boolean;
}
export const DropDownTrigger: FC<DropDownTriggerProps> = ({
  children,
  className,
  style,
  asChild = false,
  ...rest
}) => {
  const { setIsOpen, isOpen } = useDropdown();
  if (asChild) {
    return (
      <div
        className={classNames(styles.trigger, className)}
        style={style}
        onClick={() => setIsOpen(!isOpen)}
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
      className={classNames(styles.trigger, className)}
      style={style}
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

// ─── Menu ───────────────────────────────
interface DropDownMenuProps {
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
    shouldRender,
    isMeasured,
    coords,
    menuRef,
    triggerWidth,
    animationDuration,
  } = useDropdown();
  if (!shouldRender) return null;
  return (
    <div
      ref={menuRef}
      className={classNames(styles.menu_wrapper, className)}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        minWidth: triggerWidth,
        opacity: isMeasured ? 1 : 0,
        transition: `opacity ${animationDuration}ms ease-in-out`,
        zIndex: 9999,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
