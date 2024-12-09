import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
    const location = useLocation();
    const message = location.state?.message;

    const [movies, setMovies] = useState<any[]>([]);
    const [timeframe, setTimeframe] = useState<"day" | "week">("day");

    const fetchMovies = async () => {
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/${timeframe}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
                },
            }
        );
        const data = await response.json();
        setMovies(data.results);
    };

    useEffect(() => {
        fetchMovies();
    }, [timeframe]);

    const handleSwitch = (option: "day" | "week") => {
        setTimeframe(option);
    };

    const handleGoToDetail = (id: number) => {
        console.log(id);
    }

    return (
        <div className="">
            <Navbar />
            <div className="flex-grow flex items-center justify-center bg-[url('https://i.pinimg.com/originals/07/21/1b/07211b078ab5e9f537a3daeccef72279.jpg')] bg-cover bg-center bg-no-repeat min-h-80 flex flex-col text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Welcome to the Homepage</h1>
                    {message && (
                        <p className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg inline-block">
                            {message}
                        </p>
                    )}
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <span className="text-lg font-bold">Trending</span>
                    <div className="relative flex bg-gray-800 p-2 rounded-full w-80 ml-4">
                        <div
                            className={`absolute h-3/5 bg-gray-700 rounded-full transition-all ${timeframe === "day" ? "w-1/2 left-0 ml-2" : "w-1/2 left-1/2 -ml-2"}`}
                        />
                        <button
                            className={`relative z-10 flex-1 text-white ${timeframe === "day" ? "font-bold" : ""}`}
                            onClick={() => handleSwitch("day")}
                        >
                            Today
                        </button>
                        <button
                            className={`relative z-10 flex-1 text-white ${timeframe === "week" ? "font-bold" : ""}`}
                            onClick={() => handleSwitch("week")}
                        >
                            This Week
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <div className="flex gap-4">
                        {movies.map((movie) => {
                            const votePercentage = movie.vote_count === 0 ? "NR" : Math.round(movie.vote_average * 10);

                            const getColor = () => {
                                if (movie.vote_count === 0) return 'text-gray-500';
                                if (typeof votePercentage === 'number' && votePercentage > 70) return 'text-green-500';
                                if (typeof votePercentage === 'number' && votePercentage >= 50) return 'text-yellow-500';
                                return 'text-red-500';
                            };

                            return (
                                <div key={movie.id} className="w-[120px] bg-gray-800 text-white p-4 rounded-lg flex-shrink-0 relative cursor-pointer" onClick={() => handleGoToDetail(movie.id)}>
                                    <div className="relative">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt={movie.title}
                                            className="rounded-md w-[100px] h-[150px] object-cover mb-4 mx-auto"
                                        />
                                        <div className={`absolute -top-3 -left-3 text-xs rounded-full w-10 h-10 flex items-center justify-center border-4 border-gray-600 bg-gray-900 ${getColor()}`}>
                                            {votePercentage}{votePercentage === "NR" ? "" : "%"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <h3 className="font-bold text-center text-sm break-words line-clamp-2" title={movie.title}>
                                            {movie.title}
                                        </h3>
                                        <p className="text-xs italic text-center">
                                            {format(new Date(movie.release_date), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;