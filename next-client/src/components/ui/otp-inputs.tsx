import { FC, useEffect, useRef, useState } from "react";
import s from "./otp-inputs.module.scss";
import sInput from "./input.module.scss";
import { BaseComponentProps } from "./input";
import classNames from "classnames";

export type OTPInputsProps = BaseComponentProps & {
  allowedOtpLength?: number;
  onOTPChange?: (otp: string) => void;
  firstFocus?: boolean;
  value?: string;
  name?: string;
};

const OTPInputs: FC<OTPInputsProps> = ({
  allowedOtpLength = 4,
  onOTPChange,
  firstFocus = false,
  value,
  name,
  label,
  className,
  styles,
}) => {
  const [otpValues, setOtpValues] = useState<string[]>(
    Array(allowedOtpLength).fill("")
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(allowedOtpLength).fill(null)
  );

  // Focus first input on mount if requested
  useEffect(() => {
    if (firstFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [firstFocus]);

  // Sync external value only if it changes and is different from internal state
  useEffect(() => {
    if (value && value !== otpValues.join("")) {
      const newValues = value
        .slice(0, allowedOtpLength)
        .split("")
        .map((char) => (/\d/.test(char) ? char : ""));
      setOtpValues(
        newValues.concat(Array(allowedOtpLength - newValues.length).fill(""))
      );
    }
  }, [value, allowedOtpLength]);

  // Notify parent of OTP change
  useEffect(() => {
    onOTPChange?.(otpValues.join(""));
  }, [otpValues]);

  const handleChange = (index: number, inputValue: string) => {
    if (!/^\d?$/.test(inputValue)) return;

    const newOtp = [...otpValues];
    newOtp[index] = inputValue;
    setOtpValues(newOtp);

    if (inputValue && index < allowedOtpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < allowedOtpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Backspace") {
      const newOtp = [...otpValues];
      if (otpValues[index]) {
        newOtp[index] = "";
        setOtpValues(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtpValues(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("Text")
      .replace(/[^\d]/g, "")
      .slice(0, allowedOtpLength);

    const newOtp = pasteData
      .split("")
      .concat(Array(allowedOtpLength - pasteData.length).fill(""));
    setOtpValues(newOtp);

    const nextIndex =
      pasteData.length < allowedOtpLength
        ? pasteData.length
        : allowedOtpLength - 1;
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={classNames(sInput.container, className)} style={styles}>
      {label && (
        <label className={sInput.label} htmlFor={name}>
          {label}
        </label>
      )}
      <div className={s.wrapper}>
        {Array.from({ length: allowedOtpLength }).map((_, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            className={s.box}
            maxLength={1}
            name={name}
            value={otpValues[index]}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
          />
        ))}
      </div>
    </div>
  );
};

export default OTPInputs;
