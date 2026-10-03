"use client";

import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Year 1", href: "/years/year-1" },
  { label: "Past Papers", href: "/past-papers" },
  { label: "Tutorial Sheets", href: "/tutorials" },
  { label: "Contribute", href: "#contribute" },
];

const Navbar = () => {
  const [isOpen, SetIsOpen] = useState(false);

  const toggleMenu = () => SetIsOpen((prev) => !prev);
  const closeMenu = () => SetIsOpen(false);
  return (
    <div className="sticky top-4 z-50 w-full mb-6">
      <nav
        aria-label="Main Navigation"
        className="relative flex items-center justify-between rounded-full border-2 border-ink bg-surface/90 px-6 py-3.5 backdrop-blur-md shadow-chunky-sm transition-all"
      >
        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-2 focus:outline-none"
        >
          <p className="flex size-9 items-center justify-center px-6 py-3.5 rounded-md bg-butter border-2 border-ink text-sm font-black text-ink transition-transform group-hover:rotate-12">
            M&CS
          </p>
          <p className="text-lg md:text-xl font-extrabold tracking-tight text-ink">
            Maths <span className="text-coral">CS</span>
          </p>
        </Link>

        {/*  Navigation Links on Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-bold text-ink transition-colors hover:text-coral"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Start Learning button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/years/year-1"
            className="inline-flex items-center justify-center rounded-full border-2 border-ink bg-coral px-5 py-2 text-sm font-bold text-white shadow-chunky-sm transition-all hover:-translate-y-0.5 hover:bg-coral-hover active:translate-y-0.5 active:shadow-none"
          >
            Start Learning
          </Link>
        </div>

        {/* Mobile Hamburger / Close Button */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="flex md:hidden size-10 flex-col items-center justify-center gap-1.5 rounded-full border-2 border-ink bg-canvas transition-colors hover:bg-butter focus:outline-none"
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="h-0.5 w-5 bg-ink rounded-full"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="h-0.5 w-5 bg-ink rounded-full"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="h-0.5 w-5 bg-ink rounded-full"
          />
        </button>
      </nav>

      {/* Mobile Animated Dropdown  */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-3xl border-2 border-ink bg-surface p-6 shadow-chunky md:hidden z-50"
          >
            <div className="flex flex-col gap-4">
              <ul className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="block rounded-xl px-4 py-2.5 text-base font-bold text-ink transition-colors hover:bg-ice/50 hover:text-coral"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <hr className="border-t-2 border-ink/10 my-1" />

              <Link
                href="/years/year-1"
                onClick={closeMenu}
                className="w-full text-center rounded-full border-2 border-ink bg-coral py-3 text-sm font-bold text-white shadow-chunky-sm transition-transform active:translate-y-0.5 active:shadow-none"
              >
                Start Learning (Year 1)
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
