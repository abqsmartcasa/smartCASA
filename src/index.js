import './copy-button';
import Help from './help';
import API from './api-client';
import { Term } from './glossary';
import Modal from './modal';
import ParagraphSelect from './paragraph-select';
import Paragraph from './paragraph';
import ComplianceList from './compliance-list';
import ComplianceChart from './compliance-chart';
import Search from './search';

{
  const api = new API({ URL: 'https://api.smartcasa.org', lang: 'en-US' });
  const paragraph = new Paragraph();
  const complianceList = new ComplianceList();
  const complianceChart = new ComplianceChart(complianceList);
  const modal = new Modal();

  const paragraphSelect = new ParagraphSelect(
    api,
    paragraph,
    complianceList,
    complianceChart
  );
  new Search(paragraphSelect);
  const helpTerm = new Term({
    text: 'term',
    definition: 'an example definition'
  });
  helpTerm.elem.style.zIndex = 99999;
  const helpFrag = document.createDocumentFragment();
  const t = document.createTextNode('Click any ');
  const s = document.createTextNode(' underlined to show its CASA definition');
  helpFrag.appendChild(t);
  helpFrag.appendChild(helpTerm.elem);
  helpFrag.appendChild(s);
  new Help('.js-paragraph-help', helpFrag);
  api.getAllParagraphs().then(data => {
    paragraphSelect.createList(data);
  });
  let cookie = false;
  const cookies = document.cookie.split('; ');
  for (const c of cookies) {
    if (c == 'visited=True') {
      cookie = true;
    }
  }
  if (!cookie) {
    modal.open();
    document.cookie = `visited=True; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  }
}
