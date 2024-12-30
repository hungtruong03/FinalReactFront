import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <div className="header bg-gray-900 fixed w-full top-0 z-50">
                <Navbar />
            </div>
            <div className="mt-[64px]">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;