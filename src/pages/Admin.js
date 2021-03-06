import React, { useEffect, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { API, graphqlOperation, Storage } from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { createBook, updateBook, deleteBook } from '../api/mutations';
import { listBooks } from '../api/queries';
import config from '../aws-exports';
import { BookContext } from "../context/books";

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config

const Admin = () => {
  const [books, setBooks] = useState([]);
  const [displayAdd, setDisplayAdd] = useState(true);
  const [displayUpdate, setDisplayUpdate] = useState(false);
  const [image, setImage] = useState(null);
  const [bookDetails, setBookDetails] = useState({ title: "", description: "", image: "", author: "", price: "", featured: "" });
  const { fetchBooks } = useContext(BookContext);

  useEffect(() => {
    getBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBooks = async () => {
    try {
      const { data } = await API.graphql({ query: listBooks });
      const books = data.listBooks.items;
      setBooks(books);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!bookDetails.title || !bookDetails.price) return
      await API.graphql(graphqlOperation(createBook, { input: bookDetails }))
      getBooks();
      setBookDetails({ title: "", description: "", author: "", price: "" })
      setImage(null);
      fetchBooks();
    } catch (err) {
      console.log('error creating book:', err)
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!bookDetails.title || !bookDetails.price) return
      await API.graphql(graphqlOperation(updateBook, { input: bookDetails }));
      getBooks();
      setBookDetails({ title: "", description: "", author: "", price: "" })
      setImage(null);
      setDisplayAdd(true);
      setDisplayUpdate(false);
      fetchBooks();
    } catch (err) {
      console.log('error updating book:', err)
    }
  }

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectBook = (book) => {
    console.log(book);
    setBookDetails({ id: book.id, title: book.title, description: book.description, author: book.author, price: book.price, featured: book.featured })
    setDisplayAdd(false);
    setDisplayUpdate(true);
    scrollTop();
  }

  const removeBook = async () => {
    console.log(bookDetails);
    const bookId = { "id": bookDetails.id }
    if (bookId) {
      try {
        await API.graphql(graphqlOperation(deleteBook, { input: bookId }))
        setBookDetails({ title: "", description: "", author: "", price: "" })
        setImage(null);
        setDisplayAdd(true);
        setDisplayUpdate(false);
        getBooks();
        fetchBooks();
        returnToAddNewBook();
      } catch (err) {
        console.log('error deleting book:', err)
      }
    } else {
      setBookDetails({ title: "", description: "", author: "", price: "" })
      setImage(null);
      setDisplayAdd(true);
      setDisplayUpdate(false);
      return
    }

  }

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const extension = file.name.split(".")[1];
    const name = file.name.split(".")[0];
    const key = `images/${uuidv4()}${name}.${extension}`;
    const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`
    try {
      // Upload the file to s3 with private access level. 
      await Storage.put(key, file, {
        level: 'public',
        contentType: file.type
      });
      // Retrieve the uploaded file to display
      const image = await Storage.get(key, { level: 'public' })
      setImage(image);
      setBookDetails({ ...bookDetails, image: url });
    } catch (err) {
      console.log(err);
    }
  }

  const returnToAddNewBook = () => {
    setDisplayAdd(true)
    setBookDetails({ title: "", description: "", author: "", price: "" })
    setImage(null);
    setDisplayAdd(true);
    setDisplayUpdate(false);
  }

  return (
    <>
      <div className="modal fade" id="deletBookModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Delete Book</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div style={{ fontSize: "16px", textAlign: "center" }} className="modal-body">
              Are you sure you want to delete...?<br /><br /><span style={{ fontWeight: "bold" }}>"{bookDetails.title}"</span>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => returnToAddNewBook()}>Cancel</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={removeBook.bind(bookDetails.id)}>OK</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <AmplifyAuthenticator>
          <AmplifySignOut></AmplifySignOut>
          {displayAdd ?
            <section className="admin-wrapper">
              <header className="form-header">
                <h3>Add New Book</h3>
              </header>
              <form className="form-wrapper" onSubmit={handleCreateSubmit}>
                <div className="form-image">
                  {image ? <img className="image-preview" src={image} alt="" /> :
                    <input
                      type="file"
                      accept="image/jpg"
                      onChange={(e) => handleImageUpload(e)} />}
                </div>
                <div className="form-fields">
                  <div className="title-form">
                    <p><label htmlFor="title">Title</label></p>
                    <p><input
                      name="email"
                      type="title"
                      value={bookDetails.title}
                      placeholder="Type the title"
                      onChange={(e) => setBookDetails({ ...bookDetails, title: e.target.value })}
                      required
                    /></p>
                  </div>
                  <div className="description-form">
                    <p><label htmlFor="description">Description</label></p>
                    <p><textarea
                      name="description"
                      type="text"
                      value={bookDetails.description}
                      rows="8"
                      placeholder="Type the description of the book"
                      onChange={(e) => setBookDetails({ ...bookDetails, description: e.target.value })}
                      required
                    /></p>
                  </div>
                  <div className="author-form">
                    <p><label htmlFor="author">Author</label></p>
                    <p><input
                      name="author"
                      type="text"
                      value={bookDetails.author}
                      placeholder="Type the author's name"
                      onChange={(e) => setBookDetails({ ...bookDetails, author: e.target.value })}
                      required
                    /></p>
                  </div>
                  <div className="price-form">
                    <p><label htmlFor="price">Price ($)</label>
                      <input
                        name="price"
                        type="text"
                        value={bookDetails.price}
                        placeholder="What is the Price of the book (USD)"
                        onChange={(e) => setBookDetails({ ...bookDetails, price: e.target.value })}
                        required
                      /></p>
                  </div>
                  <div className="featured-form">
                    <p><label>Featured?</label>
                      <input type="checkbox"
                        className="featured-checkbox"
                        checked={bookDetails.featured ? true : false}
                        onChange={(e) => setBookDetails({ ...bookDetails, featured: !bookDetails.featured })}
                      />
                    </p>
                  </div>
                  <div className="submit-form">
                    <button className="btn btn-primary btn-lg" type="submit">Submit</button>
                  </div>
                </div>
              </form>
            </section>
            : null}
          {displayUpdate ?
            <section className="admin-wrapper">
              <header className="form-header">
                <button className="btn btn-primary btn-lg" onClick={() => returnToAddNewBook()}>Add New Book</button>
              </header>
              <form className="form-wrapper" onSubmit={handleUpdateSubmit}>
                <h3>Update Book</h3>
                <div className="form-image">
                  {image ? <img className="image-preview" src={image} alt="" /> : <input
                    type="file"
                    accept="image/jpg"
                    onChange={(e) => handleImageUpload(e)} />}
                </div>
                <div className="form-fields">
                  <div className="title-form">
                    <p><label htmlFor="title">Title</label></p>
                    <p><input
                      name="email"
                      type="title"
                      value={bookDetails.title}
                      placeholder="Type the title"
                      onChange={(e) => setBookDetails({ ...bookDetails, title: e.target.value })}
                      required
                    /></p>
                  </div>
                  <div className="description-form">
                    <p><label htmlFor="description">Description</label></p>
                    <p><textarea
                      name="description"
                      type="text"
                      value={bookDetails.description}
                      rows="8"
                      placeholder="Type the description of the book"
                      onChange={(e) => setBookDetails({ ...bookDetails, description: e.target.value })}
                      required
                    /></p>
                  </div>
                  <div className="author-form">
                    <p><label htmlFor="author">Author</label></p>
                    <p><input
                      name="author"
                      type="text"
                      value={bookDetails.author}
                      placeholder="Type the author's name"
                      onChange={(e) => setBookDetails({ ...bookDetails, author: e.target.value })}
                      required
                    /></p>
                  </div>
                  <div className="price-form">
                    <p><label htmlFor="price">Price ($)</label>
                      <input
                        name="price"
                        type="text"
                        value={bookDetails.price}
                        placeholder="What is the Price of the book (USD)"
                        onChange={(e) => setBookDetails({ ...bookDetails, price: e.target.value })}
                        required
                      /></p>
                  </div>
                  <div className="featured-form">
                    <p><label>Featured?</label>
                      <input type="checkbox"
                        className="featured-checkbox"
                        checked={bookDetails.featured ? true : false}
                        onChange={(e) => setBookDetails({ ...bookDetails, featured: !bookDetails.featured })}
                      />
                    </p>
                  </div>
                  <div className="submit-form">
                    <button className="btn btn-primary btn-lg" type="submit">Submit</button>
                  </div>
                </div>
              </form>
            </section>
            : null}
          <section className="books">
            {books.map(({ image, id, title }, i) => (
              <article key={id} className="book">
                <button onClick={selectBook.bind(this, books[i])} className="btn-admin book-link update">update</button>
                <div className="card" style={{ width: "19rem" }}>
                  <img src={image} className="card-img-top" alt={title}></img>
                </div>
                <button onClick={selectBook.bind(this, books[i])} type="button" className="btn-admin book-link delete" data-toggle="modal" data-target="#deletBookModal">delete</button>
              </article>
            ))}
          </section>
          <section id="top">
            <button onClick={() => scrollTop()} style={{ borderRadius: "1rem", margin: "2rem" }} className="btn pmd-btn-fab pmd-ripple-effect btn-outline-primary" type="button">top</button>
          </section>
        </AmplifyAuthenticator>
      </div>
    </>
  )
}

export default Admin
