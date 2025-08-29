import s from "./form-input.module.scss";
import { CSSProperties } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  Input,
  InputProps,
  Select,
  SelectProps,
  Textarea,
  TextareaProps,
} from "./input";
import { CustomSelect, CustomSelectProps } from "./select";
import OTPInputs, { OTPInputsProps } from "./otp-inputs";
import classNames from "classnames";

// Common props for all FormInput variants
type FormInputCommonProps<T extends FieldValues> = {
  id: Path<T>;
  form: UseFormReturn<T>;
  formInputStyle?: CSSProperties;
  formInputClassName?: string;
  showError?: boolean;
};

// Variants and its types
type FormInputVariantProps =
  | ({ variant?: "input" } & InputProps)
  | ({ variant: "select" } & SelectProps)
  | ({ variant: "textarea" } & TextareaProps)
  | ({ variant: "custom-select" } & CustomSelectProps)
  | ({ variant: "otp-inputs" } & OTPInputsProps);

// Final combined props for the FormInput component
export type FormInputProps<T extends FieldValues> = FormInputCommonProps<T> &
  FormInputVariantProps;

export const FormInput = <T extends FieldValues>({
  form,
  id,
  variant = "input",
  label,
  formInputStyle,
  formInputClassName,
  showError = true,
  ...props
}: FormInputProps<T>) => {
  const {
    register,
    formState: { errors, isSubmitted },
    watch,
    setValue,
    trigger,
  } = form;
  const errorMessage = errors[id]?.message as string;
  const value = watch(id);
  const registeredProps = register(id);

  const renderVariant = () => {
    switch (variant) {
      case "select":
        return (
          <Select
            label={label}
            value={value}
            {...registeredProps}
            {...(props as SelectProps)}
          />
        );
      case "textarea":
        return (
          <Textarea
            label={label}
            value={value as string}
            {...registeredProps}
            {...(props as TextareaProps)}
          />
        );
      case "custom-select": {
        const customSelectProps = props as CustomSelectProps;
        return (
          <CustomSelect
            label={label}
            value={value}
            name={id}
            onChange={(val: string | string[]) => {
              setValue(id, val as T[Path<T>], {
                shouldValidate: isSubmitted,
                shouldDirty: true,
                shouldTouch: true,
              });
              if (isSubmitted) trigger(id);
              if (customSelectProps.onChange) {
                customSelectProps.onChange(val);
              }
            }}
            {...customSelectProps}
          />
        );
      }
      case "otp-inputs": {
        const otpInputsProps = props as OTPInputsProps;
        const { onOTPChange, ...restProps } = otpInputsProps;

        return (
          <OTPInputs
            label={label}
            value={value as string}
            name={id}
            onOTPChange={(val: string) => {
              setValue(id, val as T[Path<T>], {
                shouldValidate: isSubmitted,
                shouldDirty: true,
                shouldTouch: true,
              });
              if (isSubmitted) trigger(id);
              if (onOTPChange) {
                onOTPChange(val);
              }
            }}
            {...restProps}
          />
        );
      }
      case "input":
      default:
        return (
          <Input
            label={label}
            value={value as string | number}
            {...registeredProps}
            {...(props as InputProps)}
          />
        );
    }
  };

  return (
    <div
      style={formInputStyle}
      className={classNames(s.wrapper, formInputClassName)}
    >
      {renderVariant()}
      {errorMessage && showError && isSubmitted && (
        <p className={s.error}>{errorMessage}</p>
      )}
    </div>
  );
};
