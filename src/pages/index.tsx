import type { NextPage } from 'next';
import type { FormEvent } from 'react';

import Head from 'next/head';
import isURL from 'validator/lib/isURL';
import cs from 'classnames';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { createLink, getAllLinks } from '../lib/fetchers';

import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { LoadingPulse } from '../components/LoadingPulse';
import scss from '../shared/styles-pages/Home.module.scss';
import CopyIcon from 'src/components/Icons/CopyIcon';

interface IFormLink {
  shorten: string;
  alias: string;
}

const initialStateFormLink: IFormLink = { shorten: '', alias: '' };

const Home: NextPage = ({ linkDomain }: { linkDomain?: string | null }) => {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [formLink, setFormLink] = useState<IFormLink>(initialStateFormLink);

  const { data: links = [], isLoading: isLoadingLinks } = useQuery('links', getAllLinks);

  const linksMutation = useMutation(createLink, {
    onSuccess: ({ data }) => {
      setResult(data.link);
      setFormLink(initialStateFormLink);
    },
    onError: (error: string) => {
      setError(error);
      setTimeout(() => setError(null), 3000);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const { shorten, alias } = formLink;

    if (!isURL(shorten)) {
      setError("Oops! that doesn't look a URL");
      setTimeout(() => setError(null), 3000);
      return;
    }
    linksMutation.mutate({ shorten, alias });
  };

  const handleCopyClick = (): void => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      <div className={scss.container}>
        <h1>
          Sniplink <div className={scss.icon}>✂️</div>
        </h1>
        <form className={scss.shortenForm} onSubmit={handleSubmit}>
          <input
            id="shorten"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Long URL"
            value={formLink.shorten}
            onChange={(event) => setFormLink((prev: IFormLink) => ({ ...prev, shorten: event.target.value }))}
          />

          <div className={scss.formGroup}>
            <input
              id="alias"
              type="text"
              autoComplete="off"
              placeholder="Alias"
              value={formLink.alias}
              onChange={(event) => setFormLink((prev: IFormLink) => ({ ...prev, alias: event.target.value }))}
            />
            <Button type="submit" className={scss.submitButton}>
              Shorten
            </Button>
          </div>

          <p className={scss.aliasCaption}>Alias must be hyphen separated. Example: this-is-my-alias</p>

          <span
            className={cs(scss.urlStringError, {
              [scss.urlStringErrorShow]: Boolean(error),
            })}
          >
            {error}
          </span>
        </form>

        {Boolean(result) && (
          <div className={scss.resultContainer}>
            <a href={result} target="_blank" rel="noreferrer" className={scss.resultLink}>
              {result}
            </a>
            {copied ? (
              <i>copied!</i>
            ) : (
              <i onClick={handleCopyClick}>
                <CopyIcon size={20} color="rgba(0,0,0,.5)" />
              </i>
            )}
          </div>
        )}

        {isLoadingLinks ? <LoadingPulse /> : <Table linkDomain={linkDomain} links={links} />}
      </div>
    </>
  );
};

export default Home;
