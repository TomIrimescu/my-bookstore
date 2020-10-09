import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";

import { BookContext } from "../context/books";

const Home = () => {
  const { featured } = useContext(BookContext);
  if (!featured.length) {
    return (
      <>
        <Hero />
        <section className="featured">
          <header className="featured-head">
            <h3>Featured Collection</h3>
          </header>
          <div className="books featured-list-none">
            <h3>No Featured Books</h3>
          </div>
        </section>
      </>
    )
  } else {
    return (
      <>
        <Hero />
        <section className="featured">
          <header className="featured-head">
            <h3>Featured Collection</h3>
          </header>
          <div className="books featured-list">
            {featured.map(({ id, image, title }) => (
              <article key={id} className="book featured-book">
                <div className="card" style={{ width: "18rem" }}>
                  <img src={image} className="card-img-top" alt={title}></img>
                  <div className="card-body">
                    <Link to={`books/${id}`} className="book-detail">details</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </>
    )
  }
}

export default Home;