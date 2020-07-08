import React from "react";
import "./index.less";
import { Button } from "antd";
import {
  onMouseDown,
  onMouseOver,
  onMouseUp,
} from "./utils";
import arr from './data.json'
import LoopItem from './LoopItem'
import { add, sub } from 's_calculation'


const loop = (orgList: any[], arrIndex: number[] = [], setShowChildren: any, objOpen: any) => {
  return orgList?.map((item: any, index) => {
    const hasChild = item.children && item.children.length;
    const newArrIndex: number[] = [...arrIndex, index];

    return (
      <LoopItem item={{ ...item, level: newArrIndex.length - 1, isFirst: index === 0, isLast: index + 1 === orgList.length }}
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
  const [objOpen, setObjOpen] = React.useState({} as any);
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

    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [params])

  React.useEffect(() => {
    const handleMouseWheel = function (event: any) {
      if (event.wheelDelta < 0) {
        setScale((lastScale) => {
          const currentScale = sub(lastScale, step)
          if (currentScale <= 0) {
            return lastScale
          }
          return currentScale
        })
      } else {
        setScale((lastScale) => {
          return add(lastScale, step)
        })
      }
    }

    document.addEventListener('mousewheel', handleMouseWheel, { passive: false })

    return ()=>{
      document.removeEventListener('mousewheel', handleMouseWheel)
    }
  }, [])

  return (
    <>
      <Button onClick={() => {
        setScale(add(scale, step))
      }}>放大</Button>
      <Button onClick={() => {
        const currentScale = sub(scale, step)
        setScale(currentScale <= 0 ? scale : currentScale)
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

                  setObjOpen({ ...objOpen });
                }, objOpen
              )
            }
          </span>
        </div>
      </div>
    </>
  )
}
