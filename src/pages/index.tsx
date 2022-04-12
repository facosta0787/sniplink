import type { NextPage } from 'next';
import type { FormEvent } from 'react';

import isURL from 'validator/lib/isURL';
import cs from 'classnames';
import { useState } from 'react';
import { useMutation } from 'react-query';

import { Button } from '../components/Button';
import scss from '../shared/styles-pages/Home.module.scss';

const Home: NextPage = () => {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const linksMutation = useMutation(createLink, {
    onSuccess: ({ data }) => setResult(data.link),
  });

  const handleSubmit = (
    event: FormEvent<HTMLFormElement> | undefined,
  ): void => {
    event?.preventDefault();
    const shorten = event?.currentTarget.inputShorten?.value;
    const alias = event?.currentTarget.alias?.value;
    if (!isURL(shorten)) {
      setError("❌ Oops! that doesn't look a URL");
      setTimeout(() => setError(null), 2000);
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
    <div className={scss.container}>
      <h1>
        Sniplink <div className={scss.icon}>✂️</div>
      </h1>
      <form className={scss.shortenForm} onSubmit={handleSubmit}>
        <input
          id="inputShorten"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="URL"
        />
        <div className={scss.formGroup}>
          <input
            id="alias"
            type="text"
            autoComplete="off"
            placeholder="Alias"
          />
          <Button type="submit">Shorten</Button>
        </div>
        <p className={scss.aliasCaption}>
          * The alias must be hyphen separated. Example: this-is-my-alias
        </p>
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
          <a
            href={result}
            target="_blank"
            rel="noreferrer"
            className={scss.resultLink}
          >
            {result}
          </a>
          {copied ? <i>copied! 👍🏼</i> : <i onClick={handleCopyClick}>📑</i>}
        </div>
      )}
    </div>
  );
};

export default Home;

interface ICreateLinkParams {
  shorten: string;
  alias?: string;
}

async function createLink({ shorten, alias }: ICreateLinkParams): Promise<any> {
  const response = await fetch('/api/v1/link', {
    headers: new Headers({
      'Content-type': 'application/json',
    }),
    method: 'post',
    body: JSON.stringify({ link: shorten, alias }),
  });

  if (!response.ok) {
    throw new Error('Error creating the link');
  }

  return response.json();
}
