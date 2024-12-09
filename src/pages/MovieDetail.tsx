import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import { CircularProgressbar } from 'react-circular-progressbar'; // Import thư viện vòng tròn
import 'react-circular-progressbar/dist/styles.css'; // Import CSS của thư viện

const MovieDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setMovie(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movie details:', error);
                setLoading(false);
            }
        };

        fetchMovieDetail();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!movie) {
        return <div>Movie not found</div>;
    }

    // Tính toán phần trăm từ rating
    const ratingPercentage = movie.vote_average * 10; // Chuyển đổi từ 0-10 sang 0-100

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="header bg-gray-900 fixed w-full top-0 z-50">
                <Navbar />
            </div>
            <div className="h-[80px]">
            </div>
            <div className="relative">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                        filter: 'blur(10px)',
                        zIndex: -1,
                    }}
                />
                <div className="container mx-auto p-6 flex flex-col md:flex-row relative z-10">
                    {/* Bên trái: Ảnh poster */}
                    <div className="md:w-1/2 mb-6 md:mb-0  flex justify-center items-center">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out" // Thêm hiệu ứng hover
                        />
                    </div>
                    {/* Bên phải: Nội dung */}
                    <div className="md:w-1/2 md:pl-6">
                        <h1 className="text-4xl font-bold text-yellow-400 mb-3">{movie.title}</h1>
                        <p className="text-lg text-gray-400"><strong>Release Date:</strong> {format(new Date(movie.release_date), 'MMM dd, yyyy')}</p>
                        
                        {/* Hiển thị vòng tròn rating */}
                        <div className="flex items-center mt-4 mb-6">
                            <div className="w-24 h-24 mr-6">
                                <CircularProgressbar
                                    value={ratingPercentage}
                                    text={`${ratingPercentage}%`}
                                    strokeWidth={12}
                                    styles={{
                                        path: { stroke: '#f39c12' },
                                        trail: { stroke: '#444' },
                                        text: { fill: '#fff', fontSize: '14px', fontWeight: 'bold' },
                                    }}
                                />
                            </div>
                            <p className="text-xl text-white font-semibold"><strong>Rating:</strong> {movie.vote_average} / 10</p>
                        </div>

                        <p className="text-lg text-gray-400"><strong>Genres:</strong> {movie.genres.map((genre: any) => genre.name).join(', ')}</p>
                        
                        <h2 className="text-2xl mt-6 text-white">Overview</h2>
                        <p className="mt-3 text-lg text-gray-300">{movie.overview}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
