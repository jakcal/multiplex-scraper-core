const got = require('got');
const { EventEmitter } = require('events');
const VidStreaming = require('../hosts/vidstreaming');

const URL_BASE = 'http://104.196.45.69/api/search';

class OneZeroFourOneNineSixFourFiveSixNine extends EventEmitter {
	constructor() {
		super();
	}

	async scrape({title}, type) {

		if (type !== 'movie') {
			return this.emit('finished');
		}

		const response = await got(`${URL_BASE}?query=${title}`, {
			json: true
		});
	
		const data = response.body;

		if (
			!data.status ||
			data.status !== 'successful' ||
			!data.payload ||
			!data.payload.data ||
			data.payload.data.length <= 0
		) {
			return this.emit('finished');
		}
	
		const movies = data.payload.data;
		const movie = movies.find(({title}) => title === title);

		if (!movie) {
			return this.emit('finished');
		}

		const link = movie.links[0].url;

		VidStreaming.scrape(link)
			.then(vidstreaming => {
				if (vidstreaming) {
					this.emit('stream', vidstreaming);
					return this.emit('finished');
				}

				//callback();
			});
	}
}

module.exports = OneZeroFourOneNineSixFourFiveSixNine;

/*
(async () => {
	const scraper = new OneZeroFourOneNineSixFourFiveSixNine();

	scraper.on('stream', stream => {
		console.log(stream);
	});

	scraper.on('finished', () => {
		console.timeEnd('scraping');
	});
	
	console.time('scraping');
	scraper.scrape({
		title: 'Captain Marvel',
		year: 2019,
		ids: {
			trakt: 193963,
			slug: 'captain-marvel-2019',
			imdb: 'tt4154664',
			tmdb: 299537
		}
	}, 'movie');
})();
*/