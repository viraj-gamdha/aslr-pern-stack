import s from "./form-input.module.scss";
import { CSSProperties } from "react";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  Input,
  InputProps,
  InputTypes,
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
  } = form;
  const errorMessage = errors[id]?.message as string;

  // Specifically for input we have to add value type for rhf
  const getRegisterOptions = (
    variant: "input" | "select" | "textarea" | "custom-select" | "otp-inputs",
    type?: InputTypes
  ) => {
    if (variant !== "input") return {};

    switch (type) {
      case "number":
        return { valueAsNumber: true };
      case "date":
        return { valueAsDate: true };
      default:
        return {};
    }
  };

  const registeredProps = register(
    id,
    getRegisterOptions(variant, (props as InputProps).type)
  );

  const renderVariant = () => {
    switch (variant) {
      case "select":
        return (
          <Select
            label={label}
            {...registeredProps}
            {...(props as SelectProps)}
          />
        );
      case "textarea":
        return (
          <Textarea
            label={label}
            {...registeredProps}
            {...(props as TextareaProps)}
          />
        );
      case "custom-select": {
        const customSelectProps = props as CustomSelectProps;
        return (
          <Controller
            name={id}
            control={form.control}
            render={({ field }) => (
              <CustomSelect
                label={label}
                value={field.value}
                onChange={(val: string | string[]) => {
                  field.onChange(val);
                  if (customSelectProps.onChange) {
                    customSelectProps.onChange(val);
                  }
                }}
                {...customSelectProps}
              />
            )}
          />
        );
      }

      case "otp-inputs": {
        const otpInputsProps = props as OTPInputsProps;
        const { onOTPChange, ...restProps } = otpInputsProps;

        return (
          <Controller
            name={id}
            control={form.control}
            render={({ field }) => (
              <OTPInputs
                label={label}
                value={field.value}
                name={id}
                onOTPChange={(val: string) => {
                  field.onChange(val);
                  if (onOTPChange) {
                    onOTPChange(val);
                  }
                }}
                {...restProps}
              />
            )}
          />
        );
      }

      case "input":
      default:
        return (
          <Input
            label={label}
            valueWatch={form.watch(id)} ///for internal use in input
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

// Some understandable notes
// Why we are using Controller for custom components
/*
-> Without controller -----
<CustomSelect
  value={form.watch("country")}
  onChange={(val) => {
    setValue("country", val, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    trigger("country");
  }}
/>

Here we manually:
-Watch the value
-Set the value
-Trigger validation

-> With controller -----
<Controller
  name="country"
  control={form.control}
  render={({ field }) => (
    <CustomSelect
      value={field.value}
      onChange={field.onChange}
    />
  )}
/>
RHF handles:
-Value binding
-Change updates
-Validation triggering
-Works seamlessly with defaultValues, reset, formState, and other RHF utilities.
-You don’t have to remember to update dirty/touched state or trigger validation manually.
*/
