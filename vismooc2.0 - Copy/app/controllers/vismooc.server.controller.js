'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    data = require('./vismooc/vismooc.main.server.controller.js'),
    wordfreq=require('../lib/wordfreq.worker.js');

/**
 * Create a Vismooc
 */
exports.getContentBasedData = function(req, res) {
        var type=req.query.type;
        var videoId=req.query.videoId;

        var courseId=1;
        var st=-1;
        var et=-1;
        var country='all';
        if(req.query.startTime){
            st=req.query.startTime;
        }
        if(req.query.courseId){
            courseId=req.query.courseId;
        }
        if(req.query.endTime){
            et=req.query.endTime;
        }
        if(req.query.country){
            country=req.query.country;
        }

        functionMap[type](courseId, videoId, st, et, country, function(ret){
            res.send(ret);
            res.end();
        });
};

/**
 * Show the current Vismooc
 */
exports.getCourseList = function(req, res) {
    data.getCourseList(function(results){
        res.send(results);
        res.end();
    })
};

/**
 * Show the current Vismooc
 */
exports.getWordCloudData= function(req, res) {
    var courseId=+req.query.courseId;
    var userId=req.query.userId;
    console.log('enter word cloud data')

    data.getWordCloudData(courseId, userId, function(results){
        var text='';
        for(var i=0;i<results.length;i++){
            text+=results[i].text;
        }
        var options={languages:'english'};
        var ret=wordfreq(options).process(text);

        res.send(ret.slice(0, 100));
        res.end();
    })
};

/**
 * Show the current Vismooc
 */
exports.getWordCloudDataByGeo= function(req, res) {
    var courseId=+req.query.courseId;
    var countryCode=req.query.countryCode;
    console.log('enter word cloud data geo')

    data.getWordCloudDataByGeo(courseId, countryCode, function(results){
        var text='';
        for(var i=0;i<results.length;i++){
            text+=results[i].text;
        }
        var options={languages:'english'};
        var ret=wordfreq(options).process(text);

        res.send(ret.slice(0, 100));
        res.end();
    })
};

/**
 * Update a Vismooc
 */
exports.getFreqArr = function(req, res) {
    var courseId=+req.query.courseId;
    var videoId=req.query.videoId;

    data.getFreqArr(courseId, videoId, function(results){
       res.send(results.sort(function(a, b){
            return (+a)-(+b);
       }));
       res.end();
    })
};

/**
 * Delete an Vismooc
 */
exports.getSentiment = function(req, res) {
    var courseId=+req.query.courseId;

        data.getSentiment(courseId, function(results){
           res.send(results);
           res.end();
        })
};

exports.getSentimentDetails= function(req, res) {
    var courseId=+req.query.courseId;
    var days=+req.query.days;

        data.getSentimentDetails(courseId, days, function(results){
            console.log(results)
           res.send(results);
           res.end();
        })
};

/**
 * List of Vismoocs
 */
exports.getForumSocialNetowrk = function(req, res) {
    var courseId=req.query.courseId;
};


exports.getSeekByFreqRange = function(req, res) {
    var courseId=+req.query.courseId;
        var videoId=req.query.videoId;
        var freqLow=+req.query.freqLow;
        var freqHigh=+req.query.freqHigh;
        console.log(req.query.freqLow+', '+req.query.freqHigh)
        if(freqLow<1)freqLow=1;

        data.getSeekByFreqRange(courseId, videoId, freqHigh, freqLow, function(results){
           res.send(results);
           res.end();
        })
};


exports.getForumList = function(req, res) {
    var courseId=+req.query.courseId;
        data.getForumList(courseId, function(results){
           res.send(results);
           res.end();
        })
};


exports.getHotness = function(req, res) {
    var courseId=req.query.courseId;
        data.getHotness(courseId, function(results){
           res.send(results);
           res.end();
        })
};


exports.getCourseInfo = function(req, res) {
    var courseId=req.query.courseId;
        data.getCourseInfo(courseId, function(results){
           res.send(results[0]);
           res.end();
        })
};


exports.getVideoList = function(req, res) {
    var courseId=+req.query.courseId;
        data.getVideoInfo(courseId, function(results){
            var weekArr=[];
            results.sort(function(a, b){
                var week1=+a.week;
                var week2=+b.week;
                if(week1<week2){
                    return -1;
                }else if(week1>week2){
                    return 1;
                }else if(week1===week2){
                    return +a.date-(+b.date);
                }
            })

            for(var j=0, len=results.length;j<len;j++){
                var flag=false;

                for(var i=0;i<weekArr.length;i++){
                    if(weekArr[i].week==results[j].week){
                        weekArr[i].videos.push(results[j]);
                        flag=true;
                    }
                }
                if(!flag){
                    var weeks={
                        week:results[j].week,
                        videos:[]
                    };
                    weeks.videos.push(results[j]);
                    weekArr.push(weeks);
                }
            }

            res.send(weekArr);
            res.end();
        })
};


exports.getDemographicData = function(req, res) {
    var courseId=+req.query.courseId;
        data.getCountryPop(courseId, function(results){
            res.send(results);
            res.end();
        })
};

exports.getVideoPop = function(req, res) {
    var videoId=req.query.videoId;
        var courseId=+req.query.courseId;

        var hotness=[];

        data.getVideoPop(courseId, videoId, function(result){
            var startDate=Number.POSITIVE_INFINITY;
            var endDate=0;
            for(var i=0;i<result.length;i++){
                if(result[i]['day']<=startDate){
                    startDate=result[i]['day'];
                }
                if(result[i]['day']>=endDate){
                    endDate=result[i]['day'];
                }
                var obj={
                    "date":result[i]['day'],
                    "value":result[i]['count']
                };
                hotness.push(obj);
            }
            var ret={
                "startDate":startDate,
                "endDate":endDate,
                "hotness":hotness
            };
            res.send(ret);
            res.end();
        })
};


// new feature for newVisMooc
exports.dongyutest = function(req, res){
    var videoId = +req.query.videoId;
    var actionType = req.query.actionType;
    data.getNewAction(videoId, actionType, function(result){
        res.send(result);
        res.end();
    });
}

exports.dongyutest2 = function(req, res){
    var videoId = +req.query.videoId;
    var actionType = req.query.actionType;
    var percentage = +req.query.percentage;
    data.getNewAction2(videoId, actionType, function(result){
        result = result.map(function(item){
            var nowCount = 0;
            var upActionNum, upPeopleNum, downActionNum, downPeopleNum;
            var upLimit = Math.floor(item.actionNum*percentage/100.0);
            for (var i = 0, count; count = item.peopleArr[i]; i++){
                if (nowCount >= upLimit)
                    break;
                nowCount += count;
            }
            upActionNum = nowCount;
            upPeopleNum = i;
            downActionNum = item.actionNum - nowCount;
            downPeopleNum = item.peopleArr.length - upPeopleNum; 
            

            return {
                'startTime': item.startTime,
                'endTime': item.endTime,
                'upActionNum': upActionNum, 
                'upPeopleNum': upPeopleNum,
                'downActionNum': downActionNum,
                'downPeopleNum': downPeopleNum 
            }
        });
        res.send(result);
        res.end();
    });
}

exports.getpeakInfo = function(req, res){

    var queryPeakList = req.body.data;
    var length = queryPeakList.length;
    var peaks = [];
    data.getPeakList(queryPeakList, function(result){
        peaks.push(result);
        if (peaks.length == length)
            res.send({
                'result': peaks
            });
    });
    
}

exports.getGlyphInfo = function(req, res){
    var courseId = +req.query.courseId;
    var collectionName =  'glyph';
    data.getGlyphInfo(collectionName, courseId, function(result){
        res.send(result);
    });
}

exports.animationtest = function(req, res){
    var videoId = req.query.videoId;
    var courseId = +req.query.courseId;
    var startTime = +req.query.startTime;
    var endTime = +req.query.endTime;
    var collectionName = "flowmapVideoTimeline";
    data.getNewAnimation(collectionName, videoId, courseId, startTime, endTime, function(result){
        res.send(result);
        res.end();
    });
}

exports.ParallelCoor = function(req, res){
    var courseId = +req.query.courseId;
    var collectionName = 'PC';

    data.getPCData(collectionName, courseId, function(result){
        res.send(result);
        res.end();
    });
}

exports.ParallelCoorVideo = function(req, res){

    data.getPCVideoData(function(result){

        //console.log(result);
        res.send(result);
        res.end();
    });
}

exports.saveBase64Img = function(req, res) {
    var base64Data = req.body.image;
    var now = new Date();
    var fileName = 'public/shotimg/' + now.valueOf() + '.png';
    require("fs").writeFile(fileName, base64Data, 'base64', function(err) {
        console.log(err);
    });
    res.send('save successfully');
    res.end();
};

exports.peakPreviewInfo = function(req, res) {
    var courseId = +req.query.courseId;

    data.getPeakPreviewInfo(courseId, function(result){
        res.send(result);
        res.end();
    });
}

// functionMap: coverage, action, seek

var coverageFunc=function(courseId, videoId, st, et, country, callback){
    data.getCoverage(courseId, videoId, st, et, country, function(results){
        //add up all arrays
        if(results.length==0){
            callback([]);
        }else{
            var vl=results[0].forward.length;
            var coverage=[];
            var backward=[];
            var forward=[];

            for(var i=0;i<vl;i++){
                coverage.push(0);
                backward.push(0);
                forward.push(0);
            }
            for(var i=0;i<results.length;i++){
                var temp=results[i];
                for(var j=0;j<vl;j++){
                    coverage[j]+=temp.coverage[j];
                    forward[j]+=temp.forward[j];
                    backward[j]+=temp.backward[j];
                }
            }
            var obj={
                'forward':forward,
                'backward':backward,
                'coverage':coverage,
            }
            callback(obj);
        }
    })
}

var seekFunc=function(courseId, videoId, st, et, country, callback){
    data.getSeek(courseId, videoId, st, et, country, function(result){
        callback(result);
    })
}


var actionFunc=function(courseId, videoId, st, et, country, callback){
    data.getActionData(courseId, videoId, st, et, country, function(result){
        if(result.length==0){
            callback([]);
        }else{
            var clicks={};
            for(var i=0; i<result.length; i++){
                var clickType=result[i]['type'];

                if(clicks.hasOwnProperty(clickType)){
                    for(var j=0, len=clicks[clickType].length; j<len;j++){
                        clicks[clickType][j]+=result[i].data[j];
                    }
                }else{
                    clicks[clickType]=result[i].data;
                }
            }
            
            var retArr=[];
            for(var ctype in clicks){
                if(clicks.hasOwnProperty(ctype)){
                    var obj={};
                    obj['type']=ctype;
                    obj['data']=clicks[ctype];
                    retArr.push(obj);
                }
            }

            var ret={
                "videoId": videoId,
                "clicks":retArr 
            };
            callback(ret);
        }
    })
}

var functionMap={
    'coverage':coverageFunc,
    'action':actionFunc,
    'seek':seekFunc
};
