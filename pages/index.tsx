import type { NextPage } from 'next'
import type { FormEvent } from 'react'
import { useState } from 'react'
import isURL from 'src/utils/is-url'

import scss from '../styles/Home.module.scss'

const Home: NextPage = () => {
  const [result, setResult] = useState<string>('')

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

  return (
    <div className={scss.container}>
      <form className={scss.shortenForm} onSubmit={handleSubmit}>
        <input id='inputShorten' type='text' autoComplete='off' autoFocus />
        <button type='submit'>Shorten</button>
      </form>
      {Boolean(result) && (
        <a href={result} target='_blank' rel='noreferrer' className={scss.resultLink}>
          {result}
        </a>
      )}
    </div>
  )
}

export default Home
