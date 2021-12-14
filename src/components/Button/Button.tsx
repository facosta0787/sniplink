import type { FC, MouseEvent } from 'react'
import scss from './Button.module.scss'

interface ButtonProps {
  children: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<ButtonProps> = ({
  children,
  onClick,
}) => {
  return <button className={scss.button} onClick={onClick}>
    {children}
  </button>
}

export { Button }
