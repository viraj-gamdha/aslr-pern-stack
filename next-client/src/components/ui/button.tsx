import {
  ElementType,
  ReactNode,
  ComponentPropsWithoutRef,
  PropsWithChildren,
} from "react";
import classNames from "classnames";
import s from "./button.module.scss";
import Link, { LinkProps } from "next/link";

export type ButtonVariants =
  | "primary"
  | "bordered"
  | "bordered_sm"
  | "border_b"
  | "icon"
  | "icon_title"
  | "icon_bordered";

// Polymorphic types
type AsProp<T extends ElementType> = {
  as?: T;
};

type PropsToOmit<T extends ElementType, P> = keyof (AsProp<T> & P);

type PolymorphicComponentProps<
  T extends ElementType,
  Props = {}
> = PropsWithChildren<Props & AsProp<T>> &
  Omit<ComponentPropsWithoutRef<T>, PropsToOmit<T, Props>>;

// Button-specific props
type ButtonOwnProps = {
  variant?: ButtonVariants;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
};

type ButtonProps<T extends ElementType> = PolymorphicComponentProps<
  T,
  ButtonOwnProps
>;

// Polymorphic Button component
export const Button = <T extends ElementType = "button">({
  as,
  variant,
  className,
  children = "Button",
  disabled,
  isActive,
  ...rest
}: ButtonProps<T>) => {
  const Component = as || "button";

  return (
    <Component
      className={classNames(
        s.base,
        variant && s[variant],
        isActive && s.active,
        className,
        disabled && s.disabled
      )}
      {...(Component === "button" ? { disabled } : {})}
      {...rest}
    >
      {children}
    </Component>
  );
};

// LinkButton component
interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariants;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  isActive?: boolean;
}

export const LinkButton = ({
  variant,
  children = "Link",
  className,
  href = "/",
  replace,
  disabled,
  style,
  isActive,
  ...rest
}: LinkButtonProps) => {
  const classes = classNames(
    s.base,
    variant && s[variant],
    isActive && s.active,
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
