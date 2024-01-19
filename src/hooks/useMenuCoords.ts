import { useCallback, useRef } from 'react';

const useMenuCoords = () => {
	const tableRef = useRef<HTMLTableElement>(null);
	const menuRef = useRef<HTMLDivElement>(null); // let's get get dynamic menu height value instead of hard-coding (if possible)

	const setX = useCallback(
		// gets x position for different events
		(
			e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent
		) => {
			if (e.type === 'click') {
				return `${(e as React.MouseEvent).pageX}px`;
			} else if (e.type === 'touchstart') {
				return `${(e as React.TouchEvent).touches[0].pageX}px`;
			} else if (e.type === 'keydown') {
				return `${(e.target as HTMLTableElement).getBoundingClientRect().x +
					(e.target as HTMLTableElement).getBoundingClientRect().width
					}px`;
			} else {
				return null;
			}
		},
		[]
	);

	const setY = useCallback(
		(
			e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent
		) => {
			// get bottom of containing table
			const containerBottom: number = (
				tableRef.current as HTMLTableElement
			).getBoundingClientRect().bottom;
			// compute y position of menu bottom for click and touch with pageY + menu height - scrollY
			const menuBottom: number =
				(e as React.MouseEvent).pageY + 224 - window.scrollY ||
				((e as React.TouchEvent).touches &&
					(e as React.TouchEvent).touches[0].pageY +
					224 -
					window.scrollY) ||
				// no pageY available for keyboard events, so set menu bottom with y position of status button + menu height
				(e.target as HTMLTableElement).getBoundingClientRect().y +
				224;
			// sets menu y position based on click event's pageY
			if (e.type === 'click' && menuBottom <= containerBottom) {
				return `${(e as React.MouseEvent).pageY}px`;
				// prevent menu from intersecting bottom of table, sits menu at bottom of table
			} else if (e.type === 'click' && menuBottom > containerBottom) {
				return `${(e as React.MouseEvent).pageY -
					(menuBottom - containerBottom)
					}px`;
				// sets menu y position based on touch event's pageY
			} else if (
				e.type === 'touchstart' &&
				(e as React.TouchEvent).touches &&
				(e as React.TouchEvent).touches[0].pageY &&
				menuBottom <= containerBottom
			) {
				return `${(e as React.TouchEvent).touches[0].pageY}px`;
				// prevent menu from intersecting bottom of table, sits menu at bottom of table
			} else if (
				e.type === 'touchstart' &&
				(e as React.TouchEvent).touches &&
				(e as React.TouchEvent).touches[0].pageY &&
				menuBottom > containerBottom
			) {
				return `${(e as React.TouchEvent).touches[0].pageY -
					(menuBottom - containerBottom)
					}px`;
				// set menu y position based on status button's y position + height (keyboard)
			} else if (
				e.type === 'keydown' &&
				(e.target as HTMLTableElement).getBoundingClientRect() &&
				menuBottom <= containerBottom
			) {
				return `${(e.target as HTMLTableElement).getBoundingClientRect().y +
					(e.target as HTMLTableElement).getBoundingClientRect()
						.height
					}px`;
				// prevent menu from intersecting bottom of table, sits menu at bottom of table (keyboard)
			} else if (
				e.type === 'keydown' &&
				(e.target as HTMLTableElement).getBoundingClientRect() &&
				menuBottom > containerBottom
			) {
				return `${(e.target as HTMLTableElement).getBoundingClientRect().y -
					(menuBottom - containerBottom)
					}px`;
			} else {
				return null;
			}
		},
		[tableRef, menuRef]
	);

	return [setX, setY, tableRef, menuRef] as const;
};

export default useMenuCoords;
