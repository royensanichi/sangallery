import { fetching } from "./components/api";
import { useState, useEffect } from "react";
import { shortdesc, movieGenreFilter } from "./components/commonFunc";
import { useRef } from "react";
import Pagination from "./pagination";

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
        page: 1
    });
    const [page, setPage] = useState(1);
    // const [posts, setposts] = useState([])
    const [loading, setLoading] = useState(true);

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

    // useEffect(() => {
    //     fetchDataForPage(page);
    // }, [page]);

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
        setLoading(true)
        setState(prev => ({ ...prev, modalOpen: true, details: param }));
    }

    const switchPage = (param) => {
        console.log("switching page :" + param)
        setState(prev => ({ page: param }))
        console.log("fetching new page")
        fetching(url + `discover/movie?include_adult=false&include_video=false&language=en-US&page=${param}&sort_by=popularity.desc`)
            .then((data) => {
                // console.log(data)
                return setState(prev => ({ ...prev, posts: data.results }));
            })

    }

    return (
        <div className="justify-center mx-auto">
            <Pagination page={page} onPageChange={setPage} />
            {/* Your movie cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> ... </div>
            <Pagination page={page} onPageChange={setPage} />
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
                                className="relative group bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-700 dark:bg-gray-800 dark:border-gray-700 w-full max-w-sm mx-auto overflow-hidden transition duration-300"
                                onClick={() => openModal(data)}
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
                            {loading && (
                                <svg
                                    aria-hidden="true"
                                    className="mx-auto w-8 h-8 text-gray-200 animate-spin dark:text-gray-800 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>)}
                            <img
                                src={state.details.backdrop_path}
                                alt={state.details.title}
                                onLoad={() => setLoading(false)}
                                className={`mx-auto object-contain bg-black p-4 transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
                            />
                            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{state.details.title} - {state.details.year}</h2>
                            <h3 className="text-1xl font-bold mb-2 text-gray-900 dark:text-white">{state.details.genres}</h3>
                            <p className="text-gray-700 dark:text-gray-300">{state.details.overview}</p>
                        </div>
                    </div>
                )}

            </div>
            <div className="pb-4 pr-4 flex justify-end items-center h-auto">
                <nav aria-label="Page navigation example">
                    <ul className="inline-flex -space-x-px text-sm">
                        <li>
                            <a className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => { state.page > 1 && switchPage(state.page - 1) }}>Previous</a>
                        </li>
                        <li>
                            <a className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 ${state.page == 1 ? null : " dark:hover:text-white"}`} onClick={() => { state.page > 1 && switchPage(1) }}>{state.page === 1 ? "-" : "First page"}</a>
                        </li>
                        <li>
                            <a aria-current="page" className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white" onClick={(e) => e.stopPropagation()}>{state.page}</a>
                        </li>
                        <li>
                            <a className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => { state.page < 500 && switchPage(state.page + 1) }}>{state.page < 500 ? state.page + 1 : "-"}</a>
                        </li>
                        <li>
                            <a className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => { switchPage(500) }}>Last Page</a>
                        </li>

                        <li>
                            <a className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => { state.page < 500 && switchPage(state.page + 1) }}>{state.page < 500 ? "Next" : "-"}</a>
                        </li>
                    </ul>
                </nav>
            </div>

        </div>
    )
}