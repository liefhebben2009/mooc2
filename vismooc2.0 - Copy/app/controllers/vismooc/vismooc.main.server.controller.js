'use strict';

var mongoose = require('mongoose');


module.exports.getVideoInfo=function(_courseId, callback){
    var tuple=mongoose.model('videoInfo');
    tuple.find({courseId:_courseId}).exec(function(err, results){
        if(err) console.log(err);
        else{
           callback(results); 
        }
    })
}

module.exports.getCountryPop=function(_courseId, callback){
    var tuple=mongoose.model('countryPop');
    tuple.find({courseId:_courseId}).select('code3 count').exec(function(err, results){
        if(err) console.log(err);
        else{
           callback(results); 
        }
    })
}

module.exports.getWordCloudData=function(_courseId, _userId, callback){
    var tuple=mongoose.model('sentimentDetails');
    tuple.find({courseId:_courseId, userId:_userId}).exec(function(err, results){
        console.log(_userId)
        if(err) console.log(err);
        else{
           callback(results); 
        }
    })
}

module.exports.getWordCloudDataByGeo=function(_courseId, _code3, callback){
    var tuple=mongoose.model('sentimentDetails');
    tuple.find({courseId:_courseId, code3:_code3}).exec(function(err, results){
        console.log(_code3)
        if(err) console.log(err);
        else{
           callback(results); 
        }
    })
}
module.exports.getSentimentDetails=function(_courseId, _days, callback){
    var tuple=mongoose.model('sentimentDetails');
    tuple.find({courseId:_courseId, days:_days}).exec(function(err, results){
        if(err) console.log(err);
        else{
           callback(results); 
        }
    })
}
module.exports.getSentiment=function(_courseId, callback){
    var tuple=mongoose.model('sentiment');
    tuple.find({courseId:_courseId}).exec(function(err, results){
        if(err) console.log(err);
        else{
           callback(results); 
        }
    })
}

module.exports.getCourseList=function(callback){
    var tuple=mongoose.model('courseInfo');
    tuple.find({}).exec(function(err, results){
        if(err) console.log(err);
        else{
           callback(results); 
        }
    })
}

module.exports.getCourseInfo=function(_courseId, callback){
    var tuple=mongoose.model('courseInfo');
    tuple.find({courseId:_courseId}).exec(function(err, results){
        if(err) console.log(err);
        else{
           callback(results); 
        }
    })
}

module.exports.getHotness=function(_courseId, callback){
    var tuple=mongoose.model('videoInfo');
    tuple.find({courseId:_courseId}).select('videoId pop title date').exec(function(err, results){
        if(err) console.log(err);
        else{
            callback(results.sort(function(a, b){
                return (+a.date)-(+b.date);
            })); 
        }
    })
}

module.exports.getVideoLength=function(_courseId, _videoId, callback){
    var tuple=mongoose.model('videoInfo');
    tuple.find({courseId:_courseId, videoId:_videoId}).exec(function(err, results){
        if(err) console.log(err);
        else{
            callback(results[0].videoLength); 
        }
    })
}


module.exports.getSeek=function(_courseId, _videoId, _starttime, _endtime, _country, callback){
	var tuple=mongoose.model('seek');

    var courseidQ={'courseId':_courseId};
	var videoidQ={'videoId':_videoId};
    var countryQ={'code3':_country};
    var timestampQ={'timestamp':{$gte:_starttime, $lte: _endtime}};
    if(_country==='all'){
        countryQ={};
    }
    if(_starttime==-1){
        timestampQ={};
    }

	tuple.find({$and:[courseidQ, videoidQ, countryQ, timestampQ]})
        // .select('username prevTime currentTime week freq')
        .select('username prevTime currentTime week freq numberOfVideo sync')
        .limit(10000).exec(function (err, results) {
		if (err) {console.log(err)}
		else{
            //console.log(results.length)
            callback(results);
		}
	});
}

module.exports.getCoverage=function(_courseId, _videoId, _starttime, _endtime, _country, callback){
	var tuple=mongoose.model('coverage');

    var courseidQ={'courseId':_courseId};
	var videoidQ={'videoId':_videoId};
    var countryQ={'code3':_country};
    var timestampQ={'timestamp':{$gte:_starttime, $lte: _endtime}};

	tuple.find({$and:[courseidQ, videoidQ, countryQ, timestampQ]}).exec(function (err, results) {
		if (err) {console.log(err)}
		else{
			callback(results);
		}
	});
}

module.exports.getActionData=function(_courseId, _videoId, _starttime, _endtime,  _country, callback){
	var tuple=mongoose.model('action');

	var videoidQ={'videoId':_videoId};
    var courseidQ={'courseId':_courseId};
    var countryQ={'code3':_country};
    var timestampQ={'timestamp':{$gte:_starttime, $lte: _endtime}};

	tuple.find({$and:[courseidQ, videoidQ, countryQ, timestampQ]}).select('type data').exec(function (err, results) {
		if (err) {console.log(err)}
		else{
			callback(results);
		}
	});
}

module.exports.getVideoPop=function(_courseId, _videoid, callback){
	var tuple=mongoose.model('videoPop');
	tuple.find({'courseId':_courseId, 'videoId':_videoid}).select('day count').exec(function(err, results){
		if (err) {console.log(err)}
		else{
			callback(results);
		}
	})
}

module.exports.getForumList=function(_courseId, callback){
	var tuple=mongoose.model('forumList');
	tuple.find({courseId:_courseId}).exec(function(err, results){
		if (err) {console.log(err)}
		else{
			callback(results);
		}
	})
}

module.exports.getForumPost=function(_courseId, callback){
	var tuple=mongoose.model('forumPost');
	tuple.find({courseId:_courseId}).select('post_text post_time').exec(function(err, results){
		if (err) {console.log(err)}
		else{
			callback(results);
		}
	})
}

module.exports.getWordEmotion=function(callback){
    var tuple=mongoose.model('wordEmotion');
    tuple.find({}).exec(function(err, results){
        if (err) {console.log(err)}
        else{
            callback(results);
        }
    })
}

// new feature for newVisMooc
module.exports.getNewAction = function(_videoid , _actionType, callback){
    var tuple = mongoose.model('dongyuTest');
    tuple.find({'videoId': _videoid, 'actionType': _actionType}).sort({ 'startTime': 1}).exec(function(err, results){
        if (err) {
            console.log(err);
        } else {
            callback(results);
        }
    });
}

module.exports.getNewAction2 = function(_videoid , _actionType, callback){
    var tuple = mongoose.model('dongyuTest2');
    tuple.find({'videoId': _videoid, 'actionType': _actionType}).sort({ 'startTime': 1}).exec(function(err, results){
        if (err) {
            console.log(err);
        } else {
            callback(results);
        }
    });
}

module.exports.getPeakList = function(peakList, callback){
    var tuple = mongoose.model('dongyuTest3');
    for (var i = 0, peak, length = peakList.length; peak = peakList[i]; i++){
        // console.log('i: ' + i.toString() + '  length:' + length.toString());
        tuple.findOne({'videoId': +peak.videoId, 'startTime': {$lte: +peak.currentTime}, 'endTime': {$gte: +peak.currentTime}}).exec(function(err, result){
                callback(result);
            }
        );
    }
}

module.exports.getGlyphInfo = function(colName, courseId, callback){
    var tuple = mongoose.model(colName);
    tuple.find({'courseId': courseId}).exec(function(err, result){
        callback(result);
    });
}

module.exports.getNewAnimation = function(colName, _videoId, _courseId, _startTime, _endTime, callback){
    var tuple = mongoose.model(colName);
    tuple.find({'videoName': _videoId, 'courseId': _courseId, $and: [{'startTime': {$gte: _startTime}}, {'startTime': {$lte: _endTime}}]}).exec(function(err, results){
        if (err) {
            console.log(err);
        } else {
            callback(results);
        }
    });
}

module.exports.getPCData = function(colName, courseId, callback){
    var tuple = mongoose.model(colName);

    tuple.find({'courseId': courseId}).exec(function(err, results){
        if (err) {
            console.log(err);
        } else {
            callback(results);
        }
    });
}

module.exports.getPCVideoData = function(callback){
    var tuple = mongoose.model('PCVideo');

    tuple.find({}).exec(function(err, results){
        if (err) {
            console.log(err);
        } else {
            callback(results);
        }
    });

}

module.exports.getPeakPreviewInfo = function(_courseId, callback) {
    var tuple = mongoose.model('peakInfo');

    tuple.find({'courseId': _courseId}).exec(function(err, results){
        //tuple.find({}).exec(function(err, results){
        if (err) {
            console.log(err);
        } else {
            callback(results);
            //console.log(_startTime);
        }
    });
}
