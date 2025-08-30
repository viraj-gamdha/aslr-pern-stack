import type { ButtonHTMLAttributes, CSSProperties, FC, ReactNode } from "react";
import classNames from "classnames";
import s from "./button.module.scss";
import Link, { LinkProps } from "next/link";

type ButtonVariants =
  | "primary"
  | "bordered"
  | "bordered_sm"
  | "border_b"
  | "icon"
  | "icon_title"
  | "icon_bordered";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  children?: ReactNode;
  as?: "button" | "span";
}

export const Button: FC<ButtonProps> = ({
  variant,
  className,
  children = "Button",
  disabled,
  ...props
}) => {
  return (
    <button
      className={classNames(
        s.base,
        variant && s[variant],
        className,
        disabled && s.disabled
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariants;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const LinkButton: FC<LinkButtonProps> = ({
  variant,
  children = "Link",
  className,
  href = "/",
  replace,
  disabled,
  style,
  ...rest
}) => {
  const classes = classNames(
    s.base,
    variant && s[variant],
    className,
    disabled && s.disabled
  );

  return (
    <Link
      href={href}
      style={style}
      replace={replace}
      aria-disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </Link>
  );
};
