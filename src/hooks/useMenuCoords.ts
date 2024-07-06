import { useCallback, useRef } from 'react';

const useMenuCoords = () => {
  const tableRef = useRef<HTMLTableElement>(null);

  const setX = useCallback((e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
    if (e.type === 'click') {
      return `${(e as React.MouseEvent).pageX}px`;
    } else if (e.type === 'touchstart') {
      return `${(e as React.TouchEvent).touches[0].pageX}px`;
    } else if (e.type === 'keydown') {
      return `${
        (e.target as HTMLTableElement).getBoundingClientRect().x +
        (e.target as HTMLTableElement).getBoundingClientRect().width
      }px`;
    } else {
      return null;
    }
  }, []);

  const setY = useCallback(
    (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
      // measurements
      const menuHeight = 187; // should be able to get this dynamically
      const tableBottom: number = (tableRef.current as HTMLTableElement).getBoundingClientRect()
        .bottom;
      const tableTop: number = (tableRef.current as HTMLTableElement).getBoundingClientRect().top;
      const tableHeight: number = (tableRef.current as HTMLTableElement).getBoundingClientRect()
        .height;
      const menuBottom: number =
        (e as React.MouseEvent).pageY + menuHeight - window.scrollY ||
        ((e as React.TouchEvent).touches &&
          (e as React.TouchEvent).touches[0].pageY + menuHeight - window.scrollY) ||
        (e.target as HTMLTableElement).getBoundingClientRect().y + menuHeight;
      const menuTop: number =
        (e as React.MouseEvent).pageY - window.scrollY - menuHeight ||
        ((e as React.TouchEvent).touches &&
          (e as React.TouchEvent).touches[0].pageY - window.scrollY - menuHeight) ||
        (e.target as HTMLTableElement).getBoundingClientRect().y - menuHeight;
      // position logic
      const noStopIntersect = menuBottom <= tableBottom;
      const stopBottomIntersect =
        (menuBottom > tableBottom && menuTop > tableTop) || tableHeight > menuHeight;
      const stopTopIntersect = menuBottom > tableBottom && menuTop < tableTop;
      // events
      const click = e.type === 'click';
      const touchStart =
        e.type === 'touchstart' &&
        (e as React.TouchEvent).touches &&
        (e as React.TouchEvent).touches[0].pageY;
      const keyDown =
        e.type === 'keydown' && (e.target as HTMLTableElement).getBoundingClientRect();

      if (click && noStopIntersect) {
        return `${(e as React.MouseEvent).pageY}px`;
      } else if (click && stopBottomIntersect) {
        return `${(e as React.MouseEvent).pageY - (menuBottom - tableBottom)}px`;
      } else if (click && stopTopIntersect) {
        return `${(e as React.MouseEvent).pageY}px`;
      } else if (touchStart && noStopIntersect) {
        return `${(e as React.TouchEvent).touches[0].pageY}px`;
      } else if (touchStart && stopBottomIntersect) {
        return `${(e as React.TouchEvent).touches[0].pageY - (menuBottom - tableBottom)}px`;
      } else if (touchStart && stopTopIntersect) {
        return `${(e as React.TouchEvent).touches[0].pageY}px`;
      } else if (keyDown && noStopIntersect) {
        return `${
          (e.target as HTMLTableElement).getBoundingClientRect().y +
          (e.target as HTMLTableElement).getBoundingClientRect().height
        }px`;
      } else if (keyDown && stopBottomIntersect) {
        return `${
          (e.target as HTMLTableElement).getBoundingClientRect().y - (menuBottom - tableBottom)
        }px`;
      } else if (keyDown && stopTopIntersect) {
        return `${
          (e.target as HTMLTableElement).getBoundingClientRect().y +
          (e.target as HTMLTableElement).getBoundingClientRect().height
        }px`;
      } else {
        return null;
      }
    },
    [tableRef]
  );

  return [setX, setY, tableRef] as const;
};

export default useMenuCoords;
