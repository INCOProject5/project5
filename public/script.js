// when we load page (DOMContentLoaded)...
window.addEventListener('DOMContentLoaded', () => {
  const inputElements = document.querySelectorAll('input')
  const elementsLength = inputElements.length
  const serverUrl = 'http://localhost:3000/rate'
  const method = 'POST'
  const headers = { 'Content-Type': 'application/json' }
  const rateOnChange = async (e) => {
    let movieId = e.target.closest('form').getAttribute('data-movie-id')
    let userId = e.target.closest('form').getAttribute('data-user-id')
    let ratingValue = e.target.value
    let data = { movieId, userId, ratingValue }
    await fetch(serverUrl, { method, headers, body: JSON.stringify(data) })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }
  for (let i = 0; i < elementsLength; i++) {
    if (!inputElements) break
    inputElements[i].addEventListener('change', rateOnChange)
  }
})
