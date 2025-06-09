import { fetching } from "./components/api";
import { useState, useEffect } from "react";
import { shortdesc, movieGenreFilter } from "./components/commonFunc";
import { useRef } from "react";
import Pagination from "./Pagination";

export default function MovieList() {
    const loadMoreRef = useRef(null);
    //List & Card Module
    const url = "https://api.themoviedb.org/3/"

    const [state, setState] = useState({
        posts: [],
        count: 2,
        onSearch: false,
        searchValue: "",
        details: {},
        modalOpen: false,
    });

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        }, {
            root: null,
            rootMargin: "0px",
            threshold: 1.0
        });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [loadMoreRef, state.count, state.onSearch, state.searchValue]);

    useEffect(() => {
        async function fetchData() {
            try {
                await fetching(url + "discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc")
                    .then((data) => {
                        return setState(prev => ({ ...prev, posts: [...prev.posts, ...data.results] }));
                    })
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                setState(prev => ({ ...prev, modalOpen: false }));
            }
        };

        if (state.modalOpen) {
            window.addEventListener("keydown", handleEsc);
        }

        // Cleanup
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [state.modalOpen]);

    const loadMore = async () => {
        const endpoint = onSearch
            ? `search/movie?query=${searchValue}&include_adult=false&language=en-US&page=${count}`
            : `discover/movie?include_adult=false&include_video=false&language=en-US&page=${count}&sort_by=popularity.desc`;

        try {
            const data = await fetching(endpoint);
            setState(prev => ({ ...prev, posts: [...prev.posts, ...data.results] }));
            setState(prev => ({ ...prev, count: prev.count + 1 }))
        } catch (err) {
            console.error(err);
        }
    }

    const OnSearch = async (value) => {
        const isSearching = value.trim() !== "";
        const endpoint = isSearching
            ? `search/movie?query=${value}&include_adult=false&language=en-US&page=1`
            : `discover/movie`;

        setState(prev => ({
            ...prev,
            searchValue: value,
            count: 2,
            onSearch: isSearching,
            posts: []
        }));

        try {
            const data = await fetching(url + endpoint);
            setState(prev => ({
                ...prev,
                posts: data.results
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        setState(prev => ({ ...prev, modalOpen: false }));
    };

    const openModal = (param) => {
        setState(prev => ({ ...prev, modalOpen: true, details: param }));
    }
    // console.log(state)

    return (
        <div className="justify-center mx-auto">
            <div className="flex justify-center bg-gradient-to-b from-blue-500">
                <div className="p-2 sm:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-xl">

                    {state.posts && state.posts.map((data, index) => {
                        //Filter the Year of the Movie, 4 substring only (yyyy-mm-dd)
                        data.year = data.release_date.substring(0, 4);

                        //setting the genre of the movie 
                        data.genre = movieGenreFilter(data)

                        //filter the Movie's rating-less with no rating yet  
                        if (data.vote_average === 0) {
                            data.vote_average = "no rating"
                        }
                        //if the movie have No Image
                        if (data.backdrop_path === null || data.backdrop_path === "") { data.backdrop_path = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png" }
                        else {
                            //replacing the backdrop_path with TMDb link + backdrop_path so it can fetch the image 
                            data.backdrop_path = `https://www.themoviedb.org/t/p/w220_and_h330_face/${data.backdrop_path}`
                        }

                        return (
                            //the Card
                            <div key={index}
                                className="relative group bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 w-full max-w-sm mx-auto overflow-hidden"
                            >
                                <img className="pt-4 rounded-t-lg mx-auto h-auto object-cover" src={data.backdrop_path} alt="" />

                                {/* //the movie's title and caption */}
                                <div className="flex flex-col items-center text-center p-4 space-y-2">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-white">{data.title} - {data.year}</h5>
                                    <p className="hover:text-red-100 font-normal text-gray-700 dark:text-gray-400">{shortdesc(data)}</p>

                                </div>
                                {/* Hover overlay */}
                                <div className="cursor-pointer absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="cursor-pointer disabled text-white text-lg font-semibold" onClick={() => openModal(data)}>Read more</button>
                                </div>
                            </div>
                        )

                    })}
                </div>
                {state.modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={handleCancel}>
                        <div className="bg-gray-600 hover:bg-gray-700 opacity-100 p-6 rounded-lg shadow-lg max-w-lg w-full relative duration-300" onClick={(e) => e.stopPropagation()}>
                            {/* Close button */}
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                onClick={handleCancel}
                            >
                                &times;
                            </button>

                            {/* Modal Content */}
                            <img
                                src={state.details.backdrop_path}
                                alt={state.details.title}
                                className="mx-auto object-contain bg-black p-4 duration-300"
                            />
                            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{state.details.title} - {state.details.year}</h2>
                            <h3 className="text-1xl font-bold mb-2 text-gray-900 dark:text-white">{state.details.genres}</h3>
                            <p className="text-gray-700 dark:text-gray-300">{state.details.overview}</p>
                        </div>
                    </div>
                )}

            </div>
            <div className="pb-4 pr-4 flex justify-end items-center h-auto">
                {/* <button className="mx-auto">
                    Load More
                </button> */}
                <Pagination/>
            </div>

        </div>
    )
}