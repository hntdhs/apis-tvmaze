/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const MISSING_IMAGE_URL = "http://tinyurl.com/missing-tv";


async function searchShows(query) {
  let response = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${query}`);
      // this is the endpoint for show search on TV Maze's API page that we make a GET request to

  let shows = response.data.map(result => {
    // take the data that comes from the response and map the data we want to these variables (is the map part right?)
    let show = result.show; // show is the name of a json object that's in the response
    return {
      id: show.id, // take the value from the id key in the JSON object...
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL,
    };
  });
  return shows;
  // this is going to be used repeatedly for different shows. the variable 'shows' will hold multiple instances of 'show' objects. is that why 'map' is necessary?
}


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty(); // empties the shows list area when a new search is performed

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
        <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image}">
          <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
          </div>
        </div>
      </div>
      `);
// 53 - why is there 2 columns created?
// attaching the show id to a data attribute so we can call it easily later
    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();
  // not sure I understand async functions b/c I don't see why this is one

  let query = $("#search-query").val(); // gets the value from search query field
  if (!query) return;

  $("#episodes-area").hide(); // not sure what this does, or what's up with the whole episodes thing

  let shows = await searchShows(query); // why do you have to put await in front of the function name?

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  // id and not show.id as defined above on line 32
  // getting episodes by making a GET request to the episodes endpoint defined on TV Maze's API page

  //   let episodes = response.data.map(result => {
  //   let episode = result.episode;
  //   return {
  //     id: episode.id,
  //     name: episode.name,
  //     season: episode.season,
  //     number: episode.number,
  //   };  
  // });
  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes;
}

  // TODO: return array-of-episode-info, as described in docstring above

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
    
  for (let episode of episodes) {
    let $episodeInfo = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesList.append($episodeInfo);
  }

  $("#episodes-area").show();
  // show is a jQ effect that shows an html element, like how hide() does the opposite
}


/** Handle click on show name. */

$("#shows-list").on("click", ".btn btn-primary get-episodes", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});
// what is .get-episodes? class name created when populateShows creates the card with the Episodes button. tried changing it to the full class name but it didn't work.

