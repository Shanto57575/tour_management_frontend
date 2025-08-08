import Logo from "@/assets/icons/trekOn.png";
import { Link } from "react-router";
import { Facebook, Instagram, Twitter, Github, Dribbble } from "lucide-react";

export const Footer = () => {
  return (
    <footer>
      <div className="mx-auto container space-y-8 px-4 py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Logo & About */}
          <div>
            <div className="text-foreground">
              <Link to="/">
                <img src={Logo} className="w-16 h-16" alt="logo" />
              </Link>
            </div>

            <p className="mt-4 max-w-xs text-muted-foreground/80">
              TrekOn helps you explore the world with ease — manage, book, and
              track every journey from start to summit.
            </p>

            {/* Social Icons */}
            <ul className="mt-8 flex gap-6">
              <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-400 transition hover:opacity-75"
                >
                  <span className="sr-only">Facebook</span>
                  <Facebook className="w-5 h-5" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-400 transition hover:opacity-75"
                >
                  <span className="sr-only">Instagram</span>
                  <Instagram className="w-5 h-5" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-400 transition hover:opacity-75"
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="w-5 h-5" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-400 transition hover:opacity-75"
                >
                  <span className="sr-only">GitHub</span>
                  <Github className="w-5 h-5" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-400 transition hover:opacity-75"
                >
                  <span className="sr-only">Dribbble</span>
                  <Dribbble className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            <div>
              <p className="font-medium">Trek Services</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    Custom Tour Planning{" "}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    Local Guide Matching{" "}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    Group Travel Management{" "}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    Solo Trip Support{" "}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    Real-Time Tracking{" "}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium">Company</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    About TrekOn{" "}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    Our Team{" "}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    Partner with Us{" "}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium">Resources</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    Support Center{" "}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    Blog{" "}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    Travel Safety Tips{" "}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium">Legal</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    Terms of Service{" "}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    Privacy Policy{" "}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    Cancellation Policy{" "}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition hover:opacity-75"
                  >
                    {" "}
                    License Info{" "}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()}. TrekOn. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
