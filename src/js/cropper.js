import {bindEvent,unbindEvent,getMouseXY} from './util';
import resizePlugin from './resizeBox';
import "../css/cropper.css"
class Canvas{
  //构造函数
  constructor(config={canvas:null,canvasParentBox:null, cropBox: null}){
    if(!config.canvas){console.error("缺少Canvas配置参数");return false;}
    this.config = config;
    this.canvasParentBox = config.canvasParentBox; //画布父容器
    this.cropBox = config.cropBox;    //裁切器容器
    this.canvas = config.canvas;    //画布
    this.cropBtn = config.cropBtn;  //执行裁切的按钮
    this.clearBtn = config.clearBtn; //清空画布内容
    this.saveJPGBtn = config.saveJPGBtn; //保存画布内容
    this.savePNGBtn = config.savePNGBtn; //保存画布内容
    this.ctx = this.canvas.getContext('2d'); //画布上下文
    this.historyDrawStack = [];     //用于resize来重选染画布内容，防止变空。
    //设置参数
    this.setBasicData();
    this.sayHello();
  };
  
  //设置背景填充色
  setfillColor(clr="#ffffff",width = this.canvas.width, height = this.canvas.height){
    this.ctx.fillStyle = clr;
    this.ctx.fillRect(0, 0, width, height);
  }
  //设置基础参数
  setBasicData(manualReset = null){
    if(manualReset){
      this.cropBox.style.left= `0px`;
      this.cropBox.style.top= `0px`;
      this.canvasParentBox.style.cssText=`width:${manualReset.width || this.getWinWidth()}px;height:${manualReset.height || 500}px`;
      this.canvas.width = this.getWinWidth();
      this.canvas.height = manualReset.height || 500;
    }else{
      this.canvasParentBoxStyle = window.getComputedStyle(this.canvasParentBox);
      this.canvas.width = this.getWinWidth();
      this.canvas.height =this.canvas.height <= 500 ? 500 :  parseInt(this.canvasParentBoxStyle.height) ;
    }
    this.freshCropBoxWHTL();
  }
  //获取window innerWidth
  getWinWidth(offsetWidth = 45){
    return (parseInt(window.innerWidth) - offsetWidth)
  }
  //刷新并返回裁切器的宽高
  freshCropBoxWHTL(){
    this.cropBoxStyle = window.getComputedStyle(this.cropBox);
    this.cropBoxW = parseInt(this.cropBoxStyle.width);
    this.cropBoxH = parseInt(this.cropBoxStyle.height);
    this.cropBoxT = parseInt(this.cropBoxStyle.top);
    this.cropBoxL = parseInt(this.cropBoxStyle.left);
    return {W:this.cropBoxW, H:this.cropBoxH, top:this.cropBoxT, left: this.cropBoxL};
  };
  //保存当前绘图快照
  saveDrawStatus(){
    this.historyDrawStack.push(this.canvas.toDataURL());
  };
  //恢复绘图快照
  restoreDarwStatus(){
    let img = new Image();
    img.onload = ()=>{
      this.ctx.drawImage(img,0, 0);
    }
    img.src = this.historyDrawStack.pop();
  }
  //设置初始问候语
  sayHello(){
    this.ctx.fillStyle="#aaa";
    this.ctx.beginPath();
    this.ctx.font = "48px serif";
    this.ctx.fillText("欢迎使用FoxImageCropper", this.canvas.width / 2 - 200, this.canvas.height / 2 - 25 );
    this.ctx.beginPath();
    this.ctx.font = "20px serif";
    this.ctx.fillText("https://github.com/forrestyuan", this.canvas.width / 2 - 60, this.canvas.height / 2 + 60 );
  }
  //更新裁切框宽高
  updateCropWH(){
    if(this.config.showCropH){
      this.config.showCropH.innerHTML = this.cropBoxH;
    }
    if(this.config.showCropW){
      this.config.showCropW.innerHTML = this.cropBoxW;
    }
  }
}

//鼠标点击裁切器时句柄 (改变大小)
let cropperMousedownResizeHandler = (e, canvasObj) =>{
  e = e || window.event;
  let evTarget = e.target || e.srcElement;
  let evTargetCls = evTarget.getAttribute("class");
  if(!/crop_dot/.test(evTargetCls)){
    return false;
  }
  console.log("yes you click resize")
  let resizeFromPos = resizePlugin.judgeResizeTrigger(evTargetCls); // 0 - 8
  let preMouse = getMouseXY(e);
  let cropBoxMouseMoveHandler;
  bindEvent(window,'mousemove', cropBoxMouseMoveHandler =  ev=>{
    ev = ev || window.event;
    let curMouse = getMouseXY(ev);
    let [crMouseX, crMouseY, ] = [(curMouse.x - preMouse.x), (curMouse.y - preMouse.y)];
    let [absCrMouseX, absCrMouseY] = [Math.abs(crMouseX),Math.abs(crMouseY)];
    let cropBoxStyle = canvasObj.freshCropBoxWHTL();
    let res = {width:cropBoxStyle.W, height: cropBoxStyle.H, top:cropBoxStyle.top, left:cropBoxStyle.left};
    switch(resizeFromPos){
      case 1 :
        res.height = cropBoxStyle.H - crMouseY; 
        res.width =  cropBoxStyle.W - crMouseX;
        res.left = crMouseX < 0 ? cropBoxStyle.left - absCrMouseX : cropBoxStyle.left + absCrMouseX;
        res.top = crMouseY < 0 ? cropBoxStyle.top - absCrMouseY : cropBoxStyle.top + absCrMouseY;
        break; // left top xy
      case 2 :
        res.height = cropBoxStyle.H + crMouseY; 
        res.width =  cropBoxStyle.W - crMouseX;
        res.left = crMouseX < 0? cropBoxStyle.left - absCrMouseX : cropBoxStyle.left + absCrMouseX;      
        break; // left bottom xy
      case 3 : 
        res.height = cropBoxStyle.H - crMouseY; 
        res.width =  cropBoxStyle.W + crMouseX;
        res.top = crMouseY < 0 ? cropBoxStyle.top - absCrMouseY : cropBoxStyle.top + absCrMouseY;      
        break; // right  top xy
      case 4 : 
        res.height = cropBoxStyle.H + crMouseY; 
        res.width =  cropBoxStyle.W + crMouseX;      
        break; // right bottom xy
      case 5 : 
        res.height = cropBoxStyle.H - crMouseY; 
        res.top = crMouseY < 0 ? cropBoxStyle.top - absCrMouseY : cropBoxStyle.top + absCrMouseY;      
        break;//  top y
      case 6 : 
        res.height = cropBoxStyle.H + crMouseY;       
        break;// bottom y
      case 7 : 
        res.width =  cropBoxStyle.W - crMouseX;
        res.left = crMouseX < 0? cropBoxStyle.left - absCrMouseX : cropBoxStyle.left + absCrMouseX;      
        break;// left x
      case 8 : 
        res.width =  cropBoxStyle.W + crMouseX;      
        break;// right x
      default:break;
    }
    resizePlugin.setBoxWH(canvasObj.canvas,canvasObj.cropBox,res.width, res.height, res.left, res.top);
    preMouse = getMouseXY(ev);
    canvasObj.updateCropWH();
  });
  bindEvent(window,'mouseup',()=>unbindEvent(window,'mousemove',cropBoxMouseMoveHandler));
}

//鼠标点击裁切器时句柄（移动位置）
let cropperMouseDownMoveHandler = (e, canvasObj) =>{
  e = e || window.event;
  e.stopPropagation();
  let evTarget = e.target || e.srcElement;
  let evTargetCls = evTarget.getAttribute("class");
  if(/(crop_dot)/.test(evTargetCls)){
    return false;
  }
  let preMouse = getMouseXY(e);
  let moveCropper;
  bindEvent(canvasObj.cropBox, 'mousemove', moveCropper = ev=>{
    canvasObj.freshCropBoxWHTL();
    ev= ev || window.event;
    ev.stopPropagation();
    let top = canvasObj.cropBoxT;
    let left = canvasObj.cropBoxL;
    let curMouse = getMouseXY(ev);
    let [crMouseX, crMouseY] = [(curMouse.x - preMouse.x), (curMouse.y - preMouse.y)]; 
    top += crMouseY;
    left += crMouseX;
    let res = resizePlugin.judgeIsRangeOut(canvasObj.cropBox, canvasObj.canvasParentBox);
    if(res.isOutRange.top){top = 0;}
    if(res.isOutRange.right){left = canvasObj.canvas.width - canvasObj.cropBoxW;}
    if(res.isOutRange.bottom){top = canvasObj.canvas.height - canvasObj.cropBoxH;}
    if(res.isOutRange.left){left = 0;}
    canvasObj.cropBox.style.cssText =`left:${left}px;top:${top}px;width:${canvasObj.cropBoxW}px;height:${canvasObj.cropBoxH}px;`;
    preMouse = curMouse;
  });
  bindEvent(canvasObj.cropBox,'mouseup', ()=>unbindEvent(canvasObj.cropBox,'mousemove',moveCropper));


}
// 窗口大小改变时画布变化句柄
let resizeWindowHandler = (e,canvasObj)=>{
  e = e|| window.event;
  let target = e.target || e.srcElement;
  if(target.innerWidth < canvasObj.canvas.width){
    return;
  }
  if(target.innnerHeight < canvasObj.canvas.height){
    return;
  }
  canvasObj.saveDrawStatus();
  canvasObj.setBasicData();
  canvasObj.restoreDarwStatus();
  
}

// 清空画布
let clearCanvasHandler = (e, canvasObj) => {
  if(!confirm("是否清空画布")){
    return;
  }
  canvasObj.ctx.clearRect(0, 0, canvasObj.canvas.width, canvasObj.canvas.height);
  canvasObj.setBasicData({width:false,height:false});
  canvasObj.sayHello();
}
//裁切动作
let cropCanvasHandler = (e, canvasObj)=>{
  if(!confirm("是否裁切画布")){
    return;
  }
  let cropParam =  canvasObj.freshCropBoxWHTL();
  let myImageData = canvasObj.ctx.getImageData(cropParam.left, cropParam.top,cropParam.W, cropParam.H);
  canvasObj.setBasicData({width:cropParam.W, height:cropParam.H});
  canvasObj.ctx.putImageData(myImageData, 0, 0);

  let PNGURL = canvasObj.canvas.toDataURL('image/png');
  canvasObj.saveDrawStatus();
  canvasObj.setfillColor();
  canvasObj.restoreDarwStatus();
  let JPGURL = canvasObj.canvas.toDataURL('image/jpeg',1);
  canvasObj.saveJPGBtn.href=JPGURL;
  canvasObj.savePNGBtn.href=PNGURL;
}


//程序运行入口方法
let cropperRun = (paramObj)=>{
  let canvasObj = new Canvas(paramObj);
  //cropper resize 事件
  bindEvent(canvasObj.cropBox, "mousedown", e=>cropperMousedownResizeHandler(e, canvasObj));
  bindEvent(canvasObj.cropBox, "mousedown", e=>cropperMouseDownMoveHandler(e, canvasObj));
  bindEvent(window,'resize',e=>resizeWindowHandler(e, canvasObj));
  bindEvent(canvasObj.clearBtn, "click", e=>clearCanvasHandler(e, canvasObj));
  bindEvent(canvasObj.cropBtn, 'click', e=>cropCanvasHandler(e, canvasObj));
  canvasObj.updateCropWH();
}

export default cropperRun;