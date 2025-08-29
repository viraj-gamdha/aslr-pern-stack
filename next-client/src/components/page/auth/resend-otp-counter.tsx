import { Button } from "@/components/ui/button";
import s from "./resend-otp-counter.module.scss";
import React, { MouseEvent, useEffect, useState } from "react";
import { useRequestOTPMutation } from "@/redux/apis/authApiSlice";
import { errorToast, successToast } from "@/components/ui/toast";
import { parseError } from "@/utils/helpers";

type ResendOTPCounterProps = {
  email: string;
  initialCount?: number;
};

const ResendOTPCounter: React.FC<ResendOTPCounterProps> = ({
  email,
  initialCount,
}) => {
  const [resetCount, setResetCount] = useState(initialCount || 60);

  useEffect(() => {
    const interval = setInterval(() => {
      if (resetCount > 0) {
        setResetCount(resetCount - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [resetCount, setResetCount]);

  const [resendOTP, { isLoading }] = useRequestOTPMutation();
  const onResendClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const res = await resendOTP({ email }).unwrap();

      if (res.success) {
        successToast(res.message);
        setResetCount(res.data.resendAfter);
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  return (
    <div className={s.container}>
      {resetCount === 0 ? (
        <Button
          variant="border_b"
          type="button"
          onClick={onResendClick}
          disabled={isLoading}
        >
          Resend
        </Button>
      ) : (
        <p>
          Resend in <span>{resetCount} sec</span>
        </p>
      )}
    </div>
  );
};
export default ResendOTPCounter;
