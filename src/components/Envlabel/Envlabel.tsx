import type { FC } from 'react';

interface EnvlabelProps {
  host: string;
}

export const Envlabel: FC<EnvlabelProps> = ({ host }) => {
  const styles = {
    display: 'inline-block',
    position: 'fixed',
    left: '1rem',
    bottom: '1rem',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 600,
    padding: '0.25rem 0.5rem',
    borderRadius: '5px',
    fontSize: '0.75rem',
  } as const;

  const getLabelText = (): string => {
    if (host.includes('review')) {
      return host
        .split('.')[0]
        .replace(/review-/g, '')
        .toUpperCase();
    }
    if (host.includes('stage')) return 'stage';
    if (host.includes('localhost')) return 'development';
    return 'production';
  };

  if (getLabelText() === 'production') return null;

  return (
    <div style={styles}>
      <span>{getLabelText()}</span>
    </div>
  );
};
