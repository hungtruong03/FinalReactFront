import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Your Website. All Rights Reserved.</p>
                <div className="mt-2">
                    <span className="text-gray-400 hover:text-white mx-2 cursor-pointer">Privacy Policy</span>
                    <span className="text-gray-400 hover:text-white mx-2 cursor-pointer">Terms of Service</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;