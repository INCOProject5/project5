A Login page
- login
- register page
- user authentication against db
- non-users can view site, but only registered users can rate (use middleware)

B Database
two tables
- users table for who is able to login
-- UserID, firstName, lastName, email, hashedPassword
- Ratings table for each movie, which links to the user who rated
-- User, movieID, movieType (drama, romance etc), User rating
---> user can only rate movie once
---> if user re-rates, update movie rating on DB (be careful on total unique votes)

C API
- fetch movie list data from https://yts.am/api/v2/list_movies.json when
user arrives at page
- send data from browser to server (fetch or axios.js)

D Homepage
- Navbar
-- Homepage
-- Login (turns into logout when logged in)
- Search bar by title (js + updating DOM)
- Search by genre via filters or dropdown

E Main canvas
-- 20 most recent movies from API
-- show poster, title, community score from DB, number of unique votes on DB

F Click on poster (details page)
- poster
- title
- year
- summary/synopsis
- user can rate movie

Project Plan:
18/5
Mo: Learn Git and pushing to GitHub
Tu: A
We: B
Th: C
Fr: D
Sa: E
Su: F
