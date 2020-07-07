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
  drawVertialLinkMain,
  getTitleContent,
  onMouseDown,
  onMouseOver,
  onMouseUp,
  vertialLinkLeftLineWidth,
  isHorizontal,
  isVertialDisplayChildren
} from "@/components/Organization/utils";
import arr from './data.json'

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
    children: any, item: any, setShowChildren: any, arrIndex: number[], objOpen: object
  }) => {
  const hasChild = item.children && item.children.length;
  const key = arrIndex.join('_');
  const showChildren = objOpen[key];
  const loopItemRef = React.useRef(null) as any;

  const horizontalGap = isHorizontal(item) ? 15 : _horizontalGap;
  const verticalGap = _verticalGap;
  const leftLineLeft = horizontalGap - vertialLinkLeftLineWidth(horizontalGap);
  if(item.level <=1){
    console.info(item.level,isVertialDisplayChildren(item))
  }
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

const loop = (orgList: any[], arrIndex: number[] = [], setShowChildren: any, objOpen: object) => {
  return orgList?.map((item: any, index) => {
    const hasChild = item.children && item.children.length;
    const newArrIndex: number[] = [...arrIndex, index];

    return (
      <LoopItem item={{...item,level:newArrIndex.length -1,isFirst:index === 0,isLast:index+1 === orgList.length}}
                arrIndex={newArrIndex}
                setShowChildren={setShowChildren}
                objOpen={objOpen}
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
