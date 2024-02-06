const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  const movie = await service.read(request.params.movieId);
  if (movie) {
    response.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found`});
}

async function read(request, response) {
  const data = response.locals.movie;
  response.json({ data });
}

async function list(request, response) {
  const is_showing = request.query.is_showing === 'true' ? true : false;
  const data = await service.list(is_showing);
  response.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  movieExists,
};
