import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import { BookContext } from '../context/books';

const Books = () => {
  const { books } = useContext(BookContext);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!books.length) {
    return <h3 className="books-loading">No Books Available</h3>
  }

  return (
    <>
      <section className="books">
        {books.map(({ image, id, title }) => (
          <article key={id} className="book">
            <div className="card" style={{ width: "18rem" }}>
              <img src={image} className="card-img-top" alt={title}></img>
              <div className="card-body">
                <Link to={`books/${id}`} className="book-detail">details</Link>
              </div>
            </div>
          </article>
        ))}
      </section>
      <section id="top">
        <button onClick={() => scrollTop()} style={{ borderRadius: "1rem", margin: "2rem" }} className="btn pmd-btn-fab pmd-ripple-effect btn-outline-primary" type="button">top</button>
      </section>
    </>
  )
}

export default Books
