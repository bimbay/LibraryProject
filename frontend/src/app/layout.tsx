"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/custom.css";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      setUserName(userData.name);
      setUserRole(userData.role);
    } else if (pathname !== "/login" && pathname !== "/register") {
      router.push("/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    router.push("/login");
  };

  if (pathname === "/login" || pathname === "/register") {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  const isAdminOrLibrarian = userRole === "ADMIN" || userRole === "LIBRARIAN";

  return (
    <html lang="en">
      <body>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              📚 Library Management
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a className="nav-link" href="/categories">
                    Categories
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/books">
                    Books
                  </a>
                </li>
                {isAdminOrLibrarian && (
                  <>
                    <li className="nav-item">
                      <a className="nav-link" href="/users">
                        Users
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/loans">
                        Loans
                      </a>
                    </li>
                  </>
                )}
              </ul>

              {isLoggedIn && (
                <div className="d-flex align-items-center gap-3">
                  <span className="text-white">
                    {userName}{" "}
                    <span className="badge bg-light text-primary">
                      {userRole}
                    </span>
                  </span>
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="container py-4">{children}</main>
      </body>
    </html>
  );
}
