const { VideoMediaScraper } = require('./');

(async () => {
	const streams = [];
	const scraper = new VideoMediaScraper();

	scraper.on('stream', stream => {
		streams.push(stream);
		console.log(stream);
	});

	scraper.on('finished', () => {
		console.timeEnd('Scrape Time');
		console.log(`Total streams: ${streams.length}`);
		console.log(streams);
	});
	
	console.log('Starting Sprited Away scraping');
	console.time('Scrape Time');
	scraper.scrape('tt0245429');
})();