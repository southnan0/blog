import React from 'react'

const borderWidth = 1;

/**
 *  水平铺开的孩子
 *  改规则可以自定义
 */
const isHorizontalDisplayChildren = (
  {
    currentIndex: len, horizontalLevel
  }: {
    currentIndex: number, horizontalLevel: number
  }) => {
  return len > 1 && len <= horizontalLevel
}

/**
 *  垂直铺开的孩子
 *  改规则可以自定义
 */
const isVertialDisplayChildren = (
  {
    currentIndex: len, horizontalLevel
  }: {
    currentIndex: number, horizontalLevel: number
  }
) => {
  return len > horizontalLevel
}

export const drawHorizontalLink = (
  {
    showChildren, verticalGap, len, horizontalLevel, horizontalGap
  }: {
    showChildren: boolean, verticalGap: number, len: number, horizontalLevel: number, horizontalGap: number
  }) => {
  const halfLineHeight = verticalGap / 2;

  return (
    <>
      {(len < horizontalLevel && showChildren) ?
        <span className="line"
              style={{
                height: halfLineHeight,
                bottom: -(halfLineHeight + borderWidth)
              }}/> : null
      }
      {
        isHorizontalDisplayChildren({currentIndex: len, horizontalLevel}) ?
          <>
            <div className="line" style={{height: halfLineHeight, top: -(halfLineHeight + borderWidth)}}/>
            <div className="horizontal-line"
                 style={{
                   top: -(halfLineHeight + borderWidth),
                   width: `calc(50% + ${horizontalGap}px)`,
                   left: -horizontalGap
                 }}/>
          </> : null
      }
    </>
  )
};

export const drawVertialLink = (
  {
    len, horizontalLevel, horizontalGap, verticalGap
  }: {
    len: number, horizontalLevel: number, horizontalGap: number, verticalGap: number
  }) => {
  const halfLineWidth = horizontalGap / 2;
  return (
    <>
      {isVertialDisplayChildren({currentIndex: len, horizontalLevel}) ? (
        <>
          <div className="line-2" style={{width: halfLineWidth, left: -(halfLineWidth + borderWidth)}}/>
          <span className="vertial-line" style={{
            height: `calc(50% + ${verticalGap + borderWidth}px)`,
            left: -(halfLineWidth + borderWidth),
            top: -(verticalGap + borderWidth)
          }}/>
        </>
      ) : null}
    </>
  )
};

export const drawHorizontalLinkMain = (
  {
    len, horizontalLevel, verticalGap
  }: {
    len: number, horizontalLevel: number, verticalGap: number
  }
) => {
  const halfLineHeight = verticalGap / 2;

  return isHorizontalDisplayChildren({currentIndex: len, horizontalLevel}) ?
    <div className="horizontal-line" style={{top: halfLineHeight}}/>
    : null
};

export const drawVertialLinkMain = (
  {
    len, horizontalLevel, horizontalGap
  }: {
    len: number, horizontalLevel: number, horizontalGap: number
  }
) => {
  const halfLineWidth = horizontalGap / 2;

  return isVertialDisplayChildren({currentIndex: len, horizontalLevel}) ?
    <div className="vertial-line" style={{left: halfLineWidth}}/> : null
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
