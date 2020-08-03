export function getRandomNumber(max) {
  return (Math.random() * ((max || 1000) - 1) + 1).toFixed()
}