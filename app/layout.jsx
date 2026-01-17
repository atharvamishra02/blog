// Removed unused font imports
import "./globals.css";
import "./fonts.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import StoreProvider from "@/lib/redux/StoreProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Removed unused font variables

export const metadata = {
  title: "My Blog Website - Web Development Insights",
  description:
    "Discover the latest insights in web development, programming tips, and technology trends. A modern blog built with Next.js featuring HTML, CSS, and JavaScript content.",
  keywords:
    "web development, programming, HTML, CSS, JavaScript, blog, technology",
  author: "Blog Author",
};

export default function RootLayout({ children }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-main antialiased pt-16`}>
        {/* Blogger Baba Icon Top Right */}
        <div className="fixed top-2 left-4 z-50 flex items-center gap-2 select-none">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-tr from-yellow-400 via-pink-400 to-purple-500 shadow-lg border-2 border-white">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="14"
                cy="14"
                r="13"
                fill="#fff"
                stroke="#e2e2e2"
                strokeWidth="2"
              />
              <ellipse cx="14" cy="17" rx="6" ry="4" fill="#fbbf24" />
              <circle cx="14" cy="12" r="5" fill="#f472b6" />
              <circle cx="12.5" cy="12.5" r="1" fill="#fff" />
              <circle cx="15.5" cy="12.5" r="1" fill="#fff" />
              <path
                d="M12 15c1 1 3 1 4 0"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="font-bold text-lg drop-shadow-lg bg-black/60 px-3 py-1 rounded-full font-main">
            {[
              { l: "B", c: "text-red-400" },
              { l: "l", c: "text-orange-400" },
              { l: "o", c: "text-yellow-400" },
              { l: "g", c: "text-green-400" },
              { l: "g", c: "text-blue-400" },
              { l: "e", c: "text-indigo-400" },
              { l: "r", c: "text-purple-400" },
              { l: " ", c: "" },
              { l: "B", c: "text-pink-400" },
              { l: "a", c: "text-teal-400" },
              { l: "b", c: "text-lime-400" },
              { l: "a", c: "text-amber-400" },
            ].map((ch, i) => (
              <span key={i} className={ch.c}>
                {ch.l}
              </span>
            ))}
          </span>
        </div>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <StoreProvider>
              <AuthProvider>
                <Navbar />
                <main id="site-root" className="min-h-screen w-full font-main">
                  {children}
                </main>
              </AuthProvider>
            </StoreProvider>
          </GoogleOAuthProvider>
        ) : (
          <StoreProvider>
            <AuthProvider>
              <Navbar />
              <main id="site-root" className="min-h-screen w-full font-main">
                {children}
              </main>
            </AuthProvider>
          </StoreProvider>
        )}
      </body>
    </html>
  );
}
