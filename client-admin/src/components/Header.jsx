import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Keyword Manager</h1>
                <nav>
                    <Link to="/" className="mr-4">Home</Link><br />
                    <Link to="/add-keyword" className="mr-4">Add Keyword</Link><br />
                    <Link to="/keyword-list">Keyword List</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
