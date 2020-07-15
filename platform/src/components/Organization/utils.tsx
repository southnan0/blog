import React from 'react'

export const borderWidth = 1;
export const borderColor = '#ccc';
export const backgroundColor = '#fff';
export const getLineColor = ()=>{
  return 'blue'
}

export const vertialLinkLeftLineWidth = (horizontalGap: number) => {
  return horizontalGap - 5
}

export const horizontalLinktopLineHeight = (verticalGap: number) => {
  return verticalGap - 5;
}

export const displayDirection = (item:any)=>{
  if([0,1].indexOf(item.level) !==-1){
    return 'horizontal'
  }
  return 'vertical'
}

export const isHorizontal = (item:any)=>displayDirection(item) === 'horizontal'

const getChildFirstItem = (item:any)=>{
    return {
      level:item.level+1
    }
}

/**
 *  水平铺开的孩子
 *  改规则可以自定义
 */
export const isHorizontalDisplayChildren = (item:any) => {
  const childItem = getChildFirstItem(item);
  return childItem && isHorizontal(childItem)
}


/**
 *  垂直铺开的孩子
 *  改规则可以自定义
 */
export const isVertialDisplayChildren = (
  item:any
) => {
  const childItem = getChildFirstItem(item);
  return childItem && !isHorizontal(childItem)
}

export const isTopLevel = (item:any)=>item.level === 0

export const drawHorizontalLink = (
  {
    showChildren, verticalGap, horizontalGap, item
  }: {
    showChildren: boolean, verticalGap: number, horizontalGap: number, item:any
  }) => {
  const topLineHeight = horizontalLinktopLineHeight(verticalGap);
  const bottomLineHeight = verticalGap - topLineHeight;

  return (
    <>
      {(item.isFirst && isHorizontalDisplayChildren(item) && showChildren) ?
        <span className="line"
              style={{
                height: topLineHeight,
                bottom: -(topLineHeight + borderWidth),
                backgroundColor: getLineColor(),
                width: borderWidth
              }}/> : null
      }
      {
        (!isTopLevel(item) && isHorizontal(item)) ?
          <>
            <div className="line" style={{
              height: bottomLineHeight,
              top: -(bottomLineHeight + borderWidth),
              backgroundColor: getLineColor(),
              width: borderWidth
            }}/>
            <div className="horizontal-line"
                 style={{
                   top: -(bottomLineHeight + borderWidth),
                   height: borderWidth,
                   width: `calc(50% + ${horizontalGap}px + ${borderWidth}px)`,
                   left: -(horizontalGap + borderWidth),
                   ...(item.isFirst ? {zIndex: 1, backgroundColor, height:borderWidth+2,top:-(bottomLineHeight + borderWidth+1)} : {}),  
                   ...(item.isLast ? {zIndex: 1,backgroundColor: getLineColor()} : {})
                 }}/>
          </> : null
      }
    </>
  )
};

/**
 * 垂直图  6-b 横向连线  和纵向的填充连接线
 * @param horizontalGap
 * @param verticalGap
 */
export const drawVertialLink = (
  {
    horizontalGap, verticalGap, item
  }: {
    horizontalGap: number, verticalGap: number, item: any
  }) => {
  const leftLineWidth = vertialLinkLeftLineWidth(horizontalGap);
  return (
    <>
      {!isHorizontal(item) ? (
        <>
          <div className="line-2" style={{
            width: leftLineWidth,
            left: -(leftLineWidth + borderWidth),
            height: borderWidth,
            backgroundColor: getLineColor()
          }}/>
          <span className="vertial-line" style={{
            height: `calc(50% + ${verticalGap + borderWidth}px)`,
            left: -(leftLineWidth + borderWidth),
            top: -(verticalGap + borderWidth),
            backgroundColor: getLineColor(),
            ...(item.isLast ? {width: borderWidth} : {width: 0}),
          }}/>
        </>
      ) : null}
    </>
  )
};

/**
 * 上图对应2的横线
 * @param verticalGap
 */
export const drawHorizontalLinkMain = (
  {
    verticalGap,item
  }: {
    verticalGap: number,item:any
  }) => {
  const horizontalLineTop = horizontalLinktopLineHeight(verticalGap);

  return (isHorizontal(item) && item.level >0) ? <div className="horizontal-line" style={{
    top: horizontalLineTop,
    ...(item.isFirst ? {left: 0, width: '100%'} : {}),
    ...(item.isLast ? {right: 0, width: 0} : {}),
    height: borderWidth,
    backgroundColor: getLineColor()
  }}/>:null
};

/**        [ 欢聚时代 ]
 *1              |
 *2    ----------------------
 *3   |         |          |
 *4  [ 1 ]     [ 2 ]      [ 3 ]
 *5   |          |          |
 *6   |-[11]     |-[21]     |_[31]
 *7   |  |       |  |       |
 *8   |  |_[111] |  |-[211] |_[32]
 *9   |          |  |
 *0   |_[12]     |  |_[212]
 *a              |
 *b              |_[22]
 */

/**
 * 
 * @param horizontalGap
 */
export const drawVertialLinkMain = (
  {
    horizontalGap, item
  }: {
    horizontalGap: number, item: any
  }
) => {
  const leftLineLeft = horizontalGap - vertialLinkLeftLineWidth(horizontalGap);

  return !isHorizontal(item) ?
    <div className="vertial-line" style={{
      left: leftLineLeft,
      width: borderWidth,
      backgroundColor: getLineColor(), ...(item.isLast ? {height: 0} : {})
    }}/> : null
};

export const getTitleContent = (item: any) => {
  if (item.render instanceof Function) {
    return item.render(item)
  }

  const hasChild = item.children && item.children.length;
  return hasChild ? (
      <div>
        <div>{item.label}</div>
        <div>({item.onJob}+{item.toBeEmployed}+{item.recruitment}={item.onJob + item.toBeEmployed + item.recruitment})</div>
        <div>{item.leader}</div>
      </div>
    )
    : <div>{item.label}</div>
}


export const onMouseOver = (params: any, targetId: string) =>
  (event: any) => {
    const e = event || window.event;

    if (params.flag) {
      const target: any = document.getElementById(targetId)
      const nowX: number = e.clientX;
      const nowY = e.clientY;
      const disX: number = nowX - params.currentX;
      const disY = nowY - params.currentY;

      const l = parseInt(String(params.left), 10) + disX;
      const t = parseInt(String(params.top), 10) + disY;

      const {clientWidth, clientHeight} = target;
      if (t + clientHeight > 0) {
        target.style.top = `${t}px`;
      }

      if (l + clientWidth / 2 - 20 > 0) {
        target.style.left = `${l}px`;
      }

      if (event.preventDefault) {
        event.preventDefault();
      }
      return false;
    }
    return false
  }


const getCss = (o: any, key: any) => {
  // @ts-ignore
  return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
};

export const onMouseUp = (params: any, callback: Function) =>
  () => {
    const obj = {...params};
    const target = document.getElementById('organizationContainer')
    obj.flag = false;
    if (getCss(target, "left") !== "auto") {
      obj.left = getCss(target, "left");
    }
    if (getCss(target, "top") !== "auto") {
      obj.top = getCss(target, "top");
    }

    callback(obj);
  };

export const onMouseDown = (obj: any, callback: Function) =>
  (e: any) => {
    const params = {...obj};
    params.flag = true;
    const target = document.getElementById('organizationContainer')
    if (params.left === 0) {
      params.left = getCss(target, 'left')
    }

    if (params.top === 0) {
      params.top = getCss(target, 'top')
    }

    params.currentX = e.clientX;
    params.currentY = e.clientY;

    callback(params);
  }
