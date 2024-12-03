import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
    const location = useLocation();
    const message = location.state?.message;

    return (
        <>
            <Navbar />
            <div className="text-center mt-5">
                <h1>Welcome to the Homepage</h1>
                {message && <p className="alert alert-info">{message}</p>}
            </div>
        </>
    );
};

export default Home;