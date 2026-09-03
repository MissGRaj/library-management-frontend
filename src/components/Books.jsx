import { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";

function Books() {
    
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    const [editingId, setEditingId] = useState(null);

    const navigate = useNavigate();

    const getBooks = async () => {

        try {
            
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/books", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch books");
            }
        
            const data = await response.json();
            setBooks(data);
        
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

    };

    const addBook = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/books", {
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

        if (!response.ok) {
            throw new Error("Failed to add book");
            return;
        }

        setTitle("");
        setAuthor("");
        getBooks();
    };

    const deleteBook = async (id) => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8080/books/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.log("Failed to delete book");
            return;
        }

        getBooks();
    };

    const editBook = (book) => {
        setEditingId(book.id);
        setTitle(book.title);
        setAuthor(book.author);
    };

    const updateBook = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:8080/books/${editingId}`,
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

        if (!response.ok) {
            console.log("Failed to update book");
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


    useEffect(() => {
        getBooks();
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div>
            <h2>Books</h2>

            <button onClick={logout}>Logout</button>
            <form onSubmit={editingId === null ? addBook : updateBook}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label>Author</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </div>

                <button type="submit">
                    {editingId === null ? "Add Book" : "Update Book"}
                </button>
            </form>

            <table>
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
                                <button onClick={() => editBook(book)}>
                                    Edit
                                </button>

                                <button onClick={() => deleteBook(book.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Books;