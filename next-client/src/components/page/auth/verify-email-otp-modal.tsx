import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Modal, ModalHeader, ModalContent } from "@/components/ui/modal";
import { errorToast, successToast } from "@/components/ui/toast";
import { useVerifyOTPMutation } from "@/redux/apis/authApiSlice";
import { VerifyEmailOTPInputs, verifyEmailOTPSchema } from "@/types/user";
import { parseError } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import ResendOTPCounter from "./resend-otp-counter";

const VerifyEmailOTPModal = ({
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
  const form = useForm<VerifyEmailOTPInputs>({
    resolver: zodResolver(verifyEmailOTPSchema),
    defaultValues: {
      email: email,
      emailOTP: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const [verify, { isLoading }] = useVerifyOTPMutation();

  const onSubmit = async (data: VerifyEmailOTPInputs) => {
    try {
      const res = await verify(data).unwrap();

      if (res.success) {
        successToast(res.message);
        onSuccess();
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  if(!isOpen) return null;

  return (
    <Modal onClose={onClose} isOpen={isOpen} closeOnOutsideClick={false}>
      <ModalHeader>
        <span>Verify Email</span>
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

          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            variant="primary"
            style={{ width: "100%", maxWidth: "14rem", marginTop: "0.5rem" }}
          >
            Submit & Verify
          </Button>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default VerifyEmailOTPModal;
