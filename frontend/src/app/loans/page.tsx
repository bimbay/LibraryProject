"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loansApi, booksApi, usersApi } from "@/services/api";

interface Book {
  id: string;
  title: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

interface Loan {
  id: string;
  book: Book;
  librarian: User;
  member: User;
  loanAt: string;
  returnedAt: string | null;
  note: string | null;
}

export default function LoansPage() {
  const router = useRouter();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bookId: "",
    librarianId: "",
    memberId: "",
    loanAt: "",
    returnedAt: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check permission
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);

      // Redirect if not admin or librarian
      if (userData.role !== "ADMIN" && userData.role !== "LIBRARIAN") {
        alert("Access denied. This page is only for Admin and Librarian.");
        router.push("/");
        return;
      }
    }

    fetchLoans();
    fetchBooks();
    fetchUsers();
  }, [router]);

  const fetchLoans = async () => {
    try {
      const response = await loansApi.getAll();
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
      alert("Failed to fetch loans");
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await booksApi.getAll();
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersApi.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        bookId: Number(formData.bookId),
        librarianId: Number(formData.librarianId),
        memberId: Number(formData.memberId),
        loanAt: formData.loanAt,
        returnedAt: formData.returnedAt || undefined,
        note: formData.note || undefined,
      };

      if (editId) {
        await loansApi.update(Number(editId), payload);
        alert("Loan updated successfully!");
      } else {
        await loansApi.create(payload);
        alert("Loan created successfully!");
      }

      setShowModal(false);
      setFormData({
        bookId: "",
        librarianId: "",
        memberId: "",
        loanAt: "",
        returnedAt: "",
        note: "",
      });
      setEditId(null);
      await fetchLoans();
    } catch (error: any) {
      console.error("Error saving loan:", error);
      alert(error.response?.data?.message || "Failed to save loan");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (loan: Loan) => {
    setEditId(loan.id);
    setFormData({
      bookId: loan.book.id,
      librarianId: loan.librarian.id,
      memberId: loan.member.id,
      loanAt: loan.loanAt.split("T")[0],
      returnedAt: loan.returnedAt ? loan.returnedAt.split("T")[0] : "",
      note: loan.note || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this loan?")) return;

    try {
      await loansApi.delete(Number(id));
      alert("Loan deleted successfully!");
      await fetchLoans();
    } catch (error) {
      console.error("Error deleting loan:", error);
      alert("Failed to delete loan");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      bookId: "",
      librarianId: "",
      memberId: "",
      loanAt: "",
      returnedAt: "",
      note: "",
    });
    setEditId(null);
  };

  const filteredLoans = loans.filter(
    (loan) =>
      loan.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const librarians = users.filter(
    (u) => u.role === "LIBRARIAN" || u.role === "ADMIN"
  );
  const members = users.filter((u) => u.role === "MEMBER");

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Loans</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Loan
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search loans by book title or member name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {/* <th>ID</th> */}
                  <th>Book</th>
                  <th>Member</th>
                  <th>Librarian</th>
                  <th>Loan Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <tr key={loan.id}>
                    {/* <td>{loan.id}</td> */}
                    <td>{loan.book.title}</td>
                    <td>{loan.member.name}</td>
                    <td>{loan.librarian.name}</td>
                    <td>{new Date(loan.loanAt).toLocaleDateString()}</td>
                    <td>
                      {loan.returnedAt
                        ? new Date(loan.returnedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          loan.returnedAt ? "bg-success" : "bg-warning"
                        }`}
                      >
                        {loan.returnedAt ? "Returned" : "On Loan"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(loan)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(loan.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredLoans.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center">
                      No loans found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? "Edit" : "Add"} Loan</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Book</label>
                    <select
                      className="form-select"
                      value={formData.bookId}
                      onChange={(e) =>
                        setFormData({ ...formData, bookId: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Book</option>
                      {books.map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Librarian</label>
                    <select
                      className="form-select"
                      value={formData.librarianId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          librarianId: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Librarian</option>
                      {librarians.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Member</label>
                    <select
                      className="form-select"
                      value={formData.memberId}
                      onChange={(e) =>
                        setFormData({ ...formData, memberId: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Member</option>
                      {members.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Loan Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.loanAt}
                      onChange={(e) =>
                        setFormData({ ...formData, loanAt: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Return Date (Optional)</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.returnedAt}
                      onChange={(e) =>
                        setFormData({ ...formData, returnedAt: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Note (Optional)</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
