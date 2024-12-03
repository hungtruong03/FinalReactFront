import React from 'react';
import Navbar from '../components/Navbar';

const Private: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="text-center mt-5">
                <h1>This is the private page</h1>
            </div>
        </>
    );
};

export default Private;