import { readFileSync, writeFileSync } from 'fs'

const html = readFileSync('dist/index.html', 'utf8')
  .replace(/<script type="module" crossorigin>/g, '<script>')

writeFileSync('index.html', html)
console.log('Built index.html (' + Math.round(html.length / 1024) + ' KB)')
