//返回鼠标位置
let getMouseXY = function (e) {
  return {
    x: e.pageX || e.clientX,
    y: e.pageY || e.clientY
  }
}

//返回屏幕宽高
let getScreenWH = function () {
  return {
    w: document.documentElement.clientWidth || document.body.clientWidth,
    h: document.documentElement.clientHeight || document.body.clientHeight
  }
}
//封装获取元素
let getEle = (function (obj) {
  return function (ele, isList = false) {
    return isList ? obj.querySelectorAll(ele) : obj.querySelector(ele);
  }
})(window.document);

//封装事件绑定
let bindEvent = function (target, eventName, handler) {
  if (!target) {
    console.error(`事件绑定的目标对象为空或未无法绑定事件的对象：${target}`);
    return false;
  }
  if (window.addEventListener) {
    target.addEventListener(eventName, handler, false);
  } else if (window.attachEvent) {
    target.attachEvent(`on${eventName}`, handler);
  } else {
    target[`on${eventName}`] = handler;
  }
};

//封装事件取消绑定
let unbindEvent = function (target, eventName,handler) {
  if (!target) {
    console.error(`事件绑定的目标对象为空或未无法绑定事件的对象：${target}`);
    return false;
  }
  if (window.removeEventListener) {
    target.removeEventListener(eventName,handler);
  } else if (window.dettachEvent) {
    target.detachEvent(`on${eventName}`,handler);
  } else {
    target[`on${eventName}`] = null;
  }
};


export {
  getMouseXY,
  getScreenWH,
  getEle,
  bindEvent,
  unbindEvent
}