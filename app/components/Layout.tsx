import Header from "./Header";
import Footer from "./Footer";
import LeftSidebar from "./LeftSidebar";
import { useLoaderData } from "@remix-run/react";

type Props = {
  children: JSX.Element;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div>
        <Header />
        <div className="max-w-site mx-auto relative">
          <LeftSidebar />
          <main className="pt-5 pb-10 mx-auto max-w-content px-5">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
