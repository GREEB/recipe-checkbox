// We need to add sites to matches in manifest.json
import fs from 'node:fs';
import sites from './source/sites.json';
import manifest from './source/manifest.json';

type ContentScript = {
	matches: string[];
	css: string[];
	run_at: string;
	js: string[];
};

(() => {
	const newMatches: ContentScript[] = [];
	for (const element of sites.sites) {
		const fileExists = fs.existsSync(`source/sites/${element.url}/style.css`);
		const styles = ['global.css'];
		if (fileExists) {
			styles.push(`sites/${element.url}/style.css`);
		}

		newMatches.push({
			matches: [`*://*.${element.url}/*`],
			css: styles,
			run_at: 'document_end',
			js: ['script.js'],
		});
	}

	const newManifest = manifest;
	newManifest.content_scripts = newMatches;
	fs.writeFile('source/manifest.json', JSON.stringify(newManifest), error => {
		if (error) {
			console.log('Error writing file:', error);
		} else {
			console.log('Successfully wrote file');
		}
	});
})();
