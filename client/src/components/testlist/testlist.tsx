// components/TestList.js
'use client'; // This directive must be at the very top

import { useState, useEffect } from 'react';
import "./testlist.css";

function TestList() {
    const [data, setData] = useState<[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5555/dataTest");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setData(json);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                }

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return <div className="testlist">Loading testlist data...</div>;
    }

    if (error) {
        return <div className="testlist">Error: {error}</div>;
    }

    return (
        <div className="testlist">
            {
                data ? data.map(item =>
                    (<p>Name: {item} </p>)
                ) : (<p>No Data Found</p>)
            }

        </div>
    );
}

export default TestList;