import s from "./loader.module.scss";
import type { CSSProperties, ReactNode } from "react";
import classNames from "classnames";

export const SimpleLoader = ({ color = "var(--color-primary)", size = 1 }) => {
  return (
    <div
      className={s.simple_loader}
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
        color: color,
      }}
    >
      <svg className={s.loading_spinner} viewBox="0 0 50 50">
        <circle className={s.loading_path} cx="25" cy="25" r="20" fill="none" />
      </svg>
    </div>
  );
};

export const PageLoader = ({ style }: { style?: CSSProperties }) => {
  return (
    <div className={s.page_loader} style={style}>
      <SimpleLoader size={1.5} />
    </div>
  );
};

export const SkeletonLoader = ({
  style,
  children,
  className
}: {
  style?: CSSProperties;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div className={classNames(className,s.skeleton_shape)} style={style}>
      {children}
    </div>
  );
};
