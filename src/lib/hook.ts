import { useEffect, useState } from "react";

/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement
): boolean {
  let x = coordinate.x
  let y = coordinate.y
  let left = element.offsetLeft
  let right = element.offsetLeft + element.offsetWidth
  let top = element.offsetTop
  let bottom = element.offsetTop + element.offsetHeight
  if (
    x > left && 
    x < right && 
    y > top && 
    y < bottom) {
      return true
    }
    return false
}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  return element.offsetHeight
}

export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */
export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[]
): HoveredElementInfo | null {
  const [elementInfo, setElementInfo]= useState<HoveredElementInfo | null>(null)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  window.addEventListener("mousemove", (e) => {
      setElementInfo(null)
    setX(e.clientX)
    setY(e.clientY)
  })

  useEffect(() => {
    for (let element of parsedElements) {
      if (isPointInsideElement({x, y}, element)) {
        setElementInfo( {
          element: element,
          top: element.offsetTop,
          left: element.offsetLeft,
          heightOfFirstLine: getLineHeightOfFirstLine(element)
        })
      }
    }
  }, [x, y])

  return elementInfo
}
