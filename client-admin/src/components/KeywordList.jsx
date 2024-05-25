import React, { useState, useEffect } from 'react';

function KeywordList() {
    const [keywords, setKeywords] = useState({ reply: [], replyAndDirectMessage: [] });

    useEffect(() => {
        const fetchKeywords = async () => {
            const response = await fetch('http://localhost:8080/keywords');
            const data = await response.json();
            const reply = data.filter(keyword => keyword.action === 'reply');
            const replyAndDirectMessage = data.filter(keyword => keyword.action === 'replyAndDirectMessage');
            setKeywords({ reply, replyAndDirectMessage });
        };
        fetchKeywords();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Reply Only Keywords</h2>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Keyword</th>
                    </tr>
                </thead>
                <tbody>
                    {keywords.reply.map((keyword, index) => (
                        <tr key={index} className="border-t">
                            <td className="py-2 px-4">{keyword.keyword}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="text-xl font-bold mt-8 mb-4">Reply and Direct Message Keywords</h2>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Keyword</th>
                    </tr>
                </thead>
                <tbody>
                    {keywords.replyAndDirectMessage.map((keyword, index) => (
                        <tr key={index} className="border-t">
                            <td className="py-2 px-4">{keyword.keyword}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default KeywordList;
