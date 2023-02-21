import Head from 'next/head'
import { useState } from 'react'
import styles from './index.module.css'

export default function Language() {
  const [animalInput, setAnimalInput] = useState('')
  const [sourceInput, setSourceInput] = useState('')
  const [targetInput, setTargetInput] = useState('')
  const [result, setResult] = useState()

  async function onSubmit(event) {
    event.preventDefault()
    try {
      const response = await fetch('/api/generate-translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animal: animalInput,
          source: sourceInput,
          target: targetInput,
        }),
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        )
      }

      setResult(data.result.replaceAll(`\n`, '<br>'))
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Boogle</h3>
        <form onSubmit={onSubmit}>
          <textarea
            className={styles.textArea}
            name="animal"
            cols="30"
            rows="10"
            value={animalInput}
            placeholder="Enter your code"
            onChange={(e) => setAnimalInput(e.target.value)}
          ></textarea>

          <input
            type="text"
            name="source"
            placeholder="Enter the source language"
            value={sourceInput}
            onChange={(e) => setSourceInput(e.target.value)}
          />
          <input
            type="text"
            name="target"
            placeholder="Enter the target language"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
          />
          <input type="submit" value="Generate Code" />
        </form>
        <div className={styles.result}>
          <p dangerouslySetInnerHTML={{ __html: result }} />
        </div>
      </main>
    </div>
  )
}
