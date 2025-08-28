import s from "./select.module.scss";
import sInput from "./input.module.scss";
import { useEffect, useRef, useState } from "react";
import { BaseComponentProps, Input } from "./input";
import classNames from "classnames";
import { ChevronDown, X } from "lucide-react";

// Custom Select Component
export type CustomSelectProps = BaseComponentProps & {
  placeholder?: string;
  options: { value: string; label: string }[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  name?: string;
  onClear?: () => void;
};

export const CustomSelect = ({
  label,
  options,
  styles,
  placeholder,
  className,
  value,
  onChange,
  multiple = false,
  searchable = false,
  disabled = false,
  name,
  onClear,
  ...props
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions =
    searchable && searchTerm
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const selectedLabels = selectedValues
    .map((val) => options.find((opt) => opt.value === val)?.label)
    .filter(Boolean);

  const hasValue = selectedValues.length > 0;
  const showClear = onClear && hasValue;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (!onChange) return;

    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((val) => val !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange(multiple ? [] : "");
    }
  };

  const getDisplayText = () => {
    if (!hasValue) return placeholder || "Select...";
    if (multiple) {
      return selectedLabels.length === 1
        ? selectedLabels[0]
        : `${selectedLabels.length} selected`;
    }
    return selectedLabels[0];
  };

  return (
    <div
      className={classNames(sInput.container, className)}
      style={styles}
      ref={containerRef}
    >
      {label && <span className={sInput.label}>{label}</span>}
      <div
        className={s.wrapper}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        {...props}
      >
        {/* select - main display part */}
        <div
          className={classNames(s.display, {
            [s.open]: isOpen,
            [s.disabled]: disabled,
          })}
        >
          <span className={classNames({ [s.placeholder]: !hasValue })}>
            {getDisplayText()}
          </span>

          {/* action btns */}
          <div className={s.actions}>
            {showClear && (
              <button
                type="button"
                className={s.clear_icon}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <X size={16} />
              </button>
            )}

            <button type="button">
              <ChevronDown
                size={16}
                className={classNames(s.chevron, { [s.rotated]: isOpen })}
              />
            </button>
          </div>
        </div>

        {/* dd */}
        {isOpen && (
          <div
            className={s.dropdown}
            ref={dropdownRef}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside dropdown from toggling isOpen
          >
            {searchable && (
              <div className={s.search_container}>
                <Input
                  type="search"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* options */}
            <div className={s.options_container}>
              {filteredOptions.length === 0 ? (
                <p>No options found</p>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={classNames(s.option, {
                      [s.selected]: selectedValues.includes(option.value),
                    })}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent option click from toggling isOpen
                      handleSelect(option.value);
                    }}
                  >
                    {multiple && (
                      <Input
                        type="checkbox"
                        checked={selectedValues.includes(option.value)}
                        onChange={() => {}}
                        className={s.option_checkbox}
                        onClick={(e) => e.stopPropagation()} // Prevent checkbox click from toggling isOpen
                      />
                    )}
                    <span>{option.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
