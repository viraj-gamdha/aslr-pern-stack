import {
  useRef,
  useState,
  useEffect,
  type CSSProperties,
  type ReactNode,
} from "react";
import s from "./tooltip.module.scss";
import { Portal } from "./portal";

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

  useEffect(() => {
    if (!isVisible || !wrapperRef.current || !tooltipRef.current) return;

    const targetRect = wrapperRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let topPos = 0;
    let leftPos = 0;

    if (top) {
      topPos = targetRect.top - tooltipRect.height - offset;
      leftPos = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
    } else if (bottom) {
      topPos = targetRect.bottom + offset;
      leftPos = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
    } else if (left) {
      topPos = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      leftPos = targetRect.left - tooltipRect.width - offset;
    } else if (right) {
      topPos = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      leftPos = targetRect.right + offset;
    }

    // Clamp to viewport
    topPos = Math.max(
      4,
      Math.min(topPos, viewportHeight - tooltipRect.height - 4)
    );
    leftPos = Math.max(
      4,
      Math.min(leftPos, viewportWidth - tooltipRect.width - 4)
    );

    setCoords({ top: topPos, left: leftPos });
  }, [isVisible, top, bottom, left, right, offset]);

  return (
    <>
      <div
        ref={wrapperRef}
        className={s.wrapper}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      <Portal>
        <div
          ref={tooltipRef}
          className={`${s.tooltip} ${isVisible ? s.visible : ""}`}
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            ...style,
          }}
        >
          {tooltip}
        </div>
      </Portal>
    </>
  );
};

export default Tooltip;
