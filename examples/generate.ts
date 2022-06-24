import { readFileSync } from 'fs'
import { join } from 'path'
import { fixSuffix, PhoneNumber } from '../src'

const body = JSON.parse(
  readFileSync(join(__dirname, '../resources/telkomsel.json')).toString()
)

console.log(body)

const jakarta = fixSuffix(body['jakarta'][0]) || ''

for (const [phonenumber, i] of new PhoneNumber().create(jakarta, {
  totalTarget: Infinity
})) {
  console.log(phonenumber, i)
}
