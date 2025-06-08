const publicToken = 
"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjg4NjE0MTIwYTliNTRkOTgwYTQ5ZmU0NzBmYWUxMCIsInN1YiI6IjY0ZWVjZDBiY2FhNTA4MDEwYWU1ZDJmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1K-LHs0hpH57jUE_O9WUFQaYeLxnMo0X5o3U6z8ZNks"

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${publicToken}`
    }
}

export const fetching = (url) => {
    return fetch(url, options)
        .then((response) => response.json().then((data) => {
            return data;
        }))
}
