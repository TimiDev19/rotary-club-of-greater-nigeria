"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
const links = [
  ["Home", "/"],
  ["About", "/#about"],
  ["Club officers", "/officers"],
  ["Projects", "/projects"],
  ["Bulletins", "/bulletins"],
  ["Past presidents", "/past-presidents"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <Link
        href="/"
        className="brand"
        aria-label="Rotary E-Club of Greater Nigeria home"
      >
        <img
          className="brand-logo"
          src="/club-logo.png"
          alt="Rotary E-Club of Greater Nigeria"
        />
      </Link>
      <button
        className="mobile-toggle"
        aria-label="Toggle navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? "nav open" : "nav"}>
        {links.map(([n, h]) => (
          <Link key={h} href={h} onClick={() => setOpen(false)}>
            {n}
          </Link>
        ))}
        <Link href="/clubhouse/login" className="nav-login">
          Member Clubhouse <ArrowUpRight size={15} />
        </Link>
      </nav>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link
          href="/"
          className="brand light"
          aria-label="Rotary E-Club of Greater Nigeria home"
        >
          <img
            className="brand-logo brand-logo-footer"
            src="/club-logo-footer.png"
            alt="Rotary E-Club of Greater Nigeria"
          />
        </Link>
        <p>People of action, united in service.</p>
      </div>
      <div className="footer-links">
        <Link href="/projects">Projects</Link>
        <Link href="/bulletins">Bulletins</Link>
        <Link href="/#about">About the club</Link>
        <Link href="/admin/login">Admin login</Link>
      </div>
      <small>
        © {new Date().getFullYear()} Rotary E-Club of Greater Nigeria
      </small>
    </footer>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
