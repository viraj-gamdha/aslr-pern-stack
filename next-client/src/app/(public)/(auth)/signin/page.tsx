"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninFormInputs, signinFormSchema } from "@/types/user";
import s from "../auth.module.scss";
import {
  errorToast,
  infoToast,
  successToast,
  toastQueue,
} from "@/components/ui/toast";
import { Button, LinkButton } from "@/components/ui/button";
import { parseError } from "@/utils/helpers";
import {
  useRequestOTPMutation,
  useSigninMutation,
} from "@/redux/apis/authApiSlice";
import classNames from "classnames";
import { FormInput } from "@/components/ui/form-input";
import { useState } from "react";
import VerifyEmailOTPModal from "@/components/page/auth/verify-email-otp-modal";

const Signin = () => {
  const [signin, { isLoading }] = useSigninMutation();
  const [requestOTP, { isLoading: loadingSendOTP }] = useRequestOTPMutation();
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const form = useForm<SigninFormInputs>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: SigninFormInputs) => {
    try {
      const res = await signin(data).unwrap();
      if (res.success && res.data.emailVerified) {
        successToast(res.message);
        form.reset();
      } else {
        // proceed to request otp
        const resReqOTP = await requestOTP({
          email: form.getValues("email"),
        }).unwrap();

        if (resReqOTP.success) {
          toastQueue([
            () => infoToast(res.message),
            () => successToast(resReqOTP.message),
          ]);
          setShowVerificationModal(true);
        }
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  const handleOnSuccessVerification = async () => {
    setShowVerificationModal(false);
    // proceed to signin again...
    try {
      const res = await signin({
        email: form.getValues("email"),
        password: form.getValues("password"),
      }).unwrap();

      // here mostly email will be verified so no need to check again..
      if (res.success) {
        successToast(res.message);
        form.reset();
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
        className={classNames("form-wrapper-a", s.form)}
      >
        <h4>Signin</h4>

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
          form={form}
        />

        <div className={s.link}>
          <p>Forgot your password? </p>
          <LinkButton variant="border_b" href={"/forgot-password"}>
            Reset Password
          </LinkButton>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading
            ? "Logging in..."
            : loadingSendOTP
            ? "Sending OTP..."
            : "Signin"}
        </Button>

        <div className={s.link}>
          <p>Don&lsquo;t have an account? </p>
          <LinkButton href={"/signup"} variant="border_b">
            Signup
          </LinkButton>
        </div>
      </form>

      <VerifyEmailOTPModal
        isOpen={showVerificationModal && !!form.getValues("email")}
        email={form.getValues("email")}
        onClose={() => setShowVerificationModal(false)}
        onSuccess={handleOnSuccessVerification}
      />
    </div>
  );
};

export default Signin;
