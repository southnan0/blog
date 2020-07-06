import React from "react";
import "./index.less";
import {Button} from "antd";
import {
  backgroundColor,
  borderColor,
  borderWidth,
  drawHorizontalLink,
  drawHorizontalLinkMain,
  drawVertialLink,
  drawVertialLinkMain, getTitleContent, onMouseDown, onMouseOver, onMouseUp, vertialLinkLeftLineWidth
} from "@/components/Organization/utils";
import arr from './data.json'

// 垂直间距
// eslint-disable-next-line no-underscore-dangle
const _verticalGap = 20;

// 水平间距
// eslint-disable-next-line no-underscore-dangle
const _horizontalGap = 30;
// 展示为从左到右的级别
const horizontalLevel = 2;

const LoopItem = (
  {
    children, item, setShowChildren, arrIndex, objOpen,isFirst,isLast
  }: {
    children: any, item: any, setShowChildren: any, arrIndex: number[], objOpen: object,isFirst:boolean,isLast:boolean
  }) => {
  const len = arrIndex.length;
  const hasChild = item.children && item.children.length;
  const key = arrIndex.join('_');
  const showChildren = objOpen[key];
  const loopItemRef = React.useRef(null) as any;

  const horizontalGap = len < horizontalLevel ? 15 : _horizontalGap;
  const verticalGap = _verticalGap;
  const leftLineLeft = horizontalGap - vertialLinkLeftLineWidth(horizontalGap);
  return (
    <div className="level" style={{
      paddingLeft: horizontalGap,
      paddingRight: horizontalGap / 2,
      paddingTop: verticalGap,
      textAlign: len === 1 ? 'center' : 'left',
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
                    ...(len >= horizontalLevel ? {left: leftLineLeft} : {}),
                    backgroundColor,
                    border:`${borderWidth}px solid ${borderColor}`
                  }}
            >
              {showChildren ? '-' : '+'}
            </span>
          ) : null
        }

        {drawHorizontalLink({showChildren, verticalGap, len, horizontalLevel, horizontalGap,isFirst,isLast})}

        {drawVertialLink({len, horizontalLevel, horizontalGap, verticalGap,isLast})}
      </article>

      {
        hasChild ? <div ref={loopItemRef}
                        className="content"
                        style={{
                          flexDirection: len > 1 ? 'column' : 'row',
                          ...(!showChildren ? {display: 'none'} : {})
                        }}>
          {children}
        </div> : null
      }

      {/* 贯穿所有孩子的大长线 */}
      {drawHorizontalLinkMain({
        len, horizontalLevel, verticalGap,isFirst,isLast
      })}

      {drawVertialLinkMain({
        len, horizontalLevel, horizontalGap,isLast
      })}

    </div>
  )
}

const loop = (orgList: any[], arrIndex: number[] = [], setShowChildren: any, objOpen: object) => {
  return orgList?.map((item: any, index) => {
    const hasChild = item.children && item.children.length;
    const newArrIndex: number[] = [...arrIndex, index];

    return (
      <LoopItem item={item}
                arrIndex={newArrIndex}
                setShowChildren={setShowChildren}
                objOpen={objOpen}
                isFirst={index === 0}
                isLast={index === orgList.length-1}
      >
        {
          hasChild ? loop(item.children, newArrIndex, setShowChildren, objOpen) : null
        }
      </LoopItem>
    )
  })
}
const step = 0.1;
const left = 50;

export default () => {
  const [objOpen, setObjOpen] = React.useState({} as object);
  const [scale, setScale] = React.useState(1);

  const [params, setParams] = React.useState({
    left: 0,
    top: 0,
    currentX: 0,
    currentY: 0,
    flag: false
  });

  const handleMouseDown = onMouseDown(params, setParams)

  React.useEffect(() => {
    const handleMouseUp = onMouseUp(params, setParams)
    // @ts-ignore
    // eslint-disable-next-line consistent-return
    const handleMouseOver = onMouseOver(params, 'organizationContainer')
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousewheel',function(event:any){
      console.log( event.wheelDelta )
    },false)
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [params])

  return (
    <>
      <Button onClick={() => {
        setScale(scale + step)
      }}>放大</Button>
      <Button onClick={() => {
        setScale(scale - step)
      }}>缩小</Button>
      <div id="organization" className="wrapper">
        <div className="organization"
             id="organizationContainer"
             style={{
               transform: `translateX(-${left}%) scale(${scale})`,
               left: `calc(${left}% + ${params.left}px)`,
               top: params.top
             }}>
        <span className="content"
              onMouseDown={handleMouseDown}>
           {
             loop(arr, [],
               (status: boolean, arrIndex: number[]) => {
                 const key = arrIndex.join('_');

                 objOpen[key] = !objOpen[key];

                 setObjOpen({...objOpen});
               }, objOpen
             )
           }
        </span>
        </div>
      </div>
    </>
  )
}
