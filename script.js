const requests = {
  branch: {
    id: "HFCU-2048",
    label: "In service queue",
    title: "Branch visit check-in",
    eta: "18 min",
    progress: 58,
    stepTwo: "Identity confirmed",
    stepThree: "Waiting for next specialist",
    stepFour: "Service completed",
    nextAction: "Stay nearby. You will receive a text when the service desk is ready."
  },
  loan: {
    id: "HFCU-3316",
    label: "Under review",
    title: "Personal loan review",
    eta: "1 day",
    progress: 72,
    stepTwo: "Documents matched",
    stepThree: "Credit team reviewing",
    stepFour: "Decision sent",
    nextAction: "Upload the latest paystub to prevent a review delay."
  },
  notary: {
    id: "HFCU-4407",
    label: "Ready to schedule",
    title: "Remote notarization",
    eta: "Today",
    progress: 84,
    stepTwo: "ID verification passed",
    stepThree: "Choose notary session",
    stepFour: "Stamped document returned",
    nextAction: "Select a live notary slot and upload the document before the session."
  }
};

const requestInput = document.querySelector("#requestId");
const lookup = document.querySelector("#lookup");
const requestButtons = Array.from(document.querySelectorAll(".sample-request"));

function renderRequest(type) {
  const request = requests[type] || requests.branch;
  requestInput.value = request.id;
  document.querySelector("#statusLabel").textContent = request.label;
  document.querySelector("#statusTitle").textContent = request.title;
  document.querySelector("#eta").textContent = request.eta;
  document.querySelector("#progress").style.width = `${request.progress}%`;
  document.querySelector("#stepTwo").textContent = request.stepTwo;
  document.querySelector("#stepThree").textContent = request.stepThree;
  document.querySelector("#stepFour").textContent = request.stepFour;
  document.querySelector("#nextAction").textContent = request.nextAction;

  requestButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.request === type);
  });
}

requestButtons.forEach((button) => {
  button.addEventListener("click", () => renderRequest(button.dataset.request));
});

lookup.addEventListener("click", () => {
  const value = requestInput.value.toLowerCase();
  if (value.includes("3316") || value.includes("loan")) renderRequest("loan");
  else if (value.includes("4407") || value.includes("notary")) renderRequest("notary");
  else renderRequest("branch");
});

Array.from(document.querySelectorAll(".nav-item")).forEach((item) => {
  item.addEventListener("click", () => {
    const phone = item.closest(".phone");
    const tab = item.dataset.tab;
    phone.querySelectorAll(".nav-item").forEach((navItem) => {
      navItem.classList.toggle("is-active", navItem === item);
    });
    phone.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === tab);
    });
  });
});

const notaryFlows = {
  affidavit: {
    title: "Affidavit notarization",
    eligibility: "Eligible in your state",
    eta: "Today",
    progress: 76,
    upload: "Affidavit uploaded",
    session: "Choose a live notary slot",
    panel: "Your affidavit is eligible for remote notarization. Bring your government ID and join from a quiet, well-lit place."
  },
  loan: {
    title: "Loan document notarization",
    eligibility: "HFCU review required",
    eta: "1 day",
    progress: 62,
    upload: "Loan packet uploaded",
    session: "Waiting on document review",
    panel: "The loan packet can be notarized after HFCU confirms the signer, document version, and required witnesses."
  },
  poa: {
    title: "Power of attorney",
    eligibility: "Witness check needed",
    eta: "2 days",
    progress: 48,
    upload: "POA draft uploaded",
    session: "Confirm witness requirements",
    panel: "Power of attorney requests need extra readiness checks before a remote session can be scheduled."
  }
};

const notaryTypeButtons = Array.from(document.querySelectorAll(".notary-type"));
const notarySlotButtons = Array.from(document.querySelectorAll(".notary-slot"));
const notaryCheckButtons = Array.from(document.querySelectorAll(".notary-check"));

function renderNotaryFlow(type) {
  const flow = notaryFlows[type] || notaryFlows.affidavit;
  document.querySelector("#notaryEligibility").textContent = flow.eligibility;
  document.querySelector("#notaryTitle").textContent = flow.title;
  document.querySelector("#notaryEta").textContent = flow.eta;
  document.querySelector("#notaryProgress").style.width = `${flow.progress}%`;
  document.querySelector("#notaryUploadText").textContent = flow.upload;
  document.querySelector("#notarySessionText").textContent = flow.session;
  document.querySelector("#notaryPanelText").textContent = flow.panel;

  notaryTypeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.notaryType === type);
  });
}

notaryTypeButtons.forEach((button) => {
  button.addEventListener("click", () => renderNotaryFlow(button.dataset.notaryType));
});

notarySlotButtons.forEach((button) => {
  button.addEventListener("click", () => {
    notarySlotButtons.forEach((slot) => slot.classList.toggle("is-active", slot === button));
    document.querySelector("#notarySessionText").textContent = `Session held for ${button.dataset.slot}`;
    document.querySelector("#notaryProgress").style.width = "88%";
  });
});

notaryCheckButtons.forEach((button) => {
  button.addEventListener("click", () => {
    notaryCheckButtons.forEach((check) => check.classList.remove("is-current"));
    button.classList.add("is-complete", "is-current");
  });
});
