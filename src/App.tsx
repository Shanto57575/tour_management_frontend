import { Outlet } from "react-router";
import { CommonLayout } from "./components/layouts/CommonLayout";

export const App = () => {
  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
};
