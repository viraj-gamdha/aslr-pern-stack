"use client";

import s from "../auth.module.scss";
import { errorToast, successToast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, LinkButton } from "@/components/ui/button";
import { SignupFormInputs, signupSchema } from "@/types/user";
import { useSignupMutation } from "@/redux/apis/authApiSlice";
import { parseError } from "@/utils/helpers";
import classNames from "classnames";
import { FormInput } from "@/components/ui/form-input";

const Signup = () => {
  const [signup, { isLoading }] = useSignupMutation();

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
        successToast(res.message);
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
        className={classNames("form-wrapper-1", s.form)}
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
          placeholder="Re-Enter your password"
          type="password"
          autoComplete="new-password"
          form={form}
        />

        <Button variant="primary" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? "Creating account..." : "Signup"}
        </Button>

        <div className={s.link}>
          <p>Already have an account?</p>
          <LinkButton href={"/signin"} variant="border_b">
            Signin
          </LinkButton>
        </div>
      </form>
    </div>
  );
};

export default Signup;
