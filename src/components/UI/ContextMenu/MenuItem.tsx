import Button from '../Button/Button';

interface MenuItems {
  status: string;
  src: string;
  alt: string;
  onClick: (
    e:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.TouchEvent<Element>
  ) => void;
}

const MenuItem = ({ status, src, alt, onClick }: MenuItems) => {
  return (
    <li role="menuitem">
      <Button onClick={onClick}>
        <span>{status}</span>
        <img src={src} alt={alt} />
      </Button>
    </li>
  );
};

export default MenuItem;
