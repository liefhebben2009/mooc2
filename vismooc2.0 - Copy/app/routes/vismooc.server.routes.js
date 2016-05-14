'use strict';

module.exports = function(app) {
	// Routing logic   
	// ...
	var vismoocCtrl = require('../../app/controllers/vismooc.server.controller');

	// Setting up the users profile api
	app.route('/getContentBasedData').get(vismoocCtrl.getContentBasedData);

	app.route('/getCourseList').get(vismoocCtrl.getCourseList);

	app.route('/getFreqArr').get(vismoocCtrl.getFreqArr);

	app.route('/getSentiment').get(vismoocCtrl.getSentiment);

	app.route('/getSentimentDetails').get(vismoocCtrl.getSentimentDetails);

	app.route('/getWordCloudData').get(vismoocCtrl.getWordCloudData);

	app.route('/getWordCloudDataByGeo').get(vismoocCtrl.getWordCloudDataByGeo);

	app.route('/getForumSocialNetowrk').get(vismoocCtrl.getForumSocialNetowrk);

	app.route('/getSeekByFreqRange').get(vismoocCtrl.getSeekByFreqRange);

	app.route('/getForumList').get(vismoocCtrl.getForumList);

	app.route('/getHotness').get(vismoocCtrl.getHotness);

	app.route('/getCourseInfo').get(vismoocCtrl.getCourseInfo);

	app.route('/getVideoList').get(vismoocCtrl.getVideoList);

	app.route('/getDemographicData').get(vismoocCtrl.getDemographicData);

	app.route('/getVideoPop').get(vismoocCtrl.getVideoPop);

	app.route('/dongyutest').get(vismoocCtrl.dongyutest);

	app.route('/dongyutest2').get(vismoocCtrl.dongyutest2);

	app.route('/getpeakInfo').post(vismoocCtrl.getpeakInfo);

	app.route('/getGlyphInfo').get(vismoocCtrl.getGlyphInfo);

	app.route('/animationtest').get(vismoocCtrl.animationtest);

	app.route('/ParallelCoor').get(vismoocCtrl.ParallelCoor);

    app.route('/ParallelCoorVideo').get(vismoocCtrl.ParallelCoorVideo);

    app.route('/saveBase64Img').post(vismoocCtrl.saveBase64Img);
    
    app.route('/peakPreviewInfo').get(vismoocCtrl.peakPreviewInfo);
};
