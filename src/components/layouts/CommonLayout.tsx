import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface IPros {
  children: ReactNode;
}

export const CommonLayout = ({ children }: IPros) => {
  return (
    <div className="container mx-auto min-h-screen flex flex-col font-ds">
      <Navbar />
      <div className="grow-1">{children}</div>
      <Footer />
    </div>
  );
};
