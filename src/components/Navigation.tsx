"use client";

import { Menu } from "@mui/icons-material";
import Link from "next/link";
import { useCallback, useState } from "react";

type NavItemBaseProps = {
  href: string;
  children: React.ReactNode;
};

type NavItemProps = NavItemBaseProps & {
  bold?: boolean;
};

type MobileNavItemProps = NavItemBaseProps & {
  closeNavBar: () => void;
};

const MobileNavItem = ({ href, children, closeNavBar }: MobileNavItemProps) => (
  <li className="w-full">
    <Link className="block text-center" href={href} onNavigate={closeNavBar}>
      {children}
    </Link>
  </li>
);

const NavItem = ({ href, children, bold }: NavItemProps) => (
  <Link
    href={href}
    className={`text-lg text-center ${bold ? "font-bold" : ""}`}
  >
    {children}
  </Link>
);

type NavSideProps = {
  className: string;
  children: React.ReactNode;
};

const NavSide = ({ className, children }: NavSideProps) => (
  <div className={"gap-16 " + className}>{children}</div>
);

export const Navbar = () => {
  // for mobile navigation
  const [isOpen, setIsOpen] = useState(false);
  const closeNavBar = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* desktop navigation */}
      <nav
        id="large-nav"
        className="hidden md:grid grid-cols-5 lg:grid-cols-9 grid-flow-col gap-16"
      >
        <NavSide className="col-span-2 lg:col-span-4 flex justify-end">
          <NavItem href="/peek">Peek</NavItem>
        </NavSide>
        <NavItem href="/" bold>
          Trails
        </NavItem>
        <NavSide className="col-span-2 lg:col-span-4 flex justify-start">
          <NavItem href="/info">Info</NavItem>
          <NavItem href="/saved">My Trails</NavItem>
        </NavSide>
      </nav>

      {/* mobile navigation */}
      <nav id="small-nav" className="md:hidden justify-between">
        <NavItem href="/" bold>
          Trails
        </NavItem>
        <button
          className="icon-button text-default"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Menu />
        </button>

        <ul
          className={`absolute top-16 left-0 card w-full flex flex-col items-center justify-center gap-4 mt-4 transform transition-all duration-300 ease-in-out ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
        >
          <MobileNavItem href="/saved" closeNavBar={closeNavBar}>
            My Trails
          </MobileNavItem>
          <MobileNavItem href="/info" closeNavBar={closeNavBar}>
            Trail Info
          </MobileNavItem>
          <MobileNavItem href="/peek" closeNavBar={closeNavBar}>
            Peek Trail
          </MobileNavItem>
        </ul>
      </nav>
    </>
  );
};
