import { getEle, bindEvent, unbindEvent } from "./util";

class resizePlugin {
  /**
   * @description 判断触发resize的是盒子的哪个边界区域
   * @param {string} baseParam 通过类名来判断当前执行动作的是那一条边界
   */
  static judgeResizeTrigger(baseParam, judge = 0) {
    let borderMap = [
      { reg: 1, val: 1 }, // left top
      { reg: 2, val: 5 }, // top
      { reg: 3, val: 3 }, // right top
      { reg: 4, val: 8 }, // right
      { reg: 5, val: 4 }, // right bottom
      { reg: 6, val: 6 }, // bottom
      { reg: 7, val: 2 }, // left bottom
      { reg: 8, val: 7 }, // left
    ];
    borderMap.forEach((item) => {
      let regx = new RegExp(`crop_dot${item.reg}`, "g");
      judge = regx.test(baseParam) ? item.val : judge;
    });
    return judge;
  }

  /**
   * @description 是否越界判定
   * @param {Object} moveEle 被判断是否运动出界的对象
   * @param {Object} ptEle 约束运动节点的活动范围的对象
   * @returns
   */
  static judgeIsRangeOut(moveEle = null, ptEle = document.body) {
    if (!moveEle) {
      console.error(
        "边界判定,没有传递需要被判断的节点或传递错误的节点参数！：" + moveEle
      );
      return;
    }
    //父节点的宽高，offsetleft offsettop
    let pt_oLeft = parseInt(window.getComputedStyle(ptEle).left),
      pt_oTop = parseInt(window.getComputedStyle(ptEle).top),
      pt_width = parseInt(window.getComputedStyle(ptEle).width),
      pt_height = parseInt(window.getComputedStyle(ptEle).height),
      moveEle_oLeft = parseInt(window.getComputedStyle(moveEle).left),
      moveEle_oTop = parseInt(window.getComputedStyle(moveEle).top),
      moveEle_width = parseInt(window.getComputedStyle(moveEle).width),
      moveEle_height = parseInt(window.getComputedStyle(moveEle).height);
    let isOutRange = { left: false, top: false, right: false, bottom: false };
    if (moveEle_oLeft < 0) {
      moveEle_oLeft = 1;
      isOutRange.left = true;
    }
    if (moveEle_oTop < 0) {
      moveEle_oTop = 1;
      isOutRange.top = true;
    }
    if (moveEle_width > pt_width - moveEle_oLeft) {
      moveEle_width = pt_width - moveEle_oLeft;
      isOutRange.right = true;
    }
    ``;
    if (moveEle_height > pt_height - moveEle_oTop) {
      moveEle_height = pt_height - moveEle_oTop;
      isOutRange.bottom = true;
    }
    let rangeBase = {
      rangeLeft: pt_oLeft,
      rangeTop: pt_oTop,
      maxW: pt_width,
      maxH: pt_height,
      resizeEleLeft: moveEle_oLeft,
      resizeEleTop: moveEle_oTop,
      resizeEleW: moveEle_width,
      resizeEleH: moveEle_height,
    };
    return { isOutRange, rangeBase };
  }

  /**
   * @description 设置指定DOM节点的宽高
   * @param {Object} rangeEle 限制被调整宽高的节点的活动范围的对象
   * @param {Object} resizeEle 被调整宽高的节点对象
   * @param {Number} width 宽度
   * @param {Number} height 高度
   * @param {Number} left 左边距离
   * @param {Number} top 顶部距离
   */
  static setBoxWH(rangeEle, resizeEle, width, height, left, top) {
    if (!resizeEle) {
      console.error("设置盒子宽高未指定盒子");
      return;
    }
    let res = this.judgeIsRangeOut(resizeEle, rangeEle);
    let { resizeEleLeft, resizeEleTop, resizeEleW, resizeEleH } = res.rangeBase;
    let isOutRange = res.isOutRange;
    let minW = 20,
      minH = 20;
    width = width <= minW ? minW : width;
    height = height <= minH ? minH : height;
    if (width <= minW && height > minH) {
      left = resizeEleLeft;
    } else if (width > minW && height <= minH) {
      top = resizeEleTop;
    } else if (width <= minW && height <= minH) {
      left = resizeEleLeft;
      top = resizeEleTop;
    }
    top = top < 0 ? 0 : top;
    left = left < 0 ? 0 : left;
    height = isOutRange.bottom
      ? resizeEleH
      : isOutRange.top
      ? resizeEleH
      : height;
    width = isOutRange.right
      ? resizeEleW
      : isOutRange.left
      ? resizeEleW
      : width;
    resizeEle.style.cssText = `width:${width}px;height:${height}px;left:${left}px;top:${top}px`;
  }
}

export default resizePlugin;
