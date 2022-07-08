class ParagraphItem {
  constructor(data, api, subscriber) {
    this.elem = document.createElement('li');
    this.api = api;
    this.subscriber = subscriber;
    this.data = data;
    this.elem.innerHTML = `${this.data.number} - ${this.data.text.split(' ').slice(0, 5).join(' ')}`;
    this.selectParagraph = this.selectParagraph.bind(this);
    this.addEventListeners();
  }

  addEventListeners() {
    this.elem.addEventListener('click', this.selectParagraph);
  }

  show() {
    this.elem.classList.remove('paragraph-choice--hidden');
  }

  hide() {
    this.elem.classList.add('paragraph-choice--hidden');
  }

  selectParagraph() {
    this.subscriber.publish('paragraph-change', this.data);
    this.api.getComplianceByParagraph(this.data.number).then(data => {
      this.api.getAllReports().then(reports => {
        for (let i = 0; i < data.length; i++) {
          data[i].report = reports[i];
        }
        this.subscriber.publish('report-list-change', data);
        document.querySelector(
          '.title-paragraph-number'
        ).innerHTML = this.data.number;
      });
    });
  }
}

class ParagraphSelect {
  constructor(api, subscriber) {
    this.subscriber = subscriber;
    this.api = api;
    this.timeout;
    this.active = false;
    this.disabled = false;
    this.elem = document.querySelector('.paragraph-select');
    this.dropdown = document.querySelector('.paragraph-list');
    this.createList = this.createList.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.filterList = this.filterList.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.paragraphs = [];
    this.filter = [];
    this.addEventListeners();
  }

  createList(data) {
    const frag = document.createDocumentFragment();
    for (const obj of data) {
      const paragraphItem = new ParagraphItem(obj, this.api, this.subscriber);
      this.paragraphs.push(paragraphItem);
      frag.appendChild(paragraphItem.elem);
    }
    this.paragraphs[13].selectParagraph();
    this.dropdown.appendChild(frag);
  }

  addEventListeners() {
    this.elem.addEventListener('click', this.toggleDropdown);
  }

  toggleDropdown() {
    clearTimeout(this.timeout);
    if (this.active) {
      this.elem.classList.remove('paragraph-select--active');
      this.active = false;
      this.timeout = setTimeout(() => {
        this.dropdown.classList.remove('paragraph-list--overflow');
      }, 200);
    } else {
      this.elem.classList.add('paragraph-select--active');
      this.active = true;
      this.timeout = setTimeout(() => {
        this.dropdown.classList.add('paragraph-list--overflow');
      }, 200);
    }
  }

  removeFilter() {
    this.filter = [];
    this.paragraphs.map(paragraph => {
      paragraph.show();
    });
  }

  filterList(data) {
    this.removeFilter();
    if (data) {
      this.filter = data;
      const filterSet = new Set(this.filter);
      for (const paragraph of this.paragraphs) {
        if (!filterSet.has(paragraph.number)) {
          paragraph.hide();
        } else {
          paragraph.show();
        }
      }
    }
  }
}

export default ParagraphSelect;
