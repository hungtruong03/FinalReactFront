import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
    const location = useLocation();
    const message = location.state?.message;

    return (
        <div className="bg-[url('https://i.pinimg.com/originals/07/21/1b/07211b078ab5e9f537a3daeccef72279.jpg')] bg-cover bg-center bg-no-repeat min-h-screen flex flex-col text-white">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Welcome to the Homepage</h1>
                    {message && (
                        <p className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg inline-block">
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;