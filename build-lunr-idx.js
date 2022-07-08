const lunr = require('lunr');
const fs = require('fs');

fetch('https://api.smartcasa.org/paragraphs').then(res => res.json()).then(data => {
  const idx = lunr(function() {
    this.ref('number');
    this.field('text');
    for (const paragraph of data) {
      this.add(paragraph);
    }
  });
  fs.writeFile('lunr-index.json', JSON.stringify(idx), () => {
    console.log('done');
  });
})
