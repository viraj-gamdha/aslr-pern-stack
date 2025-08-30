"use client";

import { errorToast, successToast } from "@/components/ui/toast";
import s from "../auth.module.scss";
import classNames from "classnames";
import React, { useState } from "react";
import { parseError } from "@/utils/helpers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, LinkButton } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useRequestOTPMutation } from "@/redux/apis/authApiSlice";
import { SendOTPInputs, sendOTPSchema } from "@/types/user";
import ResetPassOTPModal from "@/components/page/auth/reset-pass-otp-modal";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [forgotPass, { isLoading }] = useRequestOTPMutation();
  const [showResetPassModal, setShowResetPassModal] = useState(false);
  const navigate = useRouter();

  const form = useForm<SendOTPInputs>({
    resolver: zodResolver(sendOTPSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: SendOTPInputs) => {
    try {
      const res = await forgotPass(data).unwrap();
      if (res.success) {
        successToast(res.message);
        setShowResetPassModal(true);
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  const handleOnSuccessReset = async () => {
    setShowResetPassModal(false);
    // navigate to signin...
    navigate.push("/signin");
    form.reset();
  };

  return (
    <div className={classNames("content", s.container)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className={classNames("form-wrapper-1", s.form)}
      >
        <h4>Forgot Password?</h4>

        <FormInput
          id="email"
          label="Email"
          placeholder="Enter your email"
          type="email"
          form={form}
        />

        <p>
          You will receive an email containing a 4-digit OTP, which you&apos;ll need
          to enter to reset your password.
        </p>

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? "Sending email..." : "Reset Password"}
        </Button>

        <div className={s.link}>
          <p>Go to</p>
          <LinkButton href={"/signup"} variant="border_b">
            Signin
          </LinkButton>
        </div>
      </form>

      {showResetPassModal && form.getValues("email") && (
        <ResetPassOTPModal
          email={form.getValues("email")}
          onClose={() => setShowResetPassModal(false)}
          onSuccess={handleOnSuccessReset}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
