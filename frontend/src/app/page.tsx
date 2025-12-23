"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const canAccess =
    user && (user.role === "ADMIN" || user.role === "LIBRARIAN");

  return (
    <div className="text-center">
      <h1 className="display-5 fw-bold mb-2">Library Management System</h1>

      {user && (
        <>
          <p className="lead">
            Welcome back, <strong>{user.name}</strong>
          </p>
          <span className="badge bg-primary fs-6 mb-4">{user.role}</span>
        </>
      )}

      <div className="row mt-5 g-4 justify-content-center">
        {[
          {
            title: "Categories",
            desc: "Manage book categories",
            link: "/categories",
          },
          {
            title: "Books",
            desc: "Manage library books",
            link: "/books",
          },
          canAccess && {
            title: "Users",
            desc: "Manage system users",
            link: "/users",
          },
          canAccess && {
            title: "Loans",
            desc: "Manage book loans",
            link: "/loans",
          },
        ]
          .filter(Boolean)
          .map((item: any) => (
            <div key={item.title} className="col-md-3">
              <div className="card dashboard-card h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.desc}</p>
                  <a href={item.link} className="btn btn-primary w-100">
                    Open
                  </a>
                </div>
              </div>
            </div>
          ))}
      </div>

      {user?.role === "MEMBER" && (
        <div
          className="alert alert-info mt-5 mx-auto"
          style={{ maxWidth: 600 }}
        >
          Kamu bisa melihat dan mencari buku dan kategori buku yang kamu mau. Bilang ke Librarian jika kamu ingin meminjam buku
        </div>
      )}
    </div>
  );
}
