class IncrementButton {
  constructor(api, subscriber) {
    this.api = api;
    this.elem = document.querySelector('.js-next-paragraph');
    this.paragraphs = [];
    this.subscriber = subscriber;
    this.currentParagraph;
    this.onClick = this.onClick.bind(this);
    this.update = this.update.bind(this);
    this.addEventListeners = this.addEventListeners.bind(this);

    this.addEventListeners();
  }

  addEventListeners() {
    this.elem.addEventListener('click', this.onClick);
  }

  onClick() {
    const currentIdx = this.paragraphs.indexOf(this.currentParagraph);
    this.elem.classList.add('paragraph-btn--clicked');
    setTimeout(() => {
      this.elem.classList.remove('paragraph-btn--clicked');
    }, 300);
    this.update(this.paragraphs[currentIdx + 1]);
    if (this.currentParagraph.id != 344) {
      this.api.getComplianceByParagraph(this.currentParagraph.number).then(data => {
        this.api.getAllReports().then(reports => {
          for (let i = 0; i < data.length; i++) {
            data[i].report = reports[i];
          }
          this.subscriber.publish('report-list-change', data);
          document.querySelector(
            '.title-paragraph-number'
          ).innerHTML = this.currentParagraph.number;
        });
      });
    }
    this.subscriber.publish('paragraph-inc', this.currentParagraph);
  }

  update(paragraph) {
    this.elem.classList.remove('paragraph-btn--hidden');
    this.currentParagraph = paragraph;
    if (this.currentParagraph.id == 344) {
      this.elem.classList.add('paragraph-btn--hidden');
    }
  }
}

class DecrementButton {
  constructor(api, subscriber) {
    this.api = api;
    this.elem = document.querySelector('.js-previous-paragraph');
    this.paragraphs = [];
    this.subscriber = subscriber;
    this.currentParagraph;
    this.onClick = this.onClick.bind(this);
    this.update = this.update.bind(this);
    this.addEventListeners = this.addEventListeners.bind(this);

    this.addEventListeners();
  }

  addEventListeners() {
    this.elem.addEventListener('click', this.onClick);
  }

  onClick() {
    const currentIdx = this.paragraphs.indexOf(this.currentParagraph);
    this.elem.classList.add('paragraph-btn--clicked');
    setTimeout(() => {
      this.elem.classList.remove('paragraph-btn--clicked');
    }, 400);
    this.update(this.paragraphs[currentIdx - 1]);
    if (this.currentParagraph.number != 1) {
      this.api.getComplianceByParagraph(this.currentParagraph.number).then(data => {
        this.api.getAllReports().then(reports => {
          for (let i = 0; i < data.length; i++) {
            data[i].report = reports[i];
          }
          this.subscriber.publish('report-list-change', data);
          document.querySelector(
            '.title-paragraph-number'
          ).innerHTML = this.currentParagraph.number;
        });
      });
    }
    this.subscriber.publish('paragraph-dec', this.currentParagraph);
  }

  update(paragraph) {
    this.elem.classList.remove('paragraph-btn--hidden');
    this.currentParagraph = paragraph;
    if (this.currentParagraph.number == 1) {
      this.elem.classList.add('paragraph-btn--hidden');
    }
  }
}

export { DecrementButton, IncrementButton };
