export function uid(strLength: number = 8): string {
  const numbers:string = '1234567890'
  const letters:string = 'abcdefghijklmnopqrstuvwxyz'
  const characters:string = letters + numbers + letters.toUpperCase();

  return Array(strLength).fill(null).map(() => {
    return characters.charAt(Math.floor(Math.random() * characters.length))
  }).join('')
}