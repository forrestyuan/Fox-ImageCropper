import "../css/index.css";
import {buildImage, setImgToCanvas} from './img';
import {getEle,bindEvent} from './util';
import cropperRun from './cropper'

// file loading handler
let fileLoadHandler = function(imgList = [], canvas, canvasPtBox, cropBox, placeImgPos = null){
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
        setImgToCanvas(canvas,canvasPtBox, cropBox,imgURL);
    }
  })
}


window.onload =  function(){
  let paramObj = {
    canvas: getEle("#canvas"),
    canvasParentBox:getEle(".crop_wrapper"),
    cropBox: getEle(".cropBox"),
    cropBtn: getEle("#cropBtn"),
    clearBtn: getEle("#clearBtn"),
    saveJPGBtn: getEle("#saveJPGBtn"),
    savePNGBtn: getEle("#savePNGBtn"),
    bgColorBtn: getEle("#bgColor"),
    showCropW: getEle("#showCropW"),
    showCropH: getEle("#showCropH")
  }
  cropperRun(paramObj);
  var fileEle = getEle("#imageFile");
  fileEle.onchange = function(){
    fileLoadHandler(fileEle.files, paramObj.canvas, paramObj.canvasParentBox,paramObj.cropBox,getEle("#previewImgBox"));
  }
}
