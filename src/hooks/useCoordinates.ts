import { useCallback, useRef } from 'react';

const useCoordinates = () => {
	const ref = useRef<HTMLTableElement>(null);

	const setX = useCallback(
		(e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
			if (e.type === 'click') {
				return `${(e as React.MouseEvent).pageX}px`;
			} else if (e.type === 'touchstart') {
				return `${(e as React.TouchEvent).touches[0].pageX}px`;
			} else if (e.type === 'keydown') {
				return `${
					(e.target as HTMLTableElement).getBoundingClientRect().x + 35
				}px`;
			} else {
				return null;
			}
		},
		[]
	);

	const setY = useCallback(
		(e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
			const containerBottom = (
				ref.current as HTMLTableElement
			).getBoundingClientRect().bottom;
			const menuBottom: number =
				(e as React.MouseEvent).pageY + 224 - window.scrollY ||
				((e as React.TouchEvent).touches &&
					(e as React.TouchEvent).touches[0].pageY + 224 - window.scrollY) ||
				(e.target as HTMLTableElement).getBoundingClientRect().y + 224;
			if (e.type === 'click' && menuBottom <= containerBottom) {
				return `${(e as React.MouseEvent).pageY}px`;
			} else if (e.type === 'click' && menuBottom > containerBottom) {
				return `${
					(e as React.MouseEvent).pageY - (menuBottom - containerBottom)
				}px`;
			} else if (
				e.type === 'touchstart' &&
				(e as React.TouchEvent).touches &&
				(e as React.TouchEvent).touches[0].pageY &&
				menuBottom <= containerBottom
			) {
				return `${(e as React.TouchEvent).touches[0].pageY}px`;
			} else if (
				e.type === 'touchstart' &&
				(e as React.TouchEvent).touches &&
				(e as React.TouchEvent).touches[0].pageY &&
				menuBottom > containerBottom
			) {
				return `${
					(e as React.TouchEvent).touches[0].pageY -
					(menuBottom - containerBottom)
				}px`;
			} else if (
				e.type === 'keydown' &&
				(e.target as HTMLTableElement).getBoundingClientRect() &&
				menuBottom <= containerBottom
			) {
				return `${
					(e.target as HTMLTableElement).getBoundingClientRect().y + 35
				}px`;
			} else if (
				e.type === 'keydown' &&
				(e.target as HTMLTableElement).getBoundingClientRect() &&
				menuBottom > containerBottom
			) {
				return `${
					(e.target as HTMLTableElement).getBoundingClientRect().y -
					(menuBottom - containerBottom)
				}px`;
			} else {
				return null;
			}
		},
		[ref]
	);

	return [setX, setY, ref] as const;
};

export default useCoordinates;
