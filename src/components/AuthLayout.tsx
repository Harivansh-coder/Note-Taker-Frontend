import { Link } from "react-router-dom";
import logo from "../assets/top.svg";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  alternativeText: string;
  alternativeLink: string;
  alternativeLinkText: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  alternativeText,
  alternativeLink,
  alternativeLinkText,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <img src={logo} alt="Logo" className="h-12 w-12" />
            <span className="text-xl font-semibold">HD</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        </div>
        {children}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">{alternativeText}</span>{" "}
          <Link
            to={alternativeLink}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {alternativeLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
}
