export function getElementIndex(el) {
  return Array.from(el.parentElement.children).indexOf(el)
}

export function getNodeIndexIn(node, nodes) {
  return Array.from(nodes).indexOf(node)
}

export function removeElement(el) {
  el.parentElement.removeChild(el)
}

export function minmax(n, min, max) {
  return Math.min(Math.max(n, min), max)
}

export function isEmpty(arg) {
  const type = typeof arg

  if (type === 'object') return Object.entries(arg).length === 0
  else if (type === 'string') return arg.length === 0
  else return arg
}

export function normalize(str) {
  return latinize(str.trim()).toLowerCase()
}

export function latinize(str) {
  let result = ''

  const latin = {
    á: 'a',
    à: 'a',
    â: 'a',
    ã: 'a',
    ä: 'a',
    å: 'a',
    Á: 'A',
    À: 'A',
    Â: 'A',
    Ã: 'A',
    Ä: 'A',
    Å: 'A',
    ç: 'c',
    Ç: 'C',
    é: 'e',
    è: 'e',
    ê: 'e',
    ë: 'e',
    É: 'E',
    È: 'E',
    Ê: 'E',
    Ë: 'E',
    í: 'i',
    ì: 'i',
    î: 'i',
    ï: 'i',
    Í: 'I',
    Ì: 'I',
    Î: 'I',
    Ï: 'I',
    ñ: 'n',
    Ñ: 'N',
    ó: 'o',
    ò: 'o',
    ô: 'o',
    ö: 'o',
    õ: 'o',
    Ó: 'O',
    Ò: 'O',
    Ô: 'O',
    Ö: 'O',
    Õ: 'O',
    ú: 'u',
    ù: 'u',
    û: 'u',
    ü: 'u',
    Ú: 'U',
    Ù: 'U',
    Û: 'U',
    Ü: 'U',
    ý: 'y',
    ÿ: 'y',
    Ý: 'Y',
    Ÿ: 'Y',
  }

  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i)
    result += latin[char] || char
  }

  return result
}

export function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase()
}
