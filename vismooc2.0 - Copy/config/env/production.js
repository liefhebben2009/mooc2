'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/newVisMooc',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/vismoocjs/css/bootstrap-responsive.min.css',
				'public/lib/vismoocjs/intro.js/introjs.css',
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

				'public/lib/vismoocjs/intro.js/minified/intro.min.js',
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
				// 'public/lib/vismoocjs/webgl-heatmap.js',
				'public/lib/vismoocjs/three.min.js',
				'public/lib/vismoocjs/jquery-ui.custom.js',
				'public/lib/vismoocjs/jquery.ui.slider.js',
				'public/lib/vismoocjs/slider.js',
				'http://vjs.zencdn.net/4.12/video.js',
				'public/lib/vismoocjs/topojson.js',
				// 'public/lib/vismoocjs/datamaps.world.js',
				'public/lib/datamaps/dist/datamaps.world.js',
				'public/lib/vismoocjs/BezierUtils.js',
                'public/lib/vismoocjs/sylvester.js',
                'public/lib/vismoocjs/power_.js',
                'public/lib/vismoocjs/treemap.js',
                'public/lib/vismoocjs/wordcloud2.js'
            ]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
