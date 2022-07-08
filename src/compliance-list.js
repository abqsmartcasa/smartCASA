import { Term } from './glossary';
import { parseDate, calculateComplianceSummary, calculateScore } from './utils';

function titleCase(text) { return text.toLowerCase()
.split(' ')
.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
.join(' ');
}


class ComplianceList {
	constructor(subscriber) {
		this.title = document.querySelector('.report-title');
		this.pages = document.querySelector('.report-pages');
		this.reportData = document.querySelector('.report-data');
		this.subscriber = subscriber;
		this.complianceSummary = document.querySelector('.js-compliance-summary__value');
		this.primaryCompliance = document.querySelector('.compliance-list li:nth-child(1)');
		this.secondaryCompliance = document.querySelector('.compliance-list li:nth-child(2)');
		this.operationalCompliance = document.querySelector('.compliance-list li:nth-child(3)');
		this.update = this.update.bind(this);
		this.buildList = this.buildList.bind(this);
		this.buildList();
	}

	buildList() {
		const primaryComplianceTerm = new Term(
			{
				text: 'Primary Compliance',
				term: 'Primary Compliance',
				definition: `Primary compliance is the “policy” part of compliance. To attain primary compliance, APD must have in place operational policies and procedures designed to guide officers, supervisors and managers in the performance of the tasks outlined in the CASA. As a matter of course, the policies must be reflective of the requirements of the CASA; must comply with national standards for effective policing policy; and must demonstrate trainable and evaluable policy components.`
			},
			this.subscriber
		);
		const primaryFrag = document.createDocumentFragment();
		primaryFrag.appendChild(primaryComplianceTerm.elem);
		primaryFrag.appendChild(document.createTextNode(': '));
		this.primaryCompliance.insertBefore(primaryFrag, document.querySelector('.js-primary-compliance'));
		const secondaryComplianceTerm = new Term(
			{
				text: 'Secondary Compliance',
				term: 'Secondary Compliance',
				definition: `Secondary compliance is attained by
      implementing supervisory, managerial and executive practices
      designed to (and effective in) implementing the policy as written,
      e.g., sergeants routinely enforce the policies among field
      personnel and are held accountable by managerial and executive
      levels of the department for doing so. By definition, there should
      be operational artifacts (reports, disciplinary records, remands to
      retraining, follow-up, and even revisions to policies if necessary,
      indicating that the policies developed in the first stage of
      compliance are known to, followed by, and important to
      supervisory and managerial levels of the agency.`
			},
			this.subscriber
		);
		const secondaryFrag = document.createDocumentFragment();
		secondaryFrag.appendChild(secondaryComplianceTerm.elem);
		secondaryFrag.appendChild(document.createTextNode(': '));
		this.secondaryCompliance.insertBefore(secondaryFrag, document.querySelector('.js-secondary-compliance'));
		const operationalComplianceTerm = new Term(
			{
				text: 'Operational Compliance',
				term: 'Operational Compliance',
				definition: `Operational compliance is attained at
      the point that the adherence to policies is apparent in the day-today 
      operation of the agency e.g., line personnel are routinely held
      accountable for compliance, not by the monitoring staff, but by
      their sergeants, and sergeants are routinely held accountable for
      compliance by their lieutenants and command staff. In other
      words, the APD “owns” and enforces its policies.`
			},
			this.subscriber
		);
		const operationalFrag = document.createDocumentFragment();
		operationalFrag.appendChild(operationalComplianceTerm.elem);
		operationalFrag.appendChild(document.createTextNode(': '));
		this.operationalCompliance.insertBefore(operationalFrag, document.querySelector('.js-operational-compliance'));
	}

	update(data) {
		console.log("data");
		console.log(data)
		this.complianceSummary.innerHTML = '';
		while (this.pages.firstChild) {
			this.pages.removeChild(this.pages.firstChild);
		}

		this.title.innerHTML = '';
		this.reportData.innerHTML = '';
		this.reportData.innerHTML = `<b>Publication Date:</b> ${parseDate(
			data.report.publishDate
		)}  <br/><b>Monitoring Period:</b> ${parseDate(data.report.periodBegin)} - ${parseDate(data.report.periodEnd)}`;

		this.complianceSummary.classList.remove(
			'compliance-summary__value--in-compliance',
			'compliance-summary__value--non-compliance',
			'compliance-summary__value--not-measured'
		);

		const complianceSummaries = {
			3: 'compliance-summary__value--in-compliance',
			2: 'compliance-summary__value--in-compliance',
			1: 'compliance-summary__value--in-compliance',
			0: 'compliance-summary__value--not-measured',
			'-1': 'compliance-summary__value--non-compliance',
			'-2': 'compliance-summary__value--non-compliance',
			'-3': 'compliance-summary__value--non-compliance'
		};

		this.primaryCompliance.classList.remove(
			'compliance-list__item--not-in-compliance',
			'compliance-list__item--in-compliance',
			'compliance-list__item--other'
		);
		this.secondaryCompliance.classList.remove(
			'compliance-list__item--not-in-compliance',
			'compliance-list__item--in-compliance',
			'compliance-list__item--other'
		);
		this.operationalCompliance.classList.remove(
			'compliance-list__item--not-in-compliance',
			'compliance-list__item--in-compliance',
			'compliance-list__item--other'
		);
		const compliances = {
			'In Compliance': 'compliance-list__item--in-compliance',
			'Not In Compliance': 'compliance-list__item--not-in-compliance',
			'Not Yet Due': 'compliance-list__item--other',
			'Not Reported': 'compliance-list__item--other',
			Pending: 'compliance-list__item--other',
			'Unable to Monitor': 'compliance-list__item--other'
		};
		this.title.href = `https://s3-us-west-2.amazonaws.com/smartcasa-docs/${data.reportName}.pdf`;

		this.title.innerHTML = `Independent Monitoring Report (IMR) - ${data.reportName.split('-')[1]}:`;
		this.title.title = `Download ${data.reportName} PDF`;
		this.complianceSummary.innerHTML = calculateComplianceSummary(data);
		this.complianceSummary.classList.add(complianceSummaries[calculateScore(data)]);
		let pagesText = '';
		for (const page of data.pages) {
			pagesText += page;
			pagesText += ', ';
		}
		pagesText = pagesText.slice(0, -2);
		// TODO move this to database
		const imrPageOffset = {
			1: 2,
			2: 13,
			3: 15,
			4: 14,
			5: 2,
			6: 2,
			8: 2,
			9: 2,
			10: 2,
			11: 2,
			12: 2,
			13: 2,
			14: 2,
			15: 2
		};
		const pagesAnchor = document.createElement('a');
		pagesAnchor.setAttribute('target', '_blank');
		pagesAnchor.setAttribute('rel', 'noopener');
		const correctedPage = data.pages[0] + imrPageOffset[data.reportName.split('-')[1]];
		pagesAnchor.href = `https://s3-us-west-2.amazonaws.com/smartcasa-docs/${data.reportName}.pdf#page=${correctedPage}`;

		const pages = document.createTextNode(`Pages ${pagesText}`);
		pagesAnchor.appendChild(pages);
		this.pages.appendChild(pagesAnchor);

		const primaryComplianceStatus = document.createTextNode(`${data.primaryCompliance}`);
		const primaryComplianceContainer = document.querySelector('.js-primary-compliance');
		primaryComplianceContainer.classList.remove(
			'compliance-list__item--in-compliance',
			'compliance-list__item--not-in-compliance',
			'compliance-list__item--other'
		);
		while (primaryComplianceContainer.firstChild) {
			primaryComplianceContainer.removeChild(primaryComplianceContainer.firstChild);
		}
		const primaryClass = compliances[titleCase(data.primaryCompliance)];
		primaryComplianceContainer.appendChild(primaryComplianceStatus);
		primaryComplianceContainer.classList.add(primaryClass);

		const secondaryComplianceStatus = document.createTextNode(`${titleCase(data.secondaryCompliance)}`);
		const secondaryComplianceContainer = document.querySelector('.js-secondary-compliance');
		secondaryComplianceContainer.classList.remove(
			'compliance-list__item--in-compliance',
			'compliance-list__item--not-in-compliance',
			'compliance-list__item--other'
		);
		while (secondaryComplianceContainer.firstChild) {
			secondaryComplianceContainer.removeChild(secondaryComplianceContainer.firstChild);
		}
		const secondaryClass = compliances[titleCase(data.secondaryCompliance)];
		secondaryComplianceContainer.appendChild(secondaryComplianceStatus);
		secondaryComplianceContainer.classList.add(secondaryClass);

		const operationalComplianceStatus = document.createTextNode(`${data.operationalCompliance}`);
		const operationalComplianceContainer = document.querySelector('.js-operational-compliance');

		operationalComplianceContainer.classList.remove(
			'compliance-list__item--in-compliance',
			'compliance-list__item--not-in-compliance',
			'compliance-list__item--other'
		);
		while (operationalComplianceContainer.firstChild) {
			operationalComplianceContainer.removeChild(operationalComplianceContainer.firstChild);
		}
		const operationalClass = compliances[titleCase(data.operationalCompliance)];
		operationalComplianceContainer.appendChild(operationalComplianceStatus);
		operationalComplianceContainer.classList.add(operationalClass);
	}
}

export default ComplianceList;
