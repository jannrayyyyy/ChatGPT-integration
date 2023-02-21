import Head from 'next/head'
import { useState } from 'react'
import styles from './index.module.css'

export default function Home() {
  const [priceMin, setPriceMin] = useState(25)
  const [priceMax, setPriceMax] = useState(100)
  const [age, setAge] = useState(20)
  const [gender, setGender] = useState('male')
  const [hobbies, setHobbies] = useState('')

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState()

  async function onSubmit(event) {
    event.preventDefault()
    if (loading) {
      return
    }
    setLoading(true)

    try {
      const response = await fetch('/api/generate-gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceMin, priceMax, gender, age, hobbies }),
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
      console.error(error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Christmas gift generator</h3>
        <form onSubmit={onSubmit}>
          <label>For who is the gift?</label>
          <select
            className={styles.input}
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="man">Man</option>
            <option value="woman">Woman</option>
          </select>

          <label>Age</label>
          <input
            type="number"
            min={1}
            max={99}
            name="age"
            placeholder="Enter the age"
            value={age}
            className={styles.input}
            onChange={(e) => setAge(Number.parseInt(e.target.value))}
          />

          <label>Price from</label>
          <input
            type="number"
            min={1}
            name="priceMin"
            placeholder="Enter the minimum price"
            value={priceMin}
            className={styles.input}
            onChange={(e) => setPriceMin(Number.parseInt(e.target.value))}
          />

          <label>Price to</label>
          <input
            type="number"
            min={1}
            name="priceMax"
            placeholder="Enter the maximum price"
            value={priceMax}
            className={styles.input}
            onChange={(e) => setPriceMax(Number.parseInt(e.target.value))}
          />

          <label>Hobbies</label>
          <input
            type="text"
            name="hobbies"
            placeholder="Enter the hobbies"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
          />
          <input type="submit" value="Generate gift ideas" />
        </form>
        <div className={styles.result}>
          {loading ? (
            <p>Loading..</p>
          ) : (
            <p dangerouslySetInnerHTML={{ __html: result }}></p>
          )}
        </div>
      </main>
    </div>
  )
}
