// select.tsx

import s from "./select.module.scss";
import { BaseComponentProps, Input } from "./input";
import { ChevronDown, ChevronRight, LucideIcon, X } from "lucide-react";
import { Button, ButtonVariants } from "./button";
import { CSSProperties, FC, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import {
  DropDown,
  DropDownMenu,
  DropDownTrigger,
  useDropdown,
} from "./dropdown";
import Tooltip from "./tooltip";

export type CustomSelectProps = BaseComponentProps & {
  // Select specific props
  searchPlaceholder?: string;
  options: {
    value: string;
    label: string;
    icon?: LucideIcon;
    optionStyle?: CSSProperties;
  }[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  showClearIcon?: boolean;
  showChevronIcon?: boolean;
  showDisplayText?: boolean;
  showDisplayIcon?: boolean;
  disabled?: boolean;
  onClear?: () => void;

  // Dropdown main
  dropdownClassName?: string;
  dropdownStyle?: CSSProperties;

  // Dropdown trigger button
  buttonVariant?: ButtonVariants;
  buttonClassName?: string;
  buttonStyle?: CSSProperties;
  tooltip?: string;
  // in case of using select button
  tooltipPosition?: "top" | "bottom" | "left" | "right";

  // Dropdown props passed through
  closeOnPathChange?: boolean;
  closeOnClickOutside?: boolean;
  animationDuration?: number;
  position?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";

  // Menu styling props
  menuClassName?: string;
  menuStyle?: CSSProperties;

  // For options container inside menu wrapper
  optionsContainerClassName?: string;
  optionsContainerStyle?: CSSProperties;
  optionButtonVariant?: ButtonVariants;
  optionButtonStyle?: CSSProperties;
  optionButtonClassName?: string;
};

export const CustomSelect = ({
  // Base props
  label,
  className,
  style,

  // Select options and behavior
  options,
  value,
  onChange,
  multiple = false,
  searchable = false,
  showClearIcon = true,
  showChevronIcon = true,
  showDisplayIcon = true,
  showDisplayText = true,
  disabled = false,
  onClear,
  searchPlaceholder,

  // Dropdown main
  dropdownClassName,
  dropdownStyle,

  // Button styling
  buttonClassName,
  buttonStyle,
  buttonVariant = "bordered",
  tooltip,
  tooltipPosition = "bottom",

  // Dropdown behavior
  closeOnPathChange = true,
  closeOnClickOutside = true,
  animationDuration = 100,
  position = "bottom",
  align = "center",

  // Dropdown Menu styling
  menuClassName,
  menuStyle,
  optionsContainerClassName,
  optionsContainerStyle,
  optionButtonVariant = "icon",
  optionButtonClassName,
  optionButtonStyle,
}: CustomSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const filteredOptions =
    searchable && searchTerm
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;
  const selectedLabels = selectedValues
    .map((val) => options.find((opt) => opt.value === val)?.label)
    .filter(Boolean);
  const SelectedIcon = options.find(
    (opt) => opt.value === selectedValues[0]
  )?.icon;

  const hasValue = selectedValues.length > 0;

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  useEffect(() => {
    const normalized = Array.isArray(value) ? value : value ? [value] : [];
    const current = selectedValues;
    const isDifferent =
      normalized.length !== current.length ||
      normalized.some((val, i) => val !== current[i]);

    if (isDifferent && !normalized.length) {
      onClear?.();
    }
  }, [value, onClear, selectedValues]);

  const handleSelect = (optionValue: string) => {
    if (!onChange || disabled) return;

    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((val) => val !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange && !disabled) {
      onChange(multiple ? [] : "");
    }
    onClear?.();
  };

  const getDisplayText = () => {
    if (!hasValue) return searchPlaceholder || "Select...";
    if (multiple) {
      return selectedLabels.length === 1
        ? selectedLabels[0]
        : `${selectedLabels.length} selected`;
    }
    return selectedLabels[0];
  };

  return (
    <div className={classNames(s.container, className)} style={style}>
      {label && <span className={s.label}>{label}</span>}
      <DropDown
        closeOnPathChange={closeOnPathChange}
        closeOnClickOutside={closeOnClickOutside}
        animationDuration={animationDuration}
        style={dropdownStyle}
        className={dropdownClassName}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        position={position}
        align={align}
      >
        <DropDownTrigger asChild className={s.button_wrapper}>
          <SelectButton
            showClear={hasValue && showClearIcon}
            onClear={handleClear}
            showChevron={showChevronIcon}
            disabled={disabled}
            buttonClassName={buttonClassName}
            buttonStyle={buttonStyle}
            buttonVariant={buttonVariant}
            tooltip={tooltip}
            tooltipPosition={tooltipPosition}
          >
            {showDisplayIcon && SelectedIcon && (
              <span style={{ width: "fit-content" }}>
                <SelectedIcon size={16} />
              </span>
            )}
            {showDisplayText && (
              <span
                style={{ width: "100%", textAlign: "start" }}
                className="truncate-text"
              >
                {getDisplayText()}
              </span>
            )}
          </SelectButton>
        </DropDownTrigger>

        <DropDownMenu
          className={classNames(s.menu_wrapper_select, menuClassName)}
          style={menuStyle}
        >
          {searchable && (
            <div className={s.search_container}>
              <Input
                type="search"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          )}

          <div
            className={classNames(
              s.options_container,
              optionsContainerClassName
            )}
            style={optionsContainerStyle}
          >
            {filteredOptions.length === 0 ? (
              <p className={s.no_options}>No options found</p>
            ) : (
              filteredOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={optionButtonVariant}
                  className={classNames(optionButtonClassName, s.option)}
                  style={optionButtonStyle}
                  as="div"
                  disabled={disabled}
                  isActive={selectedValues.includes(option.value)}
                  onClick={() => !disabled && handleSelect(option.value)}
                >
                  {multiple && (
                    <Input
                      type="checkbox"
                      checked={selectedValues.includes(option.value)}
                      readOnly
                      disabled={disabled}
                      style={{ width: "fit-content" }}
                    />
                  )}
                  <>
                    {option.icon && (
                      <span>
                        <option.icon size={16} />
                      </span>
                    )}
                    <span
                      className={classNames("truncate-text", s.option_label)}
                      style={option.optionStyle}
                    >
                      {option.label}
                    </span>
                  </>
                </Button>
              ))
            )}
          </div>
        </DropDownMenu>
      </DropDown>
    </div>
  );
};

// Reusable Select Button component
interface SelectButtonProps {
  disabled?: boolean;
  buttonClassName?: string;
  buttonStyle?: CSSProperties;
  buttonVariant?: ButtonVariants;
  tooltip?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  showClear?: boolean;
  showChevron?: boolean;
  isSubmenu?: boolean;
  onClear?: (e: React.MouseEvent) => void;
  children?: ReactNode;
}

export const SelectButton: FC<SelectButtonProps> = ({
  disabled = false,
  buttonClassName,
  buttonStyle,
  buttonVariant = "icon_bordered",
  showClear = false,
  isSubmenu = false,
  showChevron = true,
  tooltip,
  tooltipPosition = "bottom",
  onClear,
  children,
}) => {
  const { isOpen } = useDropdown();

  const button = (
    <Button
      className={classNames(s.button_display, buttonClassName)}
      disabled={disabled}
      style={buttonStyle}
      isActive={isOpen}
      variant={buttonVariant}
      as="div"
    >
      {children}
      {(showChevron || showClear) && (
        <div className={s.actions}>
          {showClear && (
            <button
              type="button"
              className={s.clear_icon}
              onClick={onClear}
              disabled={disabled}
            >
              <X size={16} />
            </button>
          )}
          {!isSubmenu && showChevron && (
            <ChevronDown
              size={16}
              className={classNames(s.chevron, {
                [s.rotated]: isOpen,
                [s.disabled]: disabled,
              })}
            />
          )}
          {isSubmenu && showChevron && (
            <ChevronRight
              size={16}
              className={classNames(s.chevron, {
                [s.rotated_sub]: isOpen,
                [s.disabled]: disabled,
              })}
            />
          )}
        </div>
      )}
    </Button>
  );
  return (
    <>
      {tooltip ? (
        <Tooltip
          tooltip={tooltip}
          position={tooltipPosition}
          style={{ display: isOpen ? "none" : undefined }}
        >
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </>
  );
};
