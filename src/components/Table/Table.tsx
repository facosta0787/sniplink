import type { ILink } from '../../lib/fetchers';

import scss from './Table.module.scss';
import CopyIcon from '../Icons/CopyIcon';

interface TableProps {
  linkDomain?: string | null;
  links: ILink[];
}

interface RowProps {
  linkDomain?: string | null;
  link: ILink;
}

const Row = ({ link, linkDomain }: RowProps) => {
  const linkUrl = `${linkDomain}/${link.hash}`;
  const linkAlias = `${linkDomain}/${link.alias ?? link.hash}`;

  const handleCopyClick = (): void => {
    navigator.clipboard.writeText(linkAlias);
  };

  return (
    <tr>
      <td>
        <div className={scss.aliasWrapper}>
          <button onClick={handleCopyClick} className={scss.copyIcon}>
            <CopyIcon size={20} color="rgba(0, 0, 0, 0.5)" />
          </button>
          <span className={scss.aliasLabel}>{link.alias ? 'Alias' : 'Hash'}</span>
          <span className={scss.alias}>{link.alias ?? link.hash}</span>
        </div>
      </td>
      <td>
        <a href={linkUrl} target="_blank" rel="no noreferrer" className={scss.linkurl}>
          {linkAlias}
        </a>
      </td>
    </tr>
  );
};

export const Table = ({ linkDomain, links }: TableProps) => {
  return (
    <table className={scss.table}>
      <thead>
        <tr>
          <th>Alias</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {links.map((link) => (
          <Row key={link.id} link={link} linkDomain={linkDomain} />
        ))}
      </tbody>
    </table>
  );
};
