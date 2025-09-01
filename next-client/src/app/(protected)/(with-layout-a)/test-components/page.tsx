"use client";

import { Button } from "@/components/ui/button";
import { successToast } from "@/components/ui/toast";
import { FormInput } from "@/components/ui/form-input";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema for select form
const selectFormSchema = z.object({
  country: z.string().min(1, "Country is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
});

type SelectFormData = z.infer<typeof selectFormSchema>;

// Schema for OTP form
const otpFormSchema = z.object({
  otp: z
    .string()
    .length(4, { message: "OTP must be exactly 4 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only digits" }),
});

type OTPFormData = z.infer<typeof otpFormSchema>;

// Sample options
const countryOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "in", label: "India" },
];

const skillOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "react", label: "React" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
];

const TestFormComponents = () => {
  const selectForm = useForm<SelectFormData>({
    resolver: zodResolver(selectFormSchema),
    defaultValues: {
      country: "",
      skills: [],
    },
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: "" },
  });

  const handleSelectSubmit = (data: SelectFormData) => {
    console.log("Select Form Data:", data);
    successToast("Form submitted successfully!");
  };

  const handleOtpSubmit = (data: OTPFormData) => {
    console.log("OTP Submitted:", data);
  };

  return (
    <section
     className="page-container-col"
     style={{maxWidth: "50rem", margin: "0 auto"}}
    >
      {/* Select Form Section */}
      <h4>Custom Select Inputs</h4>
      <form
        onSubmit={selectForm.handleSubmit(handleSelectSubmit)}
        className="form-wrapper-2"
      >
        <FormInput
          form={selectForm}
          id="country"
          variant="custom-select"
          label="Country"
          options={countryOptions}
          searchable
          placeholder="Select country..."
        />

        <FormInput
          form={selectForm}
          id="skills"
          variant="custom-select"
          label="Skills (Non searchable)"
          options={skillOptions}
          multiple
          searchable={false}
          placeholder="Select skills..."
        />

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button type="submit" variant="primary">
            Submit
          </Button>
          <Button
            type="button"
            variant="bordered"
            onClick={() => selectForm.reset()}
          >
            Reset
          </Button>
        </div>

        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            fontSize: "0.9rem",
          }}
        >
          <pre>{JSON.stringify(selectForm.watch(), null, 2)}</pre>
        </div>
      </form>

      {/* OTP Form Section */}
      <h4>OTP Input</h4>
      <form
        onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
        className="form-wrapper-2"
      >
        <FormInput
          form={otpForm}
          id="otp"
          variant="otp-inputs"
          allowedOtpLength={4}
          firstFocus
          label="Enter OTP"
        />

        <div style={{ display: "flex", gap: "1rem" }}>
          <Button type="submit" variant="primary">
            Submit
          </Button>
          <Button
            type="button"
            variant="bordered"
            onClick={() => otpForm.reset()}
          >
            Reset
          </Button>
        </div>

        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            fontSize: "0.9rem",
          }}
        >
          <pre>{JSON.stringify(otpForm.watch(), null, 2)}</pre>
        </div>
      </form>
    </section>
  );
};

export default TestFormComponents;
