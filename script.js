const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentStep = 1;
let selectedPlan = "Arcade";

// PRICES

const planPrices = {
  Arcade: 9,
  Advanced: 12,
  Pro: 15,
};

const addonPrices = {
  "Online service": 1,
  "Larger storage": 2,
  "Customizable profile": 2,
};

// BILLING TOGGLE

const yearly = document.getElementById("billingToggle");

// SHOW CURRENT STEP

function showStep() {
  const steps = document.querySelectorAll(".form-step");
  const sideSteps = document.querySelectorAll(".sidebar .step");

  steps.forEach(function (step) {
    step.classList.remove("active");
  });

  sideSteps.forEach(function (step) {
    step.classList.remove("active");
  });

  document.getElementById("step" + currentStep).classList.add("active");

  if (currentStep <= 4) {
    document.getElementById("side" + currentStep).classList.add("active");
  }

  prevBtn.disabled = currentStep === 1;

  if (currentStep === 4) {
    nextBtn.textContent = "Confirm";
  } else {
    nextBtn.textContent = "Next Step";
  }

  if (currentStep === 5) {
    document.querySelector(".buttons").style.display = "none";
  } else {
    document.querySelector(".buttons").style.display = "flex";
  }
}

// VALIDATE STEP 1

function validateStep1() {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  if (
    name.value.trim() === "" ||
    email.value.trim() === "" ||
    phone.value.trim() === ""
  ) {
    alert("Please fill all the fields");
    return false;
  }

  if (!email.checkValidity()) {
    alert("Please enter a valid email");
    return false;
  }

  return true;
}

// SELECT PLAN

const plans = document.querySelectorAll(".plan");

// Get plan name from HTML

plans.forEach(function (plan) {
  const planName = plan.querySelector("h3").textContent.trim();

  plan.dataset.plan = planName;

  if (plan.classList.contains("selected")) {
    selectedPlan = planName;
  }
});

// Handle plan selection

plans.forEach(function (plan) {
  plan.addEventListener("click", function () {
    plans.forEach(function (item) {
      item.classList.remove("selected");
    });

    plan.classList.add("selected");

    selectedPlan = plan.dataset.plan;

    updatePlanPrice();
  });
});

// UPDATE PLAN AND ADDON PRICES

function updatePlanPrice() {
  plans.forEach((plan) => {
    const planName = plan.dataset.plan;
    const price = planPrices[planName];

    const priceText = plan.querySelector("p");
    const freeMonths = plan.querySelector(".free-months");

    if (yearly.checked) {
      priceText.textContent = "$" + price * 10 + "/yr";
      freeMonths.textContent = "2 months free";
    } else {
      priceText.textContent = "$" + price + "/mo";
      freeMonths.textContent = "";
    }
  });

  // Keep your existing add-on pricing logic below this.
  const addonChecks = document.querySelectorAll(".addon-check");

  addonChecks.forEach((addon) => {
    const price = addonPrices[addon.value];
    const priceText = addon.parentElement.querySelector(".addon-price");

    if (yearly.checked) {
      priceText.textContent = "+$" + price * 10 + "/yr";
    } else {
      priceText.textContent = "+$" + price + "/mo";
    }
  });
}

// Listen for toggle changes

yearly.addEventListener("change", function () {
  updatePlanPrice();
});

// UPDATE SUMMARY

function updateSummary() {
  const summary = document.getElementById("summary");

  let planPrice = planPrices[selectedPlan];

  let total = planPrice;

  let billingText = "Monthly";

  let duration = "/mo";

  // YEARLY BILLING

  if (yearly.checked) {
    planPrice = planPrice * 10;

    total = planPrice;

    billingText = "Yearly";

    duration = "/yr";
  }

  // PLAN HTML

  let html = `
    <div class="summary-plan">

      <div>
        <h3>${selectedPlan} (${billingText})</h3>

        <a href="#" id="changePlan">Change</a>
      </div>

      <strong>$${planPrice}${duration}</strong>

    </div>
  `;

  // SELECTED ADDONS

  const selectedAddons = document.querySelectorAll(".addon-check:checked");

  selectedAddons.forEach(function (addon) {
    let price = addonPrices[addon.value];

    if (yearly.checked) {
      price = price * 10;
    }

    total = total + price;

    html += `
      <div class="summary-addon">

        <span>${addon.value}</span>

        <span>+$${price}${duration}</span>

      </div>
    `;
  });

  // DISPLAY SUMMARY

  summary.innerHTML = html;

  // TOTAL BILLING TEXT

  let totalText = "Total (per month)";

  if (yearly.checked) {
    totalText = "Total (per year)";
  }

  summary.innerHTML += `
    <div class="total">

      <span>${totalText}</span>

      <strong>$${total}${duration}</strong>

    </div>
  `;

  // CHANGE PLAN BUTTON

  document
    .getElementById("changePlan")
    .addEventListener("click", function (event) {
      event.preventDefault();

      currentStep = 2;

      showStep();
    });
}

// NEXT BUTTON

nextBtn.addEventListener("click", function () {
  // VALIDATE PERSONAL INFO

  if (currentStep === 1) {
    if (!validateStep1()) {
      return;
    }
  }

  // CONFIRM SUBSCRIPTION

  if (currentStep === 4) {
    currentStep = 5;

    showStep();

    return;
  }

  // GENERATE SUMMARY BEFORE STEP 4

  if (currentStep === 3) {
    updateSummary();
  }

  // MOVE TO NEXT STEP

  if (currentStep < 5) {
    currentStep++;

    showStep();
  }
});

// PREVIOUS BUTTON

prevBtn.addEventListener("click", function () {
  if (currentStep > 1) {
    currentStep--;

    showStep();
  }
});

// INITIALIZE

showStep();
updatePlanPrice();
