import {
  useRef,
  useState,
  useEffect,
  type CSSProperties,
  type ReactNode,
} from "react";
import s from "./tooltip.module.scss";
import classNames from "classnames";

const Tooltip = ({
  children,
  tooltip,
  position = "bottom",
  offset = 8,
  style = {},
}: {
  children: ReactNode;
  tooltip: string;
  position?: "top" | "bottom" | "left" | "right";
  offset?: number;
  style?: CSSProperties;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const calculatePosition = () => {
    if (!wrapperRef.current || !tooltipRef.current) return;

    const targetRect = wrapperRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let topPos = 0;
    let leftPos = 0;

    switch (position) {
      case "top":
        topPos = targetRect.top - tooltipRect.height - offset;
        leftPos = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        topPos = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        leftPos = targetRect.left - tooltipRect.width - offset;
        break;
      case "right":
        topPos = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        leftPos = targetRect.right + offset;
        break;
      default:
        topPos = targetRect.bottom + offset;
        leftPos = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
    }

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
    if (isVisible) {
      setShouldRender(true);
      const frame = requestAnimationFrame(() => {
        calculatePosition();
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setIsMeasured(false);
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 200); // match CSS transition duration
      return () => clearTimeout(timeout);
    }
  }, [isVisible, position, offset]);

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
  }, [isVisible, isMeasured, position, offset]);

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

      {shouldRender && (
        <div
          ref={tooltipRef}
          className={classNames(
            s.wrapper,
            isVisible && isMeasured && s.visible
          )}
          style={{
            position: "fixed",
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
      )}
    </>
  );
};

export default Tooltip;
