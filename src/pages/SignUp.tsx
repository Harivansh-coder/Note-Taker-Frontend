import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { authApi } from "../utils/api";

export function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      otp: Number(formData.get("otp")),
    };

    try {
      const response = await authApi.signup(data);
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      setError("Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setIsLoading(true);

    try {
      const otp = await authApi.getOtp({
        email: (document.getElementById("email") as HTMLInputElement).value,
      });

      alert(`OTP: use ${otp} to sign up valid for 5 minutes`);

      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign up"
      subtitle="Sign up to enjoy the feature of HD"
      alternativeText="Already have an account?"
      alternativeLink="/signin"
      alternativeLinkText="Sign in"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your Name"
            label="Name"
          />
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            label="Date of Birth"
          />
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            label="Email"
          />
          <Input
            id="otp"
            name="otp"
            type="text"
            required
            placeholder="OTP"
            label="OTP"
          />

          {/* resend otp */}
          {otpSent ? (
            <span
              className="text-sm text-blue-600 cursor-pointer"
              onClick={handleResendOtp}
            >
              Resend OTP
            </span>
          ) : (
            <></>
          )}
        </div>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        {otpSent ? (
          <Button type="submit" isLoading={isLoading}>
            Sign up
          </Button>
        ) : (
          <Button type="button" onClick={handleResendOtp} isLoading={isLoading}>
            Send OTP
          </Button>
        )}
      </form>
    </AuthLayout>
  );
}
