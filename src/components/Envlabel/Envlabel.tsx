import type { FC } from 'react';
import { config } from '../../../config/env';

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
    textDecoration: 'none',
  } as const;

  const getLabelText = (): string => {
    if (host.includes('sniplink-pr')) {
      return host
        .split('.')[0]
        .replace(/sniplink-/g, '')
        .toUpperCase();
    }
    if (host.includes('stage')) return 'stage';
    if (host.includes('localhost')) return 'development';
    return 'production';
  };

  if (getLabelText() === 'production') return null;

  if (getLabelText().includes('PR-')) {
    return (
      <a
        style={styles}
        href={`${config.NEXT_PUBLIC_REPO_URL}/pull/${getLabelText().split('-')[1]}`}
        target="_blank"
        rel="noreferrer"
      >
        <span>{getLabelText()}</span>
      </a>
    );
  }

  return (
    <div style={styles}>
      <span>{getLabelText()}</span>
    </div>
  );
};
