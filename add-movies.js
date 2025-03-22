const axios = require('axios');

// Admin credentials
const adminCredentials = {
  email: 'admin@example.com',
  password: 'Admin123'
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
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    releaseYear: 2003,
    director: "Peter Jackson",
    genre: "Adventure",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
  },
  {
    title: "Forrest Gump",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
    releaseYear: 1994,
    director: "Robert Zemeckis",
    genre: "Drama",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg"
  },
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseYear: 2010,
    director: "Christopher Nolan",
    genre: "Sci-Fi",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg"
  },
  {
    title: "Fight Club",
    description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    releaseYear: 1999,
    director: "David Fincher",
    genre: "Drama",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg"
  },
  {
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    releaseYear: 1999,
    director: "Lana and Lilly Wachowski",
    genre: "Sci-Fi",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"
  },
  {
    title: "Goodfellas",
    description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
    releaseYear: 1990,
    director: "Martin Scorsese",
    genre: "Crime",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
  },
  {
    title: "One Flew Over the Cuckoo's Nest",
    description: "A criminal pleads insanity and is admitted to a mental institution, where he rebels against the oppressive nurse and rallies up the scared patients.",
    releaseYear: 1975,
    director: "Milos Forman",
    genre: "Drama",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BZjA0OWVhOTAtYWQxNi00YzNhLWI4ZjYtNjFjZTEyYjJlNDVlL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg"
  },
  {
    title: "Seven",
    description: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
    releaseYear: 1995,
    director: "David Fincher",
    genre: "Crime",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"
  },
  {
    title: "The Silence of the Lambs",
    description: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.",
    releaseYear: 1991,
    director: "Jonathan Demme",
    genre: "Thriller",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"
  },
  {
    title: "It's a Wonderful Life",
    description: "An angel is sent from Heaven to help a desperately frustrated businessman by showing him what life would have been like if he had never existed.",
    releaseYear: 1946,
    director: "Frank Capra",
    genre: "Drama",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BZjc4NDZhZWMtNGEzYS00ZWU2LThlM2ItNTA0YzQ0OTExMTE2XkEyXkFqcGdeQXVyNjUwMzI2NzU@._V1_.jpg"
  },
  {
    title: "Life Is Beautiful",
    description: "When an open-minded Jewish waiter and his son become victims of the Holocaust, he uses a perfect mixture of will, humor, and imagination to protect his son from the dangers around their camp.",
    releaseYear: 1997,
    director: "Roberto Benigni",
    genre: "Comedy",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg"
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    director: "Christopher Nolan",
    genre: "Sci-Fi",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"
  },
  {
    title: "The Green Mile",
    description: "The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.",
    releaseYear: 1999,
    director: "Frank Darabont",
    genre: "Fantasy",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_.jpg"
  },
  {
    title: "Star Wars: Episode V - The Empire Strikes Back",
    description: "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda, while his friends are pursued across the galaxy by Darth Vader and bounty hunter Boba Fett.",
    releaseYear: 1980,
    director: "Irvin Kershner",
    genre: "Sci-Fi",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
  },
  {
    title: "Parasite",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    releaseYear: 2019,
    director: "Bong Joon Ho",
    genre: "Thriller",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg"
  },
  {
    title: "The Departed",
    description: "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.",
    releaseYear: 2006,
    director: "Martin Scorsese",
    genre: "Crime",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_.jpg"
  },
  {
    title: "Whiplash",
    description: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    releaseYear: 2014,
    director: "Damien Chazelle",
    genre: "Drama",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BOTA5NDZlZGUtMjAxOS00YTRkLTkwYmMtYWQ0NWEwZDZiNjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"
  },
  {
    title: "The Prestige",
    description: "After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.",
    releaseYear: 2006,
    director: "Christopher Nolan",
    genre: "Mystery",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_.jpg"
  },
  {
    title: "The Intouchables",
    description: "After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.",
    releaseYear: 2011,
    director: "Olivier Nakache, Eric Toledano",
    genre: "Biography",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMTYxNDA3MDQwNl5BMl5BanBnXkFtZTcwNTU4Mzc1Nw@@._V1_.jpg"
  },
  {
    title: "Gladiator",
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    releaseYear: 2000,
    director: "Ridley Scott",
    genre: "Action",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"
  },
  {
    title: "The Lion King",
    description: "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
    releaseYear: 1994,
    director: "Roger Allers, Rob Minkoff",
    genre: "Animation",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_.jpg"
  },
  {
    title: "Casablanca",
    description: "A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.",
    releaseYear: 1942,
    director: "Michael Curtiz",
    genre: "Romance",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BY2IzZGY2YmEtYzljNS00NTM5LTgwMzUtMzM1NjQ4NGI0OTk0XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_.jpg"
  },
  {
    title: "Once Upon a Time in the West",
    description: "A mysterious stranger with a harmonica joins forces with a notorious desperado to protect a beautiful widow from a ruthless assassin working for the railroad.",
    releaseYear: 1968,
    director: "Sergio Leone",
    genre: "Western",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BODQ3NDExOGYtMzI3Mi00NWRlLTkwNjAtNjc4MDgzZGJiZTA1XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg"
  },
  {
    title: "Alien",
    description: "After a space merchant vessel receives an unknown transmission as a distress call, one of the crew is attacked by a mysterious life form and they soon realize that its life cycle has merely begun.",
    releaseYear: 1979,
    director: "Ridley Scott",
    genre: "Horror",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BOGQzZTBjMjQtOTVmMS00NGE5LWEyYmMtOGQ1ZGZjNmRkYjFhXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg"
  },
  {
    title: "2001: A Space Odyssey",
    description: "After discovering a mysterious artifact buried beneath the Lunar surface, mankind sets off on a quest to find its origins with help from intelligent supercomputer HAL 9000.",
    releaseYear: 1968,
    director: "Stanley Kubrick",
    genre: "Sci-Fi",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMmNlYzRiNDctZWNhMi00MzI4LThkZTctMTUzMmZkMmFmNThmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
  },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    description: "When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.",
    releaseYear: 2004,
    director: "Michel Gondry",
    genre: "Romance",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMTY4NzcwODg3Nl5BMl5BanBnXkFtZTcwNTEwOTMyMw@@._V1_.jpg"
  },
  {
    title: "Back to the Future",
    description: "Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean invented by his close friend, the eccentric scientist Doc Brown.",
    releaseYear: 1985,
    director: "Robert Zemeckis",
    genre: "Sci-Fi",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg"
  },
  {
    title: "Indiana Jones and the Raiders of the Lost Ark",
    description: "In 1936, archaeologist and adventurer Indiana Jones is hired by the U.S. government to find the Ark of the Covenant before the Nazis can obtain its awesome powers.",
    releaseYear: 1981,
    director: "Steven Spielberg",
    genre: "Adventure",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNTU2ODkyY2MtMjU1NC00NjE1LWEzYjgtMWQ3MzRhMTE0NDc0XkEyXkFqcGdeQXVyMjM4MzQ4OTQ@._V1_.jpg"
  },
  {
    title: "Psycho",
    description: "A Phoenix secretary embezzles $40,000 from her employer's client, goes on the run, and checks into a remote motel run by a young man under the domination of his mother.",
    releaseYear: 1960,
    director: "Alfred Hitchcock",
    genre: "Horror",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNTQwNDM1YzItNDAxZC00NWY2LTk0M2UtNDIwNWI5OGUyNWUxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
  },
  {
    title: "Spirited Away",
    description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    releaseYear: 2001,
    director: "Hayao Miyazaki",
    genre: "Animation",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"
  },
  {
    title: "The Shining",
    description: "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.",
    releaseYear: 1980,
    director: "Stanley Kubrick",
    genre: "Horror",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg"
  },
  {
    title: "Jurassic Park",
    description: "A pragmatic Paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.",
    releaseYear: 1993,
    director: "Steven Spielberg",
    genre: "Adventure",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_.jpg"
  },
  {
    title: "The Thing",
    description: "A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims.",
    releaseYear: 1982,
    director: "John Carpenter",
    genre: "Horror",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNGViZWZmM2EtNGYzZC00ZWFmLTk5MTMtNGRhZmNlYzdiYjFhXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg"
  },
  {
    title: "Braveheart",
    description: "Scottish warrior William Wallace leads his countrymen in a rebellion to free his homeland from the tyranny of King Edward I of England.",
    releaseYear: 1995,
    director: "Mel Gibson",
    genre: "Biography",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMzkzMmU0YTYtOWM3My00YzBmLWI0YzctOGYyNTkwMWE5MTJkXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
  },
  {
    title: "Jaws",
    description: "When a killer shark unleashes chaos on a beach community off Cape Cod, it's up to a local sheriff, a marine biologist, and an old seafarer to hunt the beast down.",
    releaseYear: 1975,
    director: "Steven Spielberg",
    genre: "Adventure",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMmVmODY1MzEtYTMwZC00MzNhLWFkNDMtZjAwM2EwODUxZTA5XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg"
  },
  {
    title: "Toy Story",
    description: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
    releaseYear: 1995,
    director: "John Lasseter",
    genre: "Animation",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_.jpg"
  },
  {
    title: "The Sixth Sense",
    description: "A boy who communicates with spirits seeks the help of a disheartened child psychologist.",
    releaseYear: 1999,
    director: "M. Night Shyamalan",
    genre: "Drama",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMWM4NTFhYjctNzUyNi00NGMwLTk3NTYtMDIyNTZmMzRlYmQyXkEyXkFqcGdeQXVyMTAwMzUyOTc@._V1_.jpg"
  },
  {
    title: "WALL·E",
    description: "In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.",
    releaseYear: 2008,
    director: "Andrew Stanton",
    genre: "Animation",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMjExMTg5OTU0NF5BMl5BanBnXkFtZTcwMjMxMzMzMw@@._V1_.jpg"
  },
  {
    title: "Django Unchained",
    description: "With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation-owner in Mississippi.",
    releaseYear: 2012,
    director: "Quentin Tarantino",
    genre: "Western",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_.jpg"
  },
  {
    title: "The Social Network",
    description: "As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins who claimed he stole their idea, and by the co-founder who was later squeezed out of the business.",
    releaseYear: 2010,
    director: "David Fincher",
    genre: "Biography",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BOGUyZDUxZjEtMmIzMC00MzlmLTg4MGItZWJmMzBhZjE0Mjc1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"
  },
  {
    title: "The Grand Budapest Hotel",
    description: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
    releaseYear: 2014,
    director: "Wes Anderson",
    genre: "Comedy",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_.jpg"
  },
  {
    title: "Inglourious Basterds",
    description: "In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner's vengeful plans for the same.",
    releaseYear: 2009,
    director: "Quentin Tarantino",
    genre: "Adventure",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BOTJiNDEzOWYtMTVjOC00ZjlmLWE0NGMtZmE1OWVmZDQ2OWJhXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_.jpg"
  },
  {
    title: "Joker",
    description: "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.",
    releaseYear: 2019,
    director: "Todd Phillips",
    genre: "Thriller",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg"
  }
];

// Login function to get admin token
async function login() {
  try {
    const response = await axios.post('http://localhost:5001/api/users/login', adminCredentials);
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
      await axios.post('http://localhost:5001/api/movies', movie, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      successCount++;
      console.log(`Added movie: ${movie.title} (${successCount} of ${movies.length})`);
      
      // Add a small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
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
    console.log('Logging in as admin...');
    const token = await login();
    console.log('Login successful, adding movies...\n');
    await addMovies(token);
  } catch (error) {
    console.error('Script failed:', error.message);
  }
}

// Run the script
main();