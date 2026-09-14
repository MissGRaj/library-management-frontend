import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Borrowings() {

    const [borrowings, setBorrowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const getBorrowings = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "https://library-management-backend-production-2dc0.up.railway.app/borrowings/my",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch borrowings");
            }

            const data = await response.json();
            setBorrowings(data);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const returnBook = async (borrowingId) => {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `https://library-management-backend-production-2dc0.up.railway.app/borrowings/${borrowingId}/return`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        if (response.status === 403) {
            const data = await response.json();
            alert(data.message);
            return;
        }

        if (response.status === 409) {
            const data = await response.json();
            alert(data.message);
            return;
        }

        if (!response.ok) {
            alert("Failed to return book.");
            return;
        }

        alert("Book returned successfully.");

        getBorrowings();
    };

    useEffect(() => {
        getBorrowings();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="borrowings-container">

            <h2 className="borrowings-title">My Borrowings</h2>

            <button
                className="back-button"
                onClick={() => navigate("/books")}
            >
                ← Back to Books
            </button>

            {borrowings.length === 0 ? (
                <p className="no-borrowings">
                    You have no borrowing history.
                </p>
            ) : (
                <table className="borrowings-table">

                    <thead>
                        <tr>
                            <th>Book</th>
                            <th>Borrowed</th>
                            <th>Due</th>
                            <th>Returned</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {borrowings.map((borrowing) => (
                            <tr key={borrowing.id}>

                                <td>{borrowing.bookTitle}</td>

                                <td>{borrowing.borrowedAt}</td>

                                <td>{borrowing.dueDate}</td>

                                <td>
                                    {borrowing.returnedAt || "-"}
                                </td>

                                <td>
                                    {borrowing.overdue
                                        ? "OVERDUE"
                                        : borrowing.status}
                                </td>

                                <td>
                                    {borrowing.status === "BORROWED" && (
                                        <button
                                            className="return-button"
                                            onClick={() => returnBook(borrowing.id)}
                                        >
                                            Return
                                        </button>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            )}

        </div>
    );
}

export default Borrowings;