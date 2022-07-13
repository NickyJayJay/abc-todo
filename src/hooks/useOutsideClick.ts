import { useEffect, useRef } from 'react';

const useOutsideClick = (callback: (event: MouseEvent | TouchEvent | KeyboardEvent) => void) => {
	const ref = useRef<HTMLTableSectionElement>(null);

	useEffect(() => {
		const handleClick = (event: MouseEvent | TouchEvent | KeyboardEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				callback(event); //disregard eslint warning - callback is wrapped in useCallback where it's defined
			}
		};

		document.addEventListener('click', (e) => handleClick(e));
		document.addEventListener('keydown', (e) => handleClick(e));
		document.addEventListener('touchstart', (e) => handleClick(e));

		return () => {
			document.removeEventListener('click', (e) => handleClick(e));
			document.removeEventListener('keydown', (e) => handleClick(e));
			document.removeEventListener('touchstart', (e) => handleClick(e));
		};
	}, [ref]);

	return ref;
};

export default useOutsideClick;
