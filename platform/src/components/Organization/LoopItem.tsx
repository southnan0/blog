import React from 'react';
import {
    backgroundColor,
    borderColor,
    borderWidth,
    drawHorizontalLink,
    drawHorizontalLinkMain,
    drawVertialLink,
    drawVertialLinkMain,
    getTitleContent,
    vertialLinkLeftLineWidth,
    isHorizontal,
    isVertialDisplayChildren
  } from "./utils";


// 垂直间距
// eslint-disable-next-line no-underscore-dangle
const _verticalGap = 20;

// 水平间距
// eslint-disable-next-line no-underscore-dangle
const _horizontalGap = 30;

const LoopItem = (
    {
      children, item, setShowChildren, arrIndex, objOpen
    }: {
      children: any, item: any, setShowChildren: any, arrIndex: number[], objOpen: any
    }) => {
    const hasChild = item.children && item.children.length;
    const key = arrIndex.join('_');
    const showChildren = objOpen[key];
    const loopItemRef = React.useRef(null) as any;
  
    const horizontalGap = isHorizontal(item) ? 15 : _horizontalGap;
    const verticalGap = _verticalGap;
    const leftLineLeft = horizontalGap - vertialLinkLeftLineWidth(horizontalGap);
    
    return (
      <div className="level" style={{
        paddingLeft: horizontalGap,
        paddingRight: horizontalGap / 2,
        paddingTop: verticalGap,
        textAlign: item.level === 0 ? 'center' : 'left',
      }}>
        <article className="title" style={{borderWidth,borderColor}}>
          {getTitleContent(item)}
  
          {
            hasChild ? (
              <span className="collapse"
                    onClick={() => {
                      setShowChildren(!showChildren, arrIndex);
                    }}
                    style={{
                      ...(isVertialDisplayChildren(item) ? {left: leftLineLeft} : {}),
                      backgroundColor,
                      border:`${borderWidth}px solid ${borderColor}`
                    }}
              >
                {showChildren ? '-' : '+'}
              </span>
            ) : null
          }
  
          {drawHorizontalLink({showChildren, verticalGap, horizontalGap,item})}
  
          {drawVertialLink({horizontalGap, verticalGap,item})}
        </article>
  
        {
          hasChild ? <div ref={loopItemRef}
                          className="content"
                          style={{
                            flexDirection: (isVertialDisplayChildren(item) ? 'column' : 'row'),
                            ...(!showChildren ? {display: 'none'} : {})
                          }}>
            {children}
          </div> : null
        }
  
        {/* 贯穿所有孩子的大长线 */}
        {drawHorizontalLinkMain({
          verticalGap,item
        })}


        {drawVertialLinkMain({
          horizontalGap,item
        })}
  
      </div>
    )
  }

export default LoopItem