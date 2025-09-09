"use client";

import { Modal, ModalHeader, ModalContent } from "@/components/ui/modal";
import { errorToast, successToast } from "@/components/ui/toast";
import { useResetPasswordMutation } from "@/redux/apis/authApiSlice";
import { ResetPassInputs, resetPassSchema } from "@/types/user";
import { parseError } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import ResendOTPCounter from "./resend-otp-counter";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";

const ResetPassOTPModal = ({
  email,
  isOpen = false,
  onClose,
  onSuccess,
}: {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {

  const form = useForm<ResetPassInputs>({
    resolver: zodResolver(resetPassSchema),
    defaultValues: {
      email: email,
      emailOTP: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  console.log(form.formState.errors);

  const [resetPass, { isLoading }] = useResetPasswordMutation();

  const onSubmit = async (data: ResetPassInputs) => {
    console.log(data);
    try {
      const res = await resetPass(data).unwrap();

      if (res.success) {
        successToast(res.message);
        onSuccess();
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  if(!isOpen) return null

  return (
    <Modal onClose={onClose} isOpen={isOpen} closeOnOutsideClick={false}>
      <ModalHeader>
        <span>Reset Password</span>
      </ModalHeader>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="modal-col-1">
            Enter a 4 digit OTP sent to
            <span>{email}</span>
          </p>

          <div className="modal-col-2">
            <FormInput
              form={form}
              id="emailOTP"
              variant="otp-inputs"
              style={{ width: "fit-content" }}
              formInputStyle={{ alignItems: "center" }}
            />
            <ResendOTPCounter email={email} />
          </div>

          <FormInput
            form={form}
            id="password"
            label="Password"
            placeholder="Enter new password"
            variant="input"
            autoComplete="new-password"
            type="password"
          />
          <FormInput
            form={form}
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter new password"
            variant="input"
            type="password"
            autoComplete="new-password"
          />

          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            variant="primary"
            style={{ width: "100%", maxWidth: "16rem", marginTop: "0.5rem" }}
          >
            Submit & Reset Password
          </Button>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ResetPassOTPModal;
