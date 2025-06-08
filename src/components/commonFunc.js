import { mockupgenre } from "../db/mockupGenre"
// const genreAPIurl = "genre/movie/list?language=en"

export const shortdesc = (data) => {
    if (data.overview !== "") {
        if (data.overview.length > 50) {
            return data.overview.substring(0, 50)
        }
        else if (data.overview.length < 50) {
            return data.overview
        }
    }
    else {
        return "No description"
    }

}

export const movieGenreFilter = (data) => {
    const newArr = []
    data.genre_ids.map((val, i) => {
        const genre = mockupgenre.genres
        for (let i = 0; i < genre.length; i++) {
            if (genre[i].id === val) newArr.push(genre[i].name)
        }
        data.genre = newArr.toString();
    })
    return data.genre
}