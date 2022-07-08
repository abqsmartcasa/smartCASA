function parseDate(dateString) {
  const date = new Date(dateString);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  return `${monthNames[monthIndex]}  ${day} ${year}`;
}

function calculateScore(imr) {
  let score = 0;
  if (imr.primaryCompliance == 'not in compliance') {
    score = -3;
  } else if (imr.primaryCompliance == 'in compliance') {
    if (imr.secondaryCompliance == 'not in compliance') {
      score = -2;
    } else if (imr.secondaryCompliance == 'in compliance') {
      if (imr.operationalCompliance == 'in compliance') {
        score = 3;
      } else if (imr.operationalCompliance == 'not in compliance') {
        score = -1;
      } else {
        score = 2;
      }
    } else {
      score = 1;
    }
  }
  return score;
}

function calculateComplianceSummary(imr) {
  let complianceSummary = 'Not Measured/Not Yet Due';
  if (imr.primaryCompliance == 'Not In Compliance') {
    complianceSummary = 'Primary Non-Compliance';
  } else if (imr.primaryCompliance == 'In Compliance') {
    if (imr.secondaryCompliance == 'Not In Compliance') {
      complianceSummary = 'Secondary Non-Compliance';
    } else if (imr.secondaryCompliance == 'In Compliance') {
      if (imr.operationalCompliance == 'In Compliance') {
        complianceSummary = 'Operational Compliance';
      } else if (imr.operationalCompliance == 'Not In Compliance') {
        complianceSummary = 'Operational Non-Compliance';
      } else {
        complianceSummary = 'Secondary Compliance';
      }
    } else {
      complianceSummary = 'Primary Compliance';
    }
  }
  return complianceSummary;
}

export { parseDate, calculateComplianceSummary, calculateScore };
