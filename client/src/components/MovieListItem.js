const MovieListItem = (id, title, hasInfo) => {
  return `
				<li class='itemClass' data-movie_info=${hasInfo} data-id=${id}>
					${title}
					<button class='btnApprove'>\u2713</button>
					<button class='btnDelete'>\u2717</button>
				</li>
			`;
};

module.exports = MovieListItem;
