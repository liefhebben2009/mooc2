'use strict';

module.exports = {
	app: {
		title: 'peekVisor',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3005,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/vismoocjs/css/bootstrap-responsive.min.css',
				'public/lib/vismoocjs/css/jquery-ui.css',
				'public/lib/nvd3/nv.d3.css',
				'public/lib/vismoocjs/css/style_ext.css',
				'public/lib/vismoocjs/icomoon/style.css',
				'public/lib/vismoocjs/css/bootstrap-additions.css',
				'http://vjs.zencdn.net/4.12/video-js.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/vismoocjs/jquery-ui.min.js',
				'public/lib/jquery.transit/jquery.transit.js',
				'public/lib/html2canvas/dist/html2canvas.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/bootstrap/js/slider.js',

				'public/lib/vismoocjs/ui-bootstrap-button-tpls.min.js',
				'public/lib/vismoocjs/ui-bootstrap-button.min.js',
				'public/lib/vismoocjs/angular-strap.js',
				'public/lib/vismoocjs/angular-strap.tpl.js',

				'public/lib/d3/d3.js',
				'public/lib/d3/d3.parcoords_1.js',
                'public/lib/d3/d3.geom.nhull.js',
				'public/lib/vismoocjs/d3.layout.cloud.js',
				'public/lib/nvd3/nv.d3.js',
				'public/lib/angular-nvd3/dist/angular-nvd3.js',

				'public/lib/utils/utils.js',
				'public/lib/utils/numeric-1.2.6.js',
				'public/lib/utils/mds.js',

				'public/lib/vismoocjs/cal-heatmap.js',
				'public/lib/videogular/videogular.js',
				'public/lib/videogular-controls/vg-controls.js',
				'public/lib/videogular-overlay-play/vg-overlay-play.js',
				'public/lib/vismoocjs/three.min.js',
				'public/lib/vismoocjs/jquery-ui.custom.js',
				'public/lib/vismoocjs/jquery.ui.slider.js',
				'public/lib/vismoocjs/slider.js',
				'http://vjs.zencdn.net/4.12/video.js',
				'public/lib/vismoocjs/topojson.js',
				'public/lib/datamaps/dist/datamaps.world.js',
				'public/lib/vismoocjs/BezierUtils.js',
                'public/lib/vismoocjs/sylvester.js',
                'public/lib/vismoocjs/power_.js',
                'public/lib/vismoocjs/wordcloud2.js'
            ]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
