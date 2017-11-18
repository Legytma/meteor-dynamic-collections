Package.describe({
	name: 'windol:meteor-dynamic-collections',
	version: '0.0.1',
	// Brief, one-line summary of the package.
	summary: 'Meteor dynamic collections',
	// URL to the Git repository containing the source code for this package.
	git: 'https://github.com/Windol/meteor-dynamic-collections.git',
	// By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: 'README.md'
});

Package.onUse(function(api) {
	api.versionsFrom("1.4.4.3");

	api.use("ecmascript");
	api.use("tracker");
	api.use("accounts-base");
	//api.use("aldeed:schema-deny");
	api.use("windol:meteor-audit-schema");
	api.use(["meteor", "mongo", "underscore", "check"], "server");

	api.export('DynamicCollections', 'server');

	api.addFiles('collections/DynamicCollections.js', 'server');
});
