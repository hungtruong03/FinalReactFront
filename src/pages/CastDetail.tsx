import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

const CastDetail: React.FC = () => {
    const { castId } = useParams<{ castId: string }>();
    const [cast, setCast] = useState<any>(null);
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const TMDB_API_KEY = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

    useEffect(() => {
        const fetchCastDetail = async () => {
            setLoading(true);

            try {
                const castResponse = await fetch(
                    `https://api.themoviedb.org/3/person/${castId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${TMDB_API_KEY}`,
                        },
                    }
                );
                const castData = await castResponse.json();
                setCast(castData);

                const moviesResponse = await fetch(
                    `https://api.themoviedb.org/3/person/${castId}/movie_credits`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${TMDB_API_KEY}`,
                        },
                    }
                );
                const moviesData = await moviesResponse.json();
                const sortedMovies = moviesData.cast.sort((a: any, b: any) => {
                    const releaseDateA = a.release_date ? new Date(a.release_date).getTime() : 0;
                    const releaseDateB = b.release_date ? new Date(b.release_date).getTime() : 0;

                    return releaseDateB - releaseDateA;
                });
                setMovies(sortedMovies);
            } catch (error) {
                console.error('Error fetching cast details or movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCastDetail();
    }, [castId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!cast) {
        return <div>Cast not found</div>;
    }

    const handleGoToDetail = (id: number) => {
        if (id) {
            console.log(id);
            navigate(`/movie/${id}`);
        } else {
            console.error("Invalid movie ID");
        }
    }

    return (
        <>
            {/* <div className="p-4 flex items-center gap-6">
                <div className="w-[500px] h-[500px] flex-shrink-0">
                    <img
                        src={`https://image.tmdb.org/t/p/w500/${cast.profile_path}`}
                        alt={cast.name}
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                </div>

                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-center">{cast.name}</h2>

                    <div>
                        <p className="mt-4 font-bold">Biography</p>
                        <p className="text-sm text-gray-500">{cast.biography || "No biography"}</p>
                    </div>

                    <div>
                        <p className="mt-4 font-bold">Birthday</p>
                        <p className="text-sm text-gray-500">{format(new Date(cast.birthday), 'MMMM dd, yyyy') || "No information"}</p>
                        {cast.deathday && (
                            <p className="text-sm text-gray-500">Died: {format(new Date(cast.deathday), 'MMMM dd, yyyy')}</p>
                        )}
                    </div>

                    <div>
                        <p className="mt-4 font-bold">Gender</p>
                        <p className="text-sm text-gray-500">
                            {cast.gender === 1 ? "Female" : cast.gender === 2 ? "Male" : "Not specified"}
                        </p>
                    </div>

                    <div>
                        <p className="mt-4 font-bold">Known For</p>
                        <p className="text-sm text-gray-500">{cast.known_for_department || "Not specified"}</p>
                    </div>

                    <div>
                        <p className="mt-4 font-bold">Place of Birth</p>
                        <p className="text-sm text-gray-500">{cast.place_of_birth || "Not specified"}</p>
                    </div>

                    <div>
                        <p className="mt-4 font-bold">Also Known As</p>
                        <p className="text-sm text-gray-500">{cast.also_known_as?.join(", ") || "None"}</p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-2xl font-bold text-center mb-4">Movies</h3>
                <div className="flex gap-4 overflow-x-auto">
                    {movies.length > 0 ? (
                        movies.map((movie: any) => {
                            const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown";

                            return (
                                <div
                                    key={movie.id}
                                    className="text-center w-[120px] h-[240px] flex-shrink-0 flex flex-col items-center"
                                    onClick={() => handleGoToDetail(movie.id)}
                                >
                                    <p className="text-xs text-gray-500">{releaseYear}</p>
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                        alt={movie.title}
                                        className="mb-2 w-[120px] h-[180px] object-cover mx-auto shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                                    />
                                    <p className="text-sm text-black break-words line-clamp-2">{movie.title}</p>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-white">No movies found for this cast member.</p>
                    )}
                </div>
            </div> */}

            <div className="bg-gray-900 text-white min-h-screen">
                <div className="h-[80px]">
                </div>
                <div className="relative">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${cast.backdrop_path})`,
                            filter: 'blur(10px)',
                            zIndex: -1,
                        }}
                    />
                    <div className="container mx-auto p-6 flex flex-col md:flex-row relative z-10">
                        <div className="md:w-1/2 mb-6 md:mb-0  flex justify-center items-center">
                            <img
                                src={`https://image.tmdb.org/t/p/w500/${cast.profile_path}`}
                                alt={cast.name}
                                className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                            />
                        </div>
                        <div className="md:w-1/2 md:pl-6">
                            <h1 className="text-4xl font-bold text-yellow-400 mb-3">{cast.name}</h1>

                            <h2 className="text-2xl mt-6 text-white">Biography</h2>
                            <p className="mt-3 mb-3 text-lg text-gray-300">{cast.biography || "No biography"}</p>

                            <p className="text-lg text-gray-400"><strong>Birthday:</strong> {format(new Date(cast.birthday), 'MMMM dd, yyyy') || "No information"} {cast.deathday ? `(Died: ${format(new Date(cast.deathday), 'MMMM dd, yyyy')})` : null}</p>

                            <p className="text-lg text-gray-400"><strong>Gender:</strong> {cast.gender === 1 ? "Female" : cast.gender === 2 ? "Male" : "Not specified"}</p>

                            <p className="text-lg text-gray-400"><strong>Known for:</strong> {cast.known_for_department || "Not specified"}</p>

                            <p className="text-lg text-gray-400"><strong>Place of birth:</strong> {cast.place_of_birth || "Not specified"}</p>

                            <p className="text-lg text-gray-400"><strong>Also known as:</strong> {cast.also_known_as?.join(", ") || "None"}</p>

                            {/* Movie list */}
                            <h2 className="text-2xl mt-6 text-white">Movies</h2>
                            <div className="flex gap-4 overflow-x-auto">
                                {movies.length > 0 ? (
                                    movies.map((movie: any) => {
                                        const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown";

                                        return (
                                            <div
                                                key={movie.id}
                                                className="text-center w-[120px] h-[260px] flex-shrink-0 flex flex-col items-center"
                                                onClick={() => handleGoToDetail(movie.id)}
                                            >
                                                <p className="text-xs text-gray-500 mb-2">{releaseYear}</p>
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="mb-2 w-[120px] h-[180px] object-cover mx-auto shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                                                />
                                                <p className="text-sm text-white break-words line-clamp-2">{movie.title}</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-white">No movies found for this cast member.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CastDetail;