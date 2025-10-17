import { RegisterForm } from "@/components/modules/Authentication/RegisterForm";
import registerImage from "../assets/images/register_image.jpg";
import { Link } from "react-router";
import Logo from "@/assets/icons/trekOn.png";

export const Register = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 font-montserrat">
      <div className="relative hidden bg-muted lg:block">
        <img
          src={registerImage}
          alt="registerImage"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 mt-12">
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
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};
