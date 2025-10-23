import {
  useRef,
  useState,
  useEffect,
  type CSSProperties,
  type ReactNode,
} from "react";
import s from "./tooltip.module.scss";
import classNames from "classnames";

interface TooltipProps {
  children: ReactNode;
  tooltip: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  offset?: number;
  style?: CSSProperties;
  animationDuration?: number;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const Tooltip = ({
  children,
  tooltip,
  position = "bottom",
  align = "center",
  offset = 8,
  style = {},
  animationDuration = 200,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
}: TooltipProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Determine if the tooltip is controlled externally
  const isControlled =
    controlledIsOpen !== undefined && controlledSetIsOpen !== undefined;
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isVisible = isControlled ? controlledIsOpen! : internalIsOpen;
  const setIsVisible = isControlled ? controlledSetIsOpen! : setInternalIsOpen;

  // Position and rendering state
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [isMeasured, setIsMeasured] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // ─── Calculate tooltip position ─────────
  const calculatePosition = () => {
    if (!wrapperRef.current || !tooltipRef.current) return;

    const targetRect = wrapperRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    // Main axis placement (offset applied here)
    switch (position) {
      case "top":
        top = targetRect.top - tooltipRect.height - offset;
        break;
      case "bottom":
        top = targetRect.bottom + offset;
        break;
      case "left":
        left = targetRect.left - tooltipRect.width - offset;
        break;
      case "right":
        left = targetRect.right + offset;
        break;
    }

    // Cross-axis alignment
    switch (position) {
      case "top":
      case "bottom":
        // Horizontal alignment
        if (align === "start") left = targetRect.left;
        else if (align === "end") left = targetRect.right - tooltipRect.width;
        else
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case "left":
      case "right":
        // Vertical alignment
        if (align === "start") top = targetRect.top;
        else if (align === "end")
          top = targetRect.top + targetRect.height - tooltipRect.height;
        else
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        break;
    }

    // Collision detection to stay within viewport
    const PADDING = 4;
    top = Math.max(
      PADDING,
      Math.min(top, viewportHeight - tooltipRect.height - PADDING)
    );
    left = Math.max(
      PADDING,
      Math.min(left, viewportWidth - tooltipRect.width - PADDING)
    );

    setCoords({ top, left });
    setIsMeasured(true);
  };

  // ─── Handle tooltip show/hide ─────────
  useEffect(() => {
    if (isVisible) {
      // Show tooltip and calculate its position on next animation frame
      setShouldRender(true);
      const frame = requestAnimationFrame(() => calculatePosition());
      return () => cancelAnimationFrame(frame);
    } else {
      // Hide tooltip with fade out animation
      setIsMeasured(false);
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, animationDuration);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, position, align, offset, animationDuration]);

  // ─── Update position on scroll or resize ─
  useEffect(() => {
    if (!isVisible) return;
    const handleUpdate = () => {
      if (isMeasured) calculatePosition();
    };
    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);
    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [isVisible, isMeasured, position, align, offset]);

  return (
    <>
      {/* Wrapper for the element that triggers the tooltip */}
      <div
        ref={wrapperRef}
        className={s.container}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {/* Tooltip element */}
      {shouldRender && (
        <div
          ref={tooltipRef}
          className={classNames(
            s.wrapper,
            isVisible && isMeasured && s.visible
          )}
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            opacity: isMeasured ? 1 : 0,
            pointerEvents: "none",
            transition: `opacity ${animationDuration}ms ease-in-out`,
            zIndex: 9999,
            ...style,
          }}
        >
          {tooltip}
        </div>
      )}
    </>
  );
};

export default Tooltip;
