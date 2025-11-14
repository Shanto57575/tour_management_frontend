import { LoginForm } from "@/components/modules/Authentication/LoginForm";
import loginImage from "../assets/images/login_image.jpg";
import Logo from "@/assets/icons/trekOn.png";
import { Link } from "react-router";

export const Login = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 font-serif">
      <div className="flex flex-col gap-4 p-6 md:p-10 mt-20">
        <div className="flex justify-center gap-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 font-medium"
          >
            <img src={Logo} className="w-20 h-20" alt="" />
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xs md:max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={loginImage}
          alt="loginImage"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-75"
        />
      </div>
    </div>
  );
};
