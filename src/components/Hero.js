import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="hero">
            <h2>Tomi Books</h2>
            <h3>Without books how will you<br />raise your monitors</h3>
            <Link className="btn" to="/books">View All Books</Link>
        </section>
    )
}

export default Hero
