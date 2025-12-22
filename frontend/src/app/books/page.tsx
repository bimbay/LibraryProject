"use client";

import { useEffect, useState } from "react";
import { booksApi, categoriesApi } from "@/services/api";

interface Category {
  id: string;
  name: string;
}

interface BookCategory {
  category: Category;
}

interface Book {
  id: string;
  title: string;
  description: string;
  authors: string;
  isbn: string;
  bookCategories: BookCategory[];
  createdAt: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    authors: "",
    isbn: "",
    categoryIds: [] as number[],
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    fetchBooks();
    fetchCategories();

    // ngmbil user role
    const user = localStorage.getItem("user");
    if (user) {
      setUserRole(JSON.parse(user).role);
    }
  }, []);

  const canModify = userRole === "ADMIN" || userRole === "LIBRARIAN";

  const fetchBooks = async () => {
    try {
      const response = await booksApi.getAll();
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Failed to fetch books");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await booksApi.update(Number(editId), formData);
        alert("Book updated successfully!");
      } else {
        await booksApi.create(formData);
        alert("Book created successfully!");
      }

      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        authors: "",
        isbn: "",
        categoryIds: [],
      });
      setEditId(null);
      await fetchBooks();
    } catch (error: any) {
      console.error("Error saving book:", error);
      alert(error.response?.data?.message || "Failed to save book");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    setEditId(book.id);
    setFormData({
      title: book.title,
      description: book.description,
      authors: book.authors,
      isbn: book.isbn,
      categoryIds: book.bookCategories.map((bc) => Number(bc.category.id)),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await booksApi.delete(Number(id));
      alert("Book deleted successfully!");
      await fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      title: "",
      description: "",
      authors: "",
      isbn: "",
      categoryIds: [],
    });
    setEditId(null);
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Books</h1>
        {canModify && (
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add Book
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {/* <th>ID</th> */}
                  <th>Title</th>
                  <th>Authors</th>
                  <th>ISBN</th>
                  <th>Categories</th>
                  {canModify && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    {/* <td>{book.id}</td> */}
                    <td>{book.title}</td>
                    <td>{book.authors}</td>
                    <td>{book.isbn}</td>
                    <td>
                      {book.bookCategories
                        .map((bc) => bc.category.name)
                        .join(", ")}
                    </td>
                    {canModify && (
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(book)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(book.id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {filteredBooks.length === 0 && (
                  <tr>
                    <td colSpan={canModify ? 6 : 5} className="text-center">
                      No books found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && canModify && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? "Edit" : "Add"} Book</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Authors</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.authors}
                      onChange={(e) =>
                        setFormData({ ...formData, authors: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISBN</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.isbn}
                      onChange={(e) =>
                        setFormData({ ...formData, isbn: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Categories</label>
                    <div>
                      {categories.map((category) => (
                        <div key={category.id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={formData.categoryIds.includes(
                              Number(category.id)
                            )}
                            onChange={() =>
                              handleCategoryChange(Number(category.id))
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`category-${category.id}`}
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
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
