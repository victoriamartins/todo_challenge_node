import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvFile = new URL('../tasks.csv', import.meta.url)
const stream = fs.createReadStream(csvFile)

const parser = parse({
  delimiter: ',',
  skip_empty_lines: true,
  from_line: 2,
})

async function parseCsv() {
  const parsed = stream.pipe(parser)

  for await (const row of parsed) {
    const [title, description] = row

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

parseCsv()