import React, { useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BookContext } from "../context/books";
import { CartContext } from "../context/cart";

const BookDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const { books } = useContext(BookContext);
  const { addToCart } = useContext(CartContext);

  const book = books.find((book) => {
    return book.id === id;
  });

  if (!book) {
    return <h3 className="book-details-loading">Loading...</h3>;
  }

  const { image: url, title, description, author, price } = book;

  return (
    <section className="container book-details-container">
      <div className="row">
        <div className="col-sm-6 col-md-6 book-details-image-wrapper">
          <img className="img-fluid detail-image" src={url} alt={`${title}`} />
        </div>
        <div className="col-sm-6 col-md-6 book-details">
          <h1>{title}</h1>
          <p>{description}</p>
          <h3>{author}</h3>
          <h4>Price - $ {price}</h4>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              addToCart({ ...book, id });
              history.push("/cart");
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default BookDetails;
