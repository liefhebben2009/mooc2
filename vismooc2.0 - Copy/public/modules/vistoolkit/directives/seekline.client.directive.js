'use strict';

angular.module('vistoolkit').directive('seekline', function($window){
return {
        restrict: 'AE',
        scope: {
          seekDataPart: '=',      //chart data, [required]
          seekData: '=',          //chart data, [required]
          option: '=',
          videoLength:'=',
          callMe:'&',
        },
        link: function (scope, element, attr) {

          var renderer, camera, scene;
          var height = element[0].offsetHeight;
          var width = element[0].offsetWidth;
          var videoLength;

          var clearCanvas=function  (name) {
            var count=scene.children.length;

            for(var i=count-1;i>=0;i--){
              if(scene.children[i].name===name)
                scene.remove(scene.children[i]);
            }
            renderer.clear();
          }
          var defineEnv=function () {
            renderer = new THREE.WebGLRenderer({canvas:element[0], alpha:true, antialias:true})
            renderer.setSize(width, height);
            renderer.autoClear = true;
            camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
            camera.position.z=10;
            camera.lookAt(new THREE.Vector3(-0, -0, 0));
            scene = new THREE.Scene();
            clearCanvas();
            // body...
          }();

          var initVideoLength=function(){
            videoLength=scope.videoLength;
          }

          var initData=function(input){

            var toUse={
              forward:[],
              backward:[],
            };

            initVideoLength();
            var toUseTemp=input;

            for(var i=0;i<toUseTemp.length;i++){
              var temp=toUseTemp[i];
              if(temp.currentTime>temp.prevTime){
                toUse.forward.push(temp);
              }else{
                toUse.backward.push(temp);
              }
            }

            return toUse;
          }

               var defineMaterial=function(seek){
                var forward;
                if((seek.currentTime-seek.prevTime)>0){
                  forward="forward";
                }else{
                  forward="not";
                }

                var material;
                if(forward=="forward"){
                  material = new THREE.LineBasicMaterial({
                      color: 0xff7800,
                      linewidth:0.6,
                      opacity:0.1
                  });
                  material.transparent=true;
                }else{
                  material = new THREE.LineBasicMaterial({
                      color: 0x133cac,
                      linewidth:1,
                      opacity:0.1
                  });
                  material.transparent=true;
                }

                return material;
              }
          var drawLine= function(dataToDraw) {

              var lines= new THREE.Geometry();
              for(var i=0;i<dataToDraw.length;i++){
                var temp=dataToDraw[i];
                var x1=temp.prevTime/videoLength*width-width/2;
                var x2=temp.currentTime/videoLength*width-width/2;
                var y1=(temp.prevTime>temp.currentTime)? 0: height/2;
                var y2=(temp.prevTime>temp.currentTime)? -height/2: 0;
                lines.vertices.push(new THREE.Vector3(x1, y1, 0));
                lines.vertices.push(new THREE.Vector3(x2, y2, 0));
              }

              var line=new THREE.Line(lines, defineMaterial(dataToDraw[0]), THREE.LinePieces);
              line.name="line";
              scene.add(line);
              renderer.render(scene, camera);
          }

          var drawAll=function(data){
            var toUse=initData(data);
            clearCanvas("line"); 

            for(var key in toUse){
              if(toUse.hasOwnProperty(key)){
                if(toUse[key].length>0){
                  drawLine(toUse[key]);
                }
              }
            }

          }

          function exitIntro(targetElement) {
              //remove overlay layer from the page
              var overlayLayer = targetElement.querySelector('.introjs-overlay');

              //return if intro already completed or skipped
              if (overlayLayer == null) {
                return;
              }

              //for fade-out animation
              overlayLayer.style.opacity = 0;
              setTimeout(function () {
                if (overlayLayer.parentNode) {
                  overlayLayer.parentNode.removeChild(overlayLayer);
                }
              }, 500);

              //remove all helper layers
              var helperLayer = targetElement.querySelector('.introjs-helperLayer');
              if (helperLayer) {
                helperLayer.parentNode.removeChild(helperLayer);
              }

              //remove intro floating element
              var floatingElement = document.querySelector('.introjsFloatingElement');
              if (floatingElement) {
                floatingElement.parentNode.removeChild(floatingElement);
              }

              //remove `introjs-showElement` class from the element
              var showElement = document.querySelector('.introjs-showElement');
              if (showElement) {
                showElement.className = showElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, ''); // This is a manual trim.
              }

              //remove `introjs-fixParent` class from the elements
              var fixParents = document.querySelectorAll('.introjs-fixParent');
              if (fixParents && fixParents.length > 0) {
                for (var i = fixParents.length - 1; i >= 0; i--) {
                  fixParents[i].className = fixParents[i].className.replace(/introjs-fixParent/g, '').replace(/^\s+|\s+$/g, '');
                };
              }
            }

          scope.api = {
            // refresh: freshData,
            initDraw: drawAll,
          }; 
          scope.$watch('seekData', function(data){
            if (data){
              scope.api.initDraw(data); 
              exitIntro(document)
              scope.callMe();

            }
          }, true);

          scope.$watch('seekDataPart', function(data){
            if (data) {
              scope.api.initDraw(data);
            } 
          }, true);
        }
      };
});

