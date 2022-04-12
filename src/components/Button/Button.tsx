import type { FC, MouseEvent } from 'react';
import scss from './Button.module.scss';
import cs from 'classnames';

interface ButtonProps {
  children: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  [key: string]: any;
}

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  className,
  ...restProps
}) => {
  return (
    <button
      className={cs(scss.button, {
        [className]: Boolean(className),
      })}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  );
};

export { Button };
