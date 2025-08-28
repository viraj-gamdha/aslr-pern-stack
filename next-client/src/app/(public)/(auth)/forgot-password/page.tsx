"use client";

import { errorToast, successToast } from "@/components/ui/toast";
import s from "../auth.module.scss";
import classNames from "classnames";
import React from "react";
import { parseError } from "@/utils/helpers";
import { ForgotPassInputs, forgotPassSchema } from "@/types/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, LinkButton } from "@/components/ui/button";
import { useForgotPasswordMutation } from "@/redux/apis/authApiSlice";
import { FormInput } from "@/components/ui/form-input";

const ForgotPassword = () => {
  const [forgotPass, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<ForgotPassInputs>({
    resolver: zodResolver(forgotPassSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: ForgotPassInputs) => {
    try {
      const res = await forgotPass(data).unwrap();
      if (res.success) {
        successToast(res.message);
      }
    } catch (error) {
      errorToast(parseError(error));
    }
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
          You will receive an email containing a 4-digit OTP, which you'll need
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
    </div>
  );
};

export default ForgotPassword;
