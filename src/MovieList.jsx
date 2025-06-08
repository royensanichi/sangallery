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
                        console.log(data)
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
        setState(prev => ({ ...prev, modalOpen:true, details: param }));
    }


    return (
        <div className="p-80 bg-white dark:bg-grey-900">

        </div>
    )
}