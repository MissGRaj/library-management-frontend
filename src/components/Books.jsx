import { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";

function Books() {
    
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [searchTitle, setSearchTitle] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [searchVersion, setSearchVersion] = useState(0);

    const navigate = useNavigate();

    const getBooks = async () => {

        try {
            
            const token = localStorage.getItem("token");

            const params = new URLSearchParams({
                page: page,
                size: size,
                sortBy: "id",
                direction: "asc"
            });

            if (searchTitle.trim() !== "") {
                params.append("title", searchTitle);
            }

            if (searchAuthor.trim() !== "") {
                params.append("author", searchAuthor);
            }
            
            const response = await fetch(
                `https://libary-management-backend-production.up.railway.app/books/search?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if(!response.ok) {
                throw new Error("Failed to fetch books");
            }
        
            const data = await response.json();
            setBooks(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

    };


    const validateBook = () => {

        if (title.trim() === "" && author.trim() === "") {
            alert("Please enter title and author.");
            return false;
        }

        if (title.trim() === "") {
            alert("Please enter the title.");
            return false;
        }

        if (author.trim() === "") {
            alert("Please enter the author.");
            return false;
        }

        if (title.trim().length < 2) {
            alert("Title must be at least 2 characters.");
            return false;
        }

        if (author.trim().length < 2) {
            alert("Author must be at least 2 characters.");
            return false;
        }

        if (title.trim().length > 100) {
            alert("Title must not exceed 100 characters.");
            return false;
        }

        if (author.trim().length > 50) {
            alert("Author must not exceed 50 characters.");
            return false;
        }

        return true;
    };

    const addBook = async (e) => {
        e.preventDefault();

        if (!validateBook()) {
            return;
        }

        const token = localStorage.getItem("token");
        const response = await fetch("https://libary-management-backend-production.up.railway.app/books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
                title:title, 
                author:author
            })
        });

        if(response.status === 403) {
            alert("You are not authorized to add books");
            return;
        }

        if(response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to add book");
        }

        setTitle("");
        setAuthor("");
        getBooks();
    };

    const deleteBook = async (id) => {

        const token = localStorage.getItem("token");

        const response = await fetch(`https://libary-management-backend-production.up.railway.app/books/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 403) {
            alert("You are not authorized to delete books.");
            return;
        }

        if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        if (books.length === 1 && page > 0) {
            setPage(page - 1);
        } else {
            getBooks();
        }
    };

    const editBook = (book) => {
        setEditingId(book.id);
        setTitle(book.title);
        setAuthor(book.author);
    };

    const updateBook = async (e) => {
        e.preventDefault();

        if (!validateBook()) {
            return;
        }

        const token = localStorage.getItem("token");

        const response = await fetch(
            `https://libary-management-backend-production.up.railway.app/books/${editingId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title,
                    author: author
                })
            }
        );

        if (response.status === 403) {
            alert("You are not authorized to update books.");
            return;
        }

        if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        setEditingId(null);
        setTitle("");
        setAuthor("");

        getBooks();
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const clearSearch = () => {
        setSearchTitle("");
        setSearchAuthor("");
        setPage(0);
        setSearchVersion(searchVersion + 1);
    };


    useEffect(() => {
        getBooks();
    }, [page, searchVersion]);

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div className="books-container">
            <h2 className="books-title">Books</h2>

            <button className="logout-button" onClick={logout}>Logout</button>

            <form className="search-form" onSubmit={(e) => {
                e.preventDefault();
                setPage(0);
                getBooks();
            }}>
                <div className="form-group">
                    <label>Search Title</label>
                    <input
                        className="form-input"
                        type="text"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Search Author</label>
                    <input
                        className="form-input"
                        type="text"
                        value={searchAuthor}
                        onChange={(e) => setSearchAuthor(e.target.value)}
                    />
                </div>

                <button className="search-button" type="submit">Search</button>
                <button
                    className="cancel-button"
                    type="button"
                    onClick={clearSearch}
                >
                    Clear
                </button>
            </form>


            <form className="book-form" onSubmit={editingId === null ? addBook : updateBook}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        className="form-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Author</label>
                    <input
                        className="form-input"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </div>

                <button className="submit-button" type="submit">
                    {editingId === null ? "Add Book" : "Update Book"}
                </button>

                {editingId !== null && (
                    <button className="cancel-button" type="button" onClick={() => {
                        setEditingId(null);
                        setTitle("");
                        setAuthor("");
                    }}>
                        Cancel
                    </button>
                )}

            </form>

            <table className="books-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map((book) => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>
                                <button className="edit-button" onClick={() => editBook(book)}>
                                    Edit
                                </button>

                                <button className="delete-button" onClick={() => deleteBook(book.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    className="pagination-button"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                >
                    Previous
                </button>

                <span className="page-info">
                    Page {page + 1} of {totalPages}
                </span>

                <button
                    className="pagination-button"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages - 1}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Books;