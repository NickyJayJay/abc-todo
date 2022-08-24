import React from 'react';
import FocusLock from 'react-focus-lock';

import classes from './ContextMenu.module.scss';
import checkmark from '../../../assets/SVG/checkmark.svg';
import add from '../../../assets/SVG/add.svg';
import arrowRight from '../../../assets/SVG/arrow-right.svg';
import dot from '../../../assets/SVG/dot.svg';
import trash from '../../../assets/SVG/trash.svg';
import close from '../../../assets/SVG/close-regular.svg';

interface Props {
	xPos?: string | null;
	yPos?: string | null;
	handleMenuItemEvent: (
		e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent
	) => void;
}

const ContextMenu = ({ xPos, yPos, handleMenuItemEvent }: Props) => {
	return (
		<FocusLock returnFocus>
			<div
				className={`${classes.contextMenu} card`}
				style={{
					top: yPos as string,
					left: xPos as string,
				}}
			>
				<ul>
					<li
						onClick={(event) => handleMenuItemEvent(event)}
						onKeyDown={(event) => handleMenuItemEvent(event)}
						onTouchStart={(event) => handleMenuItemEvent(event)}
					>
						<button>
							<span>In Process</span>
							<img src={dot} alt='in process icon' />
						</button>
					</li>
					<li
						onClick={(event) => handleMenuItemEvent(event)}
						onKeyDown={(event) => handleMenuItemEvent(event)}
						onTouchStart={(event) => handleMenuItemEvent(event)}
					>
						<button>
							<span>Completed</span>
							<img src={checkmark} alt='completed icon' />
						</button>
					</li>
					<li
						onClick={(event) => handleMenuItemEvent(event)}
						onKeyDown={(event) => handleMenuItemEvent(event)}
						onTouchStart={(event) => handleMenuItemEvent(event)}
					>
						<button>
							<span>Forwarded</span>
							<img src={arrowRight} alt='forwarded icon' />
						</button>
					</li>
					<li
						onClick={(event) => handleMenuItemEvent(event)}
						onKeyDown={(event) => handleMenuItemEvent(event)}
						onTouchStart={(event) => handleMenuItemEvent(event)}
					>
						<button>
							<span>Delegated</span>
							<img src={add} alt='delegated icon' />
						</button>
					</li>
					<li
						onClick={(event) => handleMenuItemEvent(event)}
						onKeyDown={(event) => handleMenuItemEvent(event)}
						onTouchStart={(event) => handleMenuItemEvent(event)}
					>
						<button>
							<span>Remove</span>
							<img src={trash} alt='removed icon' />
						</button>
					</li>
					<li
						onClick={(event) => handleMenuItemEvent(event)}
						onKeyDown={(event) => handleMenuItemEvent(event)}
						onTouchStart={(event) => handleMenuItemEvent(event)}
					>
						<button>
							<span>Cancel</span>
							<img src={close} alt='close icon' />
						</button>
					</li>
				</ul>
			</div>
		</FocusLock>
	);
};

export default ContextMenu;
