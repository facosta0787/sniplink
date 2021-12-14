import type { NextPage } from 'next'
import type { FormEvent } from 'react'
import { useState } from 'react'
import isURL from 'validator/lib/isURL'

import { Button } from '../src/components/Button'
import scss from '../styles/Home.module.scss'

const Home: NextPage = () => {
  const [result, setResult] = useState<string>('https://sniplink.tk/r13MlIEQ')
  const [copied, setCopied] = useState<boolean>(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement> | undefined
  ): Promise<void> => {
    event?.preventDefault()

    const shorten = event?.currentTarget.inputShorten?.value
    if (isURL(shorten)) {
      try {
        const response = await fetch('/api/v1/link', {
          headers: new Headers({
            'Content-type': 'application/json',
          }),
          method: 'post',
          body: JSON.stringify({ link: shorten }),
        })
        const { data } = await response.json()
        setResult(data.link)
      } catch (err: any) {
        console.error(err)
      }
    }
  }

  const handleCopyClick = (): void => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={scss.container}>
      <h1>
        Sniplink <div className={scss.icon}>✂️</div>
      </h1>
      <form className={scss.shortenForm} onSubmit={handleSubmit}>
        <input id='inputShorten' type='text' autoComplete='off' autoFocus />
        <Button>Shorten</Button>
      </form>
      {Boolean(result) && (
        <div className={scss.resultContainer}>
          <i>🔗</i>
          <a
            href={result}
            target='_blank'
            rel='noreferrer'
            className={scss.resultLink}
          >
            {result}
          </a>
          {copied ? (
            <i>
              <small>copied! 👍🏼</small>
            </i>
          ) : (
            <i onClick={handleCopyClick}>📑</i>
          )}
        </div>
      )}
    </div>
  )
}

export default Home
