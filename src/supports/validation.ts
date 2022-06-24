// check body is numeric or not
export const isNumber = (body: string | number) => /^\d$/.test(body.toString())
