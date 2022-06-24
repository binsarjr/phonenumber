import Cheerio from 'cheerio'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const filepath = join(__dirname, '../resources/mentah.html')
const body = readFileSync(filepath)

const $ = Cheerio.load(body)
const data: { [i: string]: string[] } = {}
$('tbody tr').each((i, el) => {
  const phonenumber = $(el).find('td:nth-child(1)').text()
  const wilayah = $(el).find('td:nth-child(2)').text().toLowerCase()
  const jenis = $(el).find('td:nth-child(3)').text()
  if (data[wilayah]) {
    data[wilayah].push(phonenumber)
  } else {
    data[wilayah] = [phonenumber]
  }
})
writeFileSync(filepath, JSON.stringify(data, null, 2))
