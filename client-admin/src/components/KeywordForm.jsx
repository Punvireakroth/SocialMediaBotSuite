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
        <div>
            <h1>Add Product Keywords</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="keyword">Keyword:</label>
                <input
                    type="text"
                    id="keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    required
                />
                <br />
                <label htmlFor="action">Action:</label>
                <select id="action" value={action} onChange={(e) => setAction(e.target.value)}>
                    <option value="reply">Reply Only</option>
                    <option value="replyAndDirectMessage">Reply and Direct Message</option>
                </select>
                <br />
                <button type="submit">Add Keyword</button>
            </form>
        </div>
    );
};

export default KeywordForm;
