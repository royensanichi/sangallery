import { genres as genreMap} from "./genres"


export const shortdesc = (data) => {
    const overview = data.overview?.trim();
    if (!overview) return "No description";

    if (overview.length <= 50) return overview;
  
    // Cut at the last space before 50 chars
    const cutoff = overview.substring(0, 50);
    const lastSpace = cutoff.lastIndexOf(' ');
  
    return cutoff.substring(0, lastSpace) + '...';
}

export const movieGenreFilter = (data) => {
    if (!Array.isArray(data.genre_ids)) return '';
    const genreNames = data.genre_ids.map(id => genreMap[id]).filter(Boolean);
    return genreNames.join(', ');   
      
}