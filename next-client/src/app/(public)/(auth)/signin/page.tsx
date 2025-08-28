"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninFormInputs, signinFormSchema } from "@/types/user";
import s from "../auth.module.scss";
import { errorToast, successToast } from "@/components/ui/toast";
import { Button, LinkButton } from "@/components/ui/button";
import { parseError } from "@/utils/helpers";
import { useSigninMutation } from "@/redux/apis/authApiSlice";
import classNames from "classnames";
import { FormInput } from "@/components/ui/form-input";

const Signin = () => {
  const [signin, { isLoading }] = useSigninMutation();

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
          {isSubmitting || isLoading ? "Logging in..." : "Signin"}
        </Button>

        <div className={s.link}>
          <p>Don&lsquo;t have an account? </p>
          <LinkButton href={"/signup"} variant="border_b">
            Signup
          </LinkButton>
        </div>
      </form>
    </div>
  );
};

export default Signin;
