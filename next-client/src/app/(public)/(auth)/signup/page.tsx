"use client";

import s from "../auth.module.scss";
import { errorToast, successToast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, LinkButton } from "@/components/ui/button";
import { SignupFormInputs, signupSchema } from "@/types/user";
import {
  useRequestOTPMutation,
  useSigninMutation,
  useSignupMutation,
} from "@/redux/apis/authApiSlice";
import { parseError } from "@/utils/helpers";
import classNames from "classnames";
import { FormInput } from "@/components/ui/form-input";
import VerifyEmailOTPModal from "@/components/page/auth/verify-email-otp-modal";
import { useState } from "react";

const Signup = () => {
  const [signup, { isLoading }] = useSignupMutation();
  const [requestOTP, { isLoading: loadingSendOTP }] = useRequestOTPMutation();

  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const form = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      const res = await signup(data).unwrap();
      if (res.success) {
        // successToast(res.message);

        // proceed to request otp
        const resReqOTP = await requestOTP({
          email: form.getValues("email"),
        }).unwrap();

        if (resReqOTP.success) {
          successToast(resReqOTP.message);
          setShowVerificationModal(true);
        }
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  const [signin, { isLoading: loadingSignin }] = useSigninMutation();
  const handleOnSuccessVerification = async () => {
    setShowVerificationModal(false);
    // proceed to signin
    try {
      const res = await signin({
        email: form.getValues("email"),
        password: form.getValues("confirmPassword"),
      }).unwrap();

      // here mostly email will be verified so no need to check..
      if (res.success) {
        successToast(res.message);
        form.reset();
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  return (
    <div className={s.container}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className={classNames("form-wrapper-a", s.form)}
      >
        <h4>Signup</h4>

        <FormInput
          id="name"
          label="Name"
          placeholder="Enter your name"
          type="text"
          form={form}
        />

        <FormInput
          id="email"
          label="Email"
          placeholder="Enter your email"
          type="email"
          form={form}
        />

        <FormInput
          id="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          autoComplete="new-password"
          form={form}
        />

        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          type="password"
          autoComplete="new-password"
          form={form}
        />

        <Button variant="primary" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading
            ? "Creating account..."
            : loadingSendOTP
            ? "Sending OTP..."
            : loadingSignin
            ? "Signing in..."
            : "Signup"}
        </Button>

        <div className={s.link}>
          <p>Already have an account?</p>
          <LinkButton href={"/signin"} variant="border_b">
            Signin
          </LinkButton>
        </div>
      </form>

      {showVerificationModal && form.getValues("email") && (
        <VerifyEmailOTPModal
          email={form.getValues("email")}
          onClose={() => setShowVerificationModal(false)}
          onSuccess={handleOnSuccessVerification}
        />
      )}
    </div>
  );
};

export default Signup;
