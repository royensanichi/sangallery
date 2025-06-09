import { fetching } from "./components/api";
import { useState, useEffect } from "react";
import { shortdesc, movieGenreFilter } from "./components/commonFunc";

export default function MovieList() {
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

    return (
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-grey-900 justify-center">

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
                    <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 max-w-sm">

                        <img className="rounded-t-lg" src={data.backdrop_path} alt="" />

                        <div className="">
                            <a>
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{data.title} - {data.year}</h5>
                            </a>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{shortdesc(data)}</p>
                            <a className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Read more
                                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </a>
                        </div>
                    </div>
                )

            })}
        </div>
    )
}