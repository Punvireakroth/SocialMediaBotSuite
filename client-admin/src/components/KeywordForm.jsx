import React, { useState } from 'react';
import axios from 'axios';

const KeywordForm = () => {
    const [keyword, setKeyword] = useState('');
    const [action, setAction] = useState('reply');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/addKeyword', { keyword, action });
            alert('Keyword added successfully');
            setKeyword('');
        } catch (error) {
            alert('Error adding keyword: ' + error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-medium mb-4">Add Product Keywords</h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div className="flex items-center">
                    <label htmlFor="keyword" className="w-1/3 mr-2 text-sm font-medium">Keyword:</label>
                    <input
                        type="text"
                        id="keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center">
                    <label htmlFor="action" className="w-1/3 mr-2 text-sm font-medium">Action:</label>
                    <select id="action" value={action} onChange={(e) => setAction(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="reply">Reply Only</option>
                        <option value="replyAndDirectMessage">Reply and Direct Message</option>
                    </select>
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Add Keyword</button>
            </form>
        </div>
    );
};

export default KeywordForm;
