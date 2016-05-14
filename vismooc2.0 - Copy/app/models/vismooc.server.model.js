'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var actionSchema=new Schema({
    videoId:String,
    code3:String,
    courseId:Number,
    type:String,
    data:[Number],
    timestamp:Number
}, {collection:'actionResultFinal'})

var sentimentDetailsSchema=new Schema({
    days:Number,
    date:String,
    text:String,
    neutral:Number,
    positive:Number,
    courseId:Number,
    code3:String,
}, {collection:'sentimentDetails'})

var sentimentSchema=new Schema({
    days:Number,
    date:String,
    "number":Number,
    neutral:Number,
    positive:Number,
    courseId:Number,
}, {collection:'sentiment'})

var demographicSchema=new Schema({
    courseId:Number,
    count:Number,
    code3: String 
},{collection:'countryPopFinal'});

var videoPopSchema=new Schema({
    courseId:Number,
    videoId:String,
    day:Number,
    count:Number
},{collection:'videoPopFinal'});

var videoInfoSchema=new Schema({
    videoId:String,
    week:Number,
    title:String,
    videoSource:String,
    videoLength: Number,
    date:Number,
    courseId:Number,
    pop:Number,
},{collection:'videoInfoFinal'});

var courseInfoSchema=new Schema({
    courseId:Number,
    courseName:String,
    instructor:String,
    url:String,
    description:String,
    animation:String
},{collection:'courseList'});


var seekSchema=new Schema({
    username:Number,
    videoId:String,
    courseId:Number,
    flag:Number,
    prevTime:Number,
    currentTime:Number,
    timestamp:Number,
    code3:String,
    freq:Number,
    week:Number,
    numberOfVideo:Number,
    sync:Number,
}, {collection:'seekFinal'});


var forumListSchema=new Schema({
    forumId:Number,
    forumName:String,
    forumDescription:String,
    courseId:Number,
},{collection:'forumListFinal'})

var forumPostSchema=new Schema({
    forumId:Number,
    keywords:[{
        word:String,
        freq:Number,
    }],
    courseId:Number,
},{collection:'forumPostFinal'})

var emotionSchema=new Schema({
    word:String,
    happiness:Number,
}, {collection:'wordEmotion'});

var forumPostSchema=new Schema({
    id:Number,
    courseId: Number,
    thread_id:Number,
    forum_user_id:String,
    post_time:Number,
    post_text:String,
    thread_title:String,
    forum_id:Number,
    forum_description:String,
    forum_name:String,
},{collection:'forum_posts_threads_forums'});


var dongyuTestSchema = new Schema({
    '0': Number,
    '1': Number,
    'startTime': Number,
    'endTime': Number,
    'videoId': Number,
    'actionType': String
},{collection:'dongyuTest'});

var dongyuTestSchema2 = new Schema({
    'actionNum': Number,
    'peopleArr': [Number],
    'startTime': Number,
    'endTime': Number,
    'videoId': Number,
    'actionType': String
},{collection:'dongyuTest2'});

var dongyuTestSchema3 = new Schema({
    'peopleName': [Number],
    'startTime': Number,
    'endTime': Number,
    'videoId': Number,
},{collection:'dongyuTest3'});

var glyphSchemaJAVA = new Schema({
    'videoId': String,
    'peakWidth': Number,
    'currentTime': Number,
    'videoLength': Number,
    'grade': [Schema.Types.Mixed],
    'peopleInfo': [Schema.Types.Mixed],
    'actionNum': Number
},{collection:'GlyphFinal_edx'});

var glyphSchemaNCH = new Schema({
    'videoId': Number,
    'peakWidth': Number,
    'currentTime': Number,
    'videoLength': Number,
    'grade': [Schema.Types.Mixed],
    'peopleInfo': [Schema.Types.Mixed],
    'actionNum': Number
},{collection:'GlyphFinal'});

var glyphSchema = new Schema({
    'videoId': String,
    'peakWidth': Number,
    'currentTime': Number,
    'videoLength': Number,
    'grade': [Schema.Types.Mixed],
    'peopleInfo': [Schema.Types.Mixed],
    'actionNum': Number
},{collection:'GlyphAllinOne'});

var flowmapSchemaJAVA = new Schema({
    'count': Number,
    'actionType': String,
    'peakIndex': Number,
    'day': Number,
    'longitude': Number,
    'latitude': Number,
    'code3': String
}, {collection: 'flowmap_edxpp'});

var flowmapSchemaNCH = new Schema({
    'count': Number,
    'actionType': String,
    'peakIndex': Number,
    'day': Number,
    'longitude': Number,
    'latitude': Number,
    'code3': String
}, {collection: 'flowmap'});

var flowmapSchemaVideoTimeline = new Schema({
    //
}, {collection: 'flowmap_slides'});

var ParallelCoorSchemaJAVA = new Schema({
    'userId': Number,
    'country': String,
    //'grade': Number,
    //'reputation': Number,
    'review': Number,
    'delay': Number,
    'Peak0': Number,
    'Peak1': Number,
    'Peak2': Number,
    'Peak3': Number,
    'Peak4': Number,
    'Peak5': Number,
    'Peak6': Number,
    'Peak7': Number,
    'Peak8': Number,
    'Peak9': Number,
    'Peak10': Number,
    'Peak11': Number,
    'Peak12': Number,
    'Peak13': Number,
    'Peak14': Number,
    'Peak15': Number,
    'Peak16': Number,
    'Peak17': Number,
    'Peak18': Number,
    'Peak19': Number,
    'Peak20': Number,
    'Peak21': Number,
    'Peak22': Number,
    'Peak23': Number,
    'Peak24': Number,
    'Peak25': Number,
    'Peak26': Number,
    'Peak27': Number,
    'Peak28': Number,
    'Peak29': Number,
    'Peak30': Number,
    'Peak31': Number
    //'peak32': Number,
    //'peak33': Number,
    //'peak34': Number,
    //'peak35': Number,
    //'peak36': Number,
    //'peak37': Number,
    //'peak38': Number,
    //'peak39': Number,
    //'peak40': Number
}, {collection: 'YuanzhePC_edx'});

var ParallelCoorSchemaNCH = new Schema({
    'userId': Number,
    'country': String,
    //'grade': Number,
    //'reputation': Number,
    'review': Number,
    'delay': Number,
    'Peak0': Number,
    'Peak1': Number,
    'Peak2': Number,
    'Peak3': Number,
    'Peak4': Number,
    'Peak5': Number,
    'Peak6': Number,
    'Peak7': Number,
    'Peak8': Number,
    'Peak9': Number,
    'Peak10': Number,
    'Peak11': Number,
    'Peak12': Number,
    'Peak13': Number,
    'Peak14': Number,
    'Peak15': Number,
    'Peak16': Number,
    'Peak17': Number,
    'Peak18': Number,
    'Peak19': Number,
    'Peak20': Number,
    'Peak21': Number,
    'Peak22': Number,
    'Peak23': Number,
    'Peak24': Number,
    'Peak25': Number,
    'Peak26': Number,
    'Peak27': Number,
    'Peak28': Number,
    'Peak29': Number,
    'Peak30': Number,
    'Peak31': Number,
    'peak32': Number,
    'peak33': Number,
    'peak34': Number,
    'peak35': Number,
    'peak36': Number,
    'peak37': Number,
    'peak38': Number,
    'peak39': Number,
    'peak40': Number
}, {collection: 'YuanzhePC'});

var ParallelCoorVideoSchema = new Schema({
    'userId': Number,
    'country': String,
    'grade': Number,
    'reputation': Number,
    'seeked': Number,
    'video3': [Schema.Types.Mixed],
    'video5': [Schema.Types.Mixed],
    'video7': [Schema.Types.Mixed],
    'video9': [Schema.Types.Mixed],
    'video11': [Schema.Types.Mixed],
    'video13': [Schema.Types.Mixed],
    'video15': [Schema.Types.Mixed],
    'video17': [Schema.Types.Mixed],
    'video19': [Schema.Types.Mixed],
    'video21': [Schema.Types.Mixed],
    'video23': [Schema.Types.Mixed],
    'video25': [Schema.Types.Mixed],
    'video27': [Schema.Types.Mixed],
    'video29': [Schema.Types.Mixed],
    'video31': [Schema.Types.Mixed],
    'video33': [Schema.Types.Mixed],
    'video35': [Schema.Types.Mixed]
}, {collection: 'YuanzhePCFinal'});

var ParallelCoorSchema = new Schema({
    'userId': Number,
    'country': String,
    'grade': Number,
    'reputation': Number,
    'review': Number,
    'delay': Number,
    'loyalty': Number,
    'dropTime': Number,
    'forumPosts': Number,
    'peaks': [Schema.Types.Mixed]
}, {collection: 'PCAllinone'});

var peakInfoSchema = new Schema({
    'courseId': Number,
    'imgPath': String,
    'peaks': [Schema.Types.Mixed]
}, {collection: 'peakInfo'});

mongoose.model('action', actionSchema);
mongoose.model('forumPost', forumPostSchema);
mongoose.model('forumList', forumListSchema);
mongoose.model('videoPop',videoPopSchema);
mongoose.model('countryPop', demographicSchema);
mongoose.model('videoInfo', videoInfoSchema);
mongoose.model('courseInfo', courseInfoSchema);
mongoose.model('seek', seekSchema);
mongoose.model('wordEmotion', emotionSchema);
mongoose.model('sentiment', sentimentSchema);
mongoose.model('sentimentDetails', sentimentDetailsSchema);
mongoose.model('dongyuTest', dongyuTestSchema);
mongoose.model('dongyuTest2', dongyuTestSchema2);
mongoose.model('dongyuTest3', dongyuTestSchema3);
mongoose.model('glyphJAVA', glyphSchemaJAVA);
mongoose.model('glyphNCH', glyphSchemaNCH);
mongoose.model('glyph', glyphSchema);
mongoose.model('flowmapJAVA', flowmapSchemaJAVA);
mongoose.model('flowmapNCH', flowmapSchemaNCH);
mongoose.model('flowmapVideoTimeline', flowmapSchemaVideoTimeline);
mongoose.model('YuanzhePCJAVA', ParallelCoorSchemaJAVA);
mongoose.model('YuanzhePCNCH', ParallelCoorSchemaNCH);
mongoose.model('PCVideo', ParallelCoorVideoSchema);
mongoose.model('PC', ParallelCoorSchema);
mongoose.model('peakInfo', peakInfoSchema);

