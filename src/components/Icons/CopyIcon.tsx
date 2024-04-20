import classNames from 'classnames';

export default function CopyIcon({ size = 24, color = 'currentColor', className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" className={className}>
      <path
        fill={color}
        d="M216 34H88a6 6 0 0 0-6 6v42H40a6 6 0 0 0-6 6v128a6 6 0 0 0 6 6h128a6 6 0 0 0 6-6v-42h42a6 6 0 0 0 6-6V40a6 6 0 0 0-6-6m-54 176H46V94h116Zm48-48h-36V88a6 6 0 0 0-6-6H94V46h116Z"
      />
    </svg>
  );
}
