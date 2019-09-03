import {getEle} from './util';
import '../css/img.css'
/**
 * @description 创建图片并填充到指定容器
 * @param {Array} imgList 图片DataURL数组。
 * @param {DOM Object} position  放置预览图片的容器节点
 * @param {Object} imgOption 包含图片的配置信息，高度和宽度，默认auto
 */
let buildImage = (imgList = [], position = getEle("body"), imgOption = {width:'auto',height:'auto'})=>{
  position =  typeof position == 'string' ? getEle(position) : position;
  let imgTpl = position.innerHTML;
  if(!/img/.test(imgTpl)){
    imgTpl = ``;
  }
  imgList.forEach((item)=>{
    imgTpl += `
      <div class="imgWrapper">
        <img src="${item}"/>
        <div class="cropBtnBox">
          <span class="cropBtn" data-src="${item}">裁切</span>
        </div>
      </div>
    `;
  })
  position.innerHTML = imgTpl;
}
/**
 * @description 将图片绘制在画布上
 * @param {String | Object} canvas 画布节点的id或者节点对象
 * @param {String} imgURL 图像的URL
 */
let setImgToCanvas = (canvas, imgURL)=>{
  canvas = typeof canvas == 'string'? getEle(canvasId): canvas;
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  var img = new Image();
  img.onload =()=>{
    canvas.width = img.naturalWidth > canvas.width ? img.naturalWidth : canvas.width;
    canvas.height = img.naturalHeight > canvas.height ? img.naturalHeight : canvas.height;
    ctx.drawImage(img,0, 0);
  }
  img.src = imgURL;
}


export {buildImage, setImgToCanvas}