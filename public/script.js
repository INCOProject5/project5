/* eslint-disable camelcase */
// when we load page (DOMContentLoaded)...
window.addEventListener('DOMContentLoaded', () => {
  const spans = document.querySelectorAll('.rating_spans > span')
  const user_id = document.getElementById('rating_spans').getAttribute('data-user-id')
  const movie_id = document.getElementById('rating_spans').getAttribute('data-movie-id')
  const serverUrl = 'http://localhost:3000/rating'
  const method = 'POST'
  const headers = { 'Content-Type': 'application/json' }

  //  user_id ,movie_id and value

  for (let i = 0; i < spans.length; i++) {
    spans[i].addEventListener('click', (e) => {
      let rate = e.target.getAttribute('data-value')
      //  sending data
      fetch(serverUrl, {
        method,
        headers,
        body: JSON.stringify({ user_id, movie_id, rate }),
      }).then((response) => {
        console.log(response)
      })
    })
  }
})
