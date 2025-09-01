import {
  useRef,
  useState,
  useEffect,
  type CSSProperties,
  type ReactNode,
} from "react";
import s from "./tooltip.module.scss";
import { Portal } from "./portal";
import classNames from "classnames";

const Tooltip = ({
  children,
  tooltip,
  top = false,
  bottom = false,
  left = false,
  right = false,
  offset = 8,
  style = {},
}: {
  children: ReactNode;
  tooltip: string;
  top?: boolean;
  bottom?: boolean;
  right?: boolean;
  left?: boolean;
  offset?: number;
  style?: CSSProperties;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);

  const calculatePosition = () => {
    if (!wrapperRef.current || !tooltipRef.current) return;

    const targetRect = wrapperRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let topPos = 0;
    let leftPos = 0;

    // Determine position based on props (default to bottom if none specified)
    if (top) {
      topPos = targetRect.top - tooltipRect.height - offset;
      leftPos = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
    } else if (left) {
      topPos = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      leftPos = targetRect.left - tooltipRect.width - offset;
    } else if (right) {
      topPos = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      leftPos = targetRect.right + offset;
    } else {
      // Default to bottom
      topPos = targetRect.bottom + offset;
      leftPos = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
    }

    // Clamp to viewport bounds
    topPos = Math.max(
      4,
      Math.min(topPos, viewportHeight - tooltipRect.height - 4)
    );
    leftPos = Math.max(
      4,
      Math.min(leftPos, viewportWidth - tooltipRect.width - 4)
    );

    setCoords({ top: topPos, left: leftPos });
    setIsMeasured(true);
  };

  useEffect(() => {
    if (!isVisible) {
      setIsMeasured(false);
      return;
    }

    // Use requestAnimationFrame to ensure DOM has updated
    const frame = requestAnimationFrame(() => {
      calculatePosition();
    });

    return () => cancelAnimationFrame(frame);
  }, [isVisible, top, bottom, left, right, offset]);

  // Recalculate on scroll/resize
  useEffect(() => {
    if (!isVisible) return;

    const handleUpdate = () => {
      if (isMeasured) {
        calculatePosition();
      }
    };

    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [isVisible, isMeasured, top, bottom, left, right, offset]);

  return (
    <>
      <div
        ref={wrapperRef}
        className={s.container}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {/* <Portal> */}
      <div
        ref={tooltipRef}
        className={classNames(s.wrapper, isVisible && isMeasured && s.visible)}
        style={{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          opacity: isMeasured ? 1 : 0,
          pointerEvents: "none",
          zIndex: 9999,
          ...style,
        }}
      >
        {tooltip}
      </div>
      {/* </Portal> */}
    </>
  );
};

export default Tooltip;
