"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const items = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/About", label: "About", icon: AboutIcon },
    { href: "/Contact", label: "Contact", icon: ContactIcon },
    { href: "/write", label: "Write", icon: PenIcon },
  ];

  // Determine if we're on login or register page
  const isLoginPage = pathname === "/login";

  return (
    <>
      {/* Desktop Navbar with Hamburger */}
      <nav className="fixed top-4 right-4 z-40 hidden md:flex gap-4">
        {/* Hamburger Button */}
        <button
          onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
          className="w-16 h-16 bg-black/60 backdrop-blur-md rounded-full shadow-lg border border-white/10 flex items-center justify-center hover:bg-black/70 transition-all"
          aria-label="Menu"
        >
          <motion.div
            animate={desktopMenuOpen ? "open" : "closed"}
            className="flex flex-col gap-1.5"
          >
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 8 }
              }}
              className="w-6 h-0.5 bg-white rounded-full"
            />
            <motion.span
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 }
              }}
              className="w-6 h-0.5 bg-white rounded-full"
            />
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -8 }
              }}
              className="w-6 h-0.5 bg-white rounded-full"
            />
          </motion.div>
        </button>

        {/* Desktop Menu Panel - Slides in from right */}
        <AnimatePresence>
          {desktopMenuOpen && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-[450px] bg-black/60 backdrop-blur-md rounded-3xl shadow-lg border border-white/10 p-6"
            >
              <div className="flex flex-col gap-4">
                {/* Navigation Items */}
                {items.map((it) => (
                  it.label === "Write" ? (
                    <div key={it.label}>
                      <div className="flex items-center gap-3 text-white/90 hover:text-white p-3 rounded-xl transition-colors">
                        <it.icon />
                        <span className="font-medium">{it.label}</span>
                      </div>
                      {/* Category Submenu */}
                      <div className="ml-12 mt-2 grid grid-cols-2 gap-2">
                        {[
                          "Tech", "Fashion", "Designing", "Medical", "Law",
                          "Sports", "Education", "Food", "Travel", "Finance"
                        ].map((field) => (
                          <Link
                            key={field}
                            href={`/${field.toLowerCase()}`}
                            className="text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm transition-all"
                            onClick={() => setDesktopMenuOpen(false)}
                          >
                            {field}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={it.label}
                      href={it.href}
                      className="flex items-center gap-3 text-white/90 hover:text-white p-3 rounded-xl hover:bg-white/10 transition-all"
                      onClick={() => setDesktopMenuOpen(false)}
                    >
                      <it.icon />
                      <span className="font-medium">{it.label}</span>
                    </Link>
                  )
                ))}

                {/* Divider */}
                <div className="border-t border-white/20 my-2"></div>

                {/* Profile/Auth */}
                {user ? (
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 text-white p-3 rounded-xl bg-linear-to-r from-green-600/20 to-teal-600/20 hover:from-green-600/30 hover:to-teal-600/30 transition-all"
                    onClick={() => setDesktopMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-600 to-teal-600 flex items-center justify-center text-white font-bold">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.name || "User"}</div>
                      <div className="text-xs text-white/60">{user.email}</div>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href={isLoginPage ? "/register" : "/login"}
                    className="flex items-center gap-3 text-white p-3 rounded-xl bg-linear-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 transition-all"
                    onClick={() => setDesktopMenuOpen(false)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">{isLoginPage ? "Sign Up" : "Login"}</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Original Desktop Navbar (Hidden - keeping for reference) */}
      <nav className="fixed top-4 right-4 z-40 w-[450px] h-16 hidden items-center justify-center bg-black/60 backdrop-blur-md rounded-full shadow-lg border border-white/10">
        <div className="flex items-center justify-center w-full h-full px-4 py-2 space-x-2">
        {items.map((it) => (
          it.label === "Write" ? (
            <div key={it.label} className="relative group">
              <Link
                href={it.href}
                aria-label={it.label}
                className="text-white/90 hover:text-white p-3 rounded-full transition-colors"
              >
                <it.icon />
              </Link>
              {/* Dropdown menu on hover for pen icon */}
              <div className="absolute right-0 top-14 min-w-[180px] bg-black/90 rounded-xl shadow-lg py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
                {[
                  "Tech",
                  "Fashion",
                  "Designing",
                  "Medical",
                  "Law",
                  "Sports",
                  "Education",
                  "Food",
                  "Travel",
                  "Finance"
                ].map((field) => (
                  <a
                    key={field}
                    href={`/${field.toLowerCase()}`}
                    className="block px-4 py-2 text-white hover:bg-gray-800 text-sm rounded-lg"
                  >
                    {field}
                  </a>
                ))}
              </div>
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-10 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                  {it.label}
                </div>
              </div>
            </div>
          ) : (
            <div key={it.label} className="relative group">
              <Link
                href={it.href}
                aria-label={it.label}
                className="text-white/90 hover:text-white p-3 rounded-full transition-colors"
              >
                <it.icon />
              </Link>
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-10 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                  {it.label}
                </div>
              </div>
            </div>
          )
        ))}

        {/* Auth/Profile Button */}
        {user ? (
          // Show circular avatar with first letter when logged in
          <Link
            href="/profile"
            className="relative group"
          >
            <motion.div
              className="w-12 h-12 rounded-full bg-linear-to-br from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ 
                boxShadow: [
                  "0 10px 30px rgba(16, 185, 129, 0.3)",
                  "0 10px 40px rgba(20, 184, 166, 0.5)",
                  "0 10px 30px rgba(16, 185, 129, 0.3)"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {(user.name || user.email).charAt(0).toUpperCase()}
            </motion.div>
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-10 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200">
              <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                {user.name || user.email}
              </div>
            </div>
          </Link>
        ) : (
          // Show Login/Sign Up button when not logged in
          <Link
            href={isLoginPage ? "/register" : "/login"}
            className="relative group"
          >
            <motion.div
              className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ 
                  x: [0, 3, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {isLoginPage ? <SignupIcon /> : <LoginIcon />}
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={isLoginPage ? "signup" : "login"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {isLoginPage ? "Sign Up" : "Login"}
                </motion.span>
              </AnimatePresence>
            </motion.div>
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-10 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200">
              <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                {isLoginPage ? "Create account" : "Sign in to your account"}
              </div>
            </div>
          </Link>
        )}
      </div>
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 right-4 z-50 md:hidden bg-black/60 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/10"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? "rotate-45 translate-y-1.5" : "mb-1"
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? "opacity-0" : "mb-1"
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </div>
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden bg-black/95 backdrop-blur-lg"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8 px-6">
              {/* Mobile Menu Items */}
              {items.map((it) => (
                it.label === "Write" ? (
                  <div key={it.label} className="w-full">
                    <div className="text-white text-2xl font-semibold mb-4 text-center">
                      {it.label}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Tech",
                        "Fashion",
                        "Designing",
                        "Medical",
                        "Law",
                        "Sports",
                        "Education",
                        "Food",
                        "Travel",
                        "Finance"
                      ].map((field) => (
                        <Link
                          key={field}
                          href={`/${field.toLowerCase()}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-center rounded-lg transition-colors"
                        >
                          {field}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={it.label}
                    href={it.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 text-white text-2xl font-semibold hover:text-blue-400 transition-colors"
                  >
                    <it.icon />
                    <span>{it.label}</span>
                  </Link>
                )
              ))}

              {/* Mobile Search */}
              <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Mobile Auth/Profile Button */}
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-4"
                >
                  <motion.div
                    className="w-24 h-24 rounded-full bg-linear-to-br from-green-600 to-teal-600 flex items-center justify-center text-white font-bold text-4xl shadow-2xl"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </motion.div>
                  <span className="text-white text-xl font-semibold">{user.name || user.email}</span>
                  <span className="text-white/70 text-sm">Tap to view profile</span>
                </Link>
              ) : (
                <Link
                  href={isLoginPage ? "/register" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full max-w-md"
                >
                  <motion.div
                    className="flex items-center justify-center gap-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-xl transition-all shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoginPage ? <SignupIcon /> : <LoginIcon />}
                    <span>{isLoginPage ? "Sign Up" : "Login"}</span>
                  </motion.div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PenIcon() {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 3.487a2.25 2.25 0 013.182 3.182l-10.5 10.5a2.25 2.25 0 01-.948.563l-3.75 1.125a.375.375 0 01-.47-.47l1.125-3.75a2.25 2.25 0 01.563-.948l10.5-10.5z" />
      </svg>
    </span>
  );
}

function IconBase({ children }) {
  return <span className="w-6 h-6 inline-flex items-center justify-center">{children}</span>;
}

function HomeIcon() {
  return (
    <IconBase>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3 9.75L12 3l9 6.75V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.75z" />
      </svg>
    </IconBase>
  );
}

function AboutIcon() {
  return (
    <IconBase>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    </IconBase>
  );
}

function ContactIcon() {
  return (
    <IconBase>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16l-6-3-6 3-6-3V4z" />
      </svg>
    </IconBase>
  );
}

function LoginIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
    </svg>
  );
}

function SignupIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  );
}
