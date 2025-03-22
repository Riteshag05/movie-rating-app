const axios = require('axios');

// Admin credentials
const adminCredentials = {
  email: 'test@example.com',
  password: 'Test123'
};

// List of 50 movies with details
const movies = [
  {
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseYear: 1994,
    director: "Frank Darabont",
    genre: "Drama",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg"
  },
  {
    title: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseYear: 1972,
    director: "Francis Ford Coppola",
    genre: "Crime",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseYear: 2008,
    director: "Christopher Nolan",
    genre: "Action",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg"
  },
  {
    title: "Schindler's List",
    description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    releaseYear: 1993,
    director: "Steven Spielberg",
    genre: "Biography",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"
  },
  {
    title: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    releaseYear: 1994,
    director: "Quentin Tarantino",
    genre: "Crime",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
  }
];

// Login function to get admin token
async function login() {
  try {
    console.log('Logging in to get token...');
    const response = await axios.post('https://movie-rating-app-9pdl.onrender.com/api/users/login', adminCredentials);
    console.log('Login successful');
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw error;
  }
}

// Add movies function
async function addMovies(token) {
  let successCount = 0;
  let failureCount = 0;

  for (const movie of movies) {
    try {
      await axios.post('https://movie-rating-app-9pdl.onrender.com/api/movies', movie, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      successCount++;
      console.log(`Added movie: ${movie.title} (${successCount} of ${movies.length})`);
      
      // Add a small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      failureCount++;
      console.error(`Failed to add movie "${movie.title}":`, error.response?.data?.message || error.message);
    }
  }

  console.log(`\nProcess completed. Added ${successCount} movies. Failed: ${failureCount}`);
}

// Main function
async function main() {
  try {
    console.log('Starting movie import process...');
    const token = await login();
    console.log('Login successful, adding movies...\n');
    await addMovies(token);
  } catch (error) {
    console.error('Script failed:', error.message);
  }
}

// Run the script
main();