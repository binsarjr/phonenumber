import { product } from './supports/array'

// fixing suffix when missing 62
export const fixSuffix = (phonenumber: string) => {
  if (!(phonenumber.startsWith('62') || phonenumber.startsWith('0')))
    return '62' + phonenumber
  else return phonenumber.replace(/^0/, '62')
}

// remove when suffix is 0 or 62
export const cleanNumber = (phoneNumber: string) =>
  phoneNumber.replace(/^(0|62)/, '')

export interface CreateOptions {
  length: number
  totalTarget: number
}
export class PhoneNumber {
  /**
   * Generator phone number with format. Example
   * 628129999xxx
   * 628129999x[02]x
   * 6281299x9x239
   */
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
    // possible to fill phone number
    let possible_fills: string[][] = []

    ;(phoneNumber.match(prog) || []).map((unknown) => {
      if (unknown == 'x') {
        // when word is 'x' it must be one of number from 0 to 9
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

  /**
   * Create phone number with some options like length of the phoneNumber
   * and total target what you want
   */
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
      yield [ph, i]
      if (totalTarget != Infinity && totalTarget == i) break
    }
  }
}
