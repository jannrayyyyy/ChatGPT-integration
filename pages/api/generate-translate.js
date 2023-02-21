import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function (req, res) {
  const { animal, source, target } = req.body
  try {
    const completion = await openai.createCompletion({
      model: 'code-davinci-002',
      prompt: generatePrompt(animal, source, target),
      temperature: 0,
      max_tokens: animal.length > 100 ? 100 : 54,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ['###'],
    })
    res.status(200).json({ result: completion.data.choices[0].text })
    console.log(completion.data.choices[0].text)
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      })
    }
  }
}

function generatePrompt(animal, source, target) {
  return `##### Translate this function from Python into Haskell
### ${source}
    
    ${animal}
    
### ${target}`
}
