import Modal from "@/components/ui/modal";
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
  onClose,
  onSuccess,
}: {
  email: string;
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

  const [resetPass, { isLoading }] = useResetPasswordMutation();

  const onSubmit = async (data: ResetPassInputs) => {
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

  return (
    <Modal heading="Reset Password" onClose={onClose}>
      <div className="modal-content">
        <form onSubmit={handleSubmit(onSubmit)}>
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

          <p className="modal-form-col-1">
            Enter a 4 digit OTP sent to
            <span>{email}</span>
          </p>

          <div className="modal-form-col-2">
            <FormInput
              form={form}
              id="emailOTP"
              variant="otp-inputs"
              style={{ width: "fit-content" }}
              formInputStyle={{ alignItems: "center" }}
            />
            <ResendOTPCounter email={email} />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            variant="primary"
            style={{ width: "100%", maxWidth: "16rem", marginTop: "0.5rem" }}
          >
            Submit & Reset Password
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default ResetPassOTPModal;
