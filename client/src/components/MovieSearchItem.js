const MovieSearchItem = (id, title, overview, posterPath, year) => {
  return `
  <li class='movie_modal-movie'>
    <img src='${posterPath}' alt='missing movie poster'/>
    <div>
      <p>${title} - ${year}</p>
      <p>${overview}</p>
    </div>
    <button data-movie_id=${id}>Choose</button>
  </li>
`;
};

module.exports = MovieSearchItem;
