import { replaceTerms } from './glossary';

class Paragraph {
  constructor(subscriber) {
    this.title = document.querySelector('.js-paragraph__title');
    this.body = document.querySelector('.js-paragraph__body');
    this.subscriber = subscriber;
    this.update = this.update.bind(this);
  }

  update(data) {
    while (this.body.firstChild) {
      this.body.removeChild(this.body.firstChild);
    }
    this.title.innerHTML = `Paragraph ${data.number}`;
    const paragraphText = document.createTextNode(data.text);
    this.body.appendChild(paragraphText);
    replaceTerms(this.body, this.subscriber);
    addLineBreaks(this.body);
  }
}

function addLineBreaks(parentElem) {
  const nodes = [];
  for (let i = 0; i < parentElem.childNodes.length; i++) {
    const node = parentElem.childNodes[i];
    if (node.nodeType == Node.TEXT_NODE) {
      let result;
      const regex = new RegExp('\\s(\\(*[a-z]{1,3}[\\)|\\.])\\s', 'gi');
      const idxs = [];
      while ((result = regex.exec(node.nodeValue)) !== null) {
        const idx = result.index;
        idxs.push(idx);
      }
      idxs.reverse();
      nodes.push({ node: node, idxs: idxs });
    }
  }
  for (const item of nodes) {
    const { node, idxs } = item;
    for (const idx of idxs) {
      const replacement = node.splitText(idx);
      const br = document.createElement('br');
      parentElem.insertBefore(br, replacement);
    }
  }
}

export default Paragraph;
