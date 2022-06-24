import { product } from './array'
export const fixSuffix = (phonenumber: string) => {
  if (!(phonenumber.startsWith('62') || phonenumber.startsWith('0')))
    return '62' + phonenumber
  else return phonenumber.replace(/^0/, '62')
}
export const cleanNumber = (phoneNumber: string) =>
  phoneNumber.replace(/^(0|62)/, '')

export interface CreateOptions {
  length: number
  totalTarget: number
}
export class PhoneNumber {
  private *generator(phoneNumber: string) {
    const validateBracket =
      (phoneNumber.match(/\[/g) || []).length !==
      (phoneNumber.match(/\]/g) || []).length
    const validatePhoneNumber = !Boolean(phoneNumber.match(/^[x\[\]0-9]+$/))
    if (validateBracket || validatePhoneNumber) {
      throw new Error('invalid phone number format')
    }

    let prog = new RegExp('(x|\\[\\d+?\\])', 'g')
    let template = phoneNumber.replace(prog, '{}')
    let possible_fills: string[][] = []

    ;(phoneNumber.match(prog) || []).map((unknown) => {
      if (unknown == 'x') {
        possible_fills.push('0123456789'.split(''))
      } else {
        possible_fills.push(unknown.replace(/(^\[|\]$)/g, '').split(''))
      }
    })

    let i = 1
    for (let possible_fill of product(...possible_fills)) {
      let possible = template
      possible_fill.map((fill) => (possible = possible.replace('{}', fill)))
      yield [possible, i++]
    }
  }
  *create(phoneNumber: string, options: Partial<CreateOptions>) {
    options.length ||= 12
    options.totalTarget ||= 1000

    const { length, totalTarget } = options

    phoneNumber = cleanNumber(phoneNumber)
    if (phoneNumber.length < length - 1) {
      const maximum = length - 1 - phoneNumber.length
      for (let i = 0; i < maximum; i++) {
        phoneNumber += 'x'
      }
    } else {
      phoneNumber = phoneNumber.substring(0, length)
    }
    phoneNumber = fixSuffix(phoneNumber)

    for (const [ph, i] of this.generator(phoneNumber)) {
      yield ph
      if (totalTarget != Infinity && totalTarget == i) break
    }
  }
}
