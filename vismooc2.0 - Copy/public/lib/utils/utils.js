/**
 * Created by conglei on 20/2/14.
 */
Date.prototype.customFormat = function(formatString){
  var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
  var dateObject = this;
  YY = ((YYYY=dateObject.getFullYear())+"").slice(-2);
  MM = (M=dateObject.getMonth()+1)<10?('0'+M):M;
  MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
  DD = (D=dateObject.getDate())<10?('0'+D):D;
  DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()]).substring(0,3);
  th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
  formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);

  h=(hhh=dateObject.getHours());
  if (h==0) h=24;
  if (h>12) h-=12;
  hh = h<10?('0'+h):h;
  AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
  mm=(m=dateObject.getMinutes())<10?('0'+m):m;
  ss=(s=dateObject.getSeconds())<10?('0'+s):s;
  return formatString.replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
}

String.prototype.formatDate = function (formatString) {

  var sec_num = parseInt(this, 10); // don't forget the second param
//    console.log(sec_num)
  var now = new Date(sec_num);


  return now.customFormat(formatString);
}

Array.prototype.aggregate =  function(num){
  var length =  this.length;
  var newArray = [];
  var sum = 0;
  for (var i = 0 ; i < length; i++){
    sum += this[i];
    if ((i+1) % num == 0) {
      newArray.push(sum / num);
      sum = 0;
    }
  }
  if (length % num !=0) newArray.push(sum/length%num);
  return newArray;
};

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


d3.scale.actionCategory = function() {
  return d3.scale.ordinal().range(d3_actionCategory);
};

var d3_actionCategory = [
  '#1f77b4', '#fdae6b', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b'
//  '#2ca02c', '#fdae6b','#1f77b4',  '#8c564b','#d62728', '#9467bd'
];


var d3_typeColorCategory = [
  '#3288bd','#1a9850','#9764bd','#3288bd'
];

d3.scale.typeColor = function(){
  return d3.scale.ordinal().range(d3_typeColorCategory);
};


var d3_pattern = [
  '#Pat01','#Pat02','#Pat04','#Pat03'
]

d3.scale.patterns = function(){
  return d3.scale.ordinal().range(d3_pattern);
};
