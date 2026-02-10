import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import api from "../services/api";

export default function Test() {
  const [book, setBook] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/books");
        setBook(res.data.booksData);
      } catch (error) {
        alert("Gagal Fetch");
      }
    };
    fetch();
  }, []);
  
  const handlePost = async () => {
    try {
      const res = await api.post("/users", {
        name: name,
        email: email,
        password: password,
      });
      alert(res.data.message);
    } catch (error) {
      alert("Gagal Post");
    }
  };

  return (
    <>
      <div>
        {book.map((book) => {
          return (
            <div className="" key={book.id}>
              <div className="">{book.title}</div>
              <div className="">{book.publisher}</div>
              <div className="">-</div>
            </div>
          );
        })}

        <form onSubmit={handlePost}>
          <input
            type="text"
            className="border-5"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="border-5"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="border-5"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" className="border-5" value="X" />
        </form>
      </div>
    </>
  );
}
