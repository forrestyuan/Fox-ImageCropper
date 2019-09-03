import "../css/index.css";
import {buildImage, setImgToCanvas} from './img';
import {getEle,bindEvent} from './util';
import cropperRun from './cropper'

// file loading handler
let fileLoadHandler = function(imgList = [], canvas, placeImgPos = null){
  for(let i = 0; i < imgList.length; i++){
    let fileReader = new FileReader();
    let fileItem = imgList.item(i);
    fileReader.onload = e=> buildImage([e.target.result], placeImgPos);
    fileReader.readAsDataURL(fileItem);
  }
  bindEvent(placeImgPos, "click", ev => {
    ev = ev || window.event;
    let trigger = ev.target || ev.srcElement;
    if(/cropBtn/.test(trigger.getAttribute("class"))){
        var imgURL = trigger.getAttribute("data-src");
        setImgToCanvas(canvas, imgURL);
    }
  })
}


window.onload =  function(){
  let paramObj = {
    canvas: getEle("#canvas"),
    canvasParentBox:getEle(".crop_wrapper"),
    cropBox: getEle(".cropBox")
  }
  cropperRun(paramObj);

  
  var fileEle = getEle("#imageFile");
  var previewImgBox= getEle("#previewImgBox");
  fileEle.onchange = function(){
    fileLoadHandler(fileEle.files, paramObj.canvas, previewImgBox);
  }
}
