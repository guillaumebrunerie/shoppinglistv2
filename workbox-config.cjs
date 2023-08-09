module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{css,js,png,html,webmanifest}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};
