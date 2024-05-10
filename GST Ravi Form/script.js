// Put this whole code in Custom Javascript Footer, before pasting this add a <script>paste your code in between this</script>
const clientName = "RAVI";
const amount = "197";
const purpose = "test";
const redirectUrl = "https://google.com";
const userDetailWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzNDA0M2M1MjY1NTUzZDUxMzci_pc";
const paymentDetailWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzNDA0M2M1MjY1NTUzZDUxMzci_pc";
const checkPaymentWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzNDA0M2M1MjY1NTUzZDUxMzci_pc";

const form = document.getElementById("details");
const paymentButton = document.getElementById("payment");

document.getElementsByClassName("amount")[0].innerText = `₹${amount}.00`;

const gst = Number(amount) * 0.18;
document.getElementsByClassName("gst")[0].innerText = `₹${gst.toFixed(2)}`;

const total = Number(amount) + gst;
document.getElementsByClassName(
  "total-amount"
)[0].innerText = `₹${total.toFixed(2)}`;

paymentButton.innerText = `Pay ₹${total.toFixed(2)}`;

const getInput = (name) => {
  return document.getElementById(name);
};

const setBorder = (input, value) => {
  input.style.border = value;
};

const isValidName = (name) => {
  // Check if the name is not empty
  if (!name.trim()) {
    return false;
  }

  // Check if the name contains only letters (no numbers or special characters)
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name.trim());
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[5-9][0-9]{9}$/;
  const sequentialPattern = /(.)\1{9}/; // Check for 10 repeated digits
  const sequentialMatch = phone.match(sequentialPattern);
  return phoneRegex.test(phone) && !sequentialMatch;
};

paymentButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
  };

  let isValid = true;

  if (!isValidName(formData.name)) {
    const nameError = getInput("nameError");
    nameError.style.display = "flex";
    const input = getInput("name");
    input.oninput = function () {
      nameError.style.display = "none";
      setBorder(input, "");
    };
    setBorder(input, "1px solid red");
    isValid = false;
  }

  if (!isValidEmail(formData.email)) {
    const emailError = getInput("emailError");
    emailError.style.display = "flex";
    const input = getInput("email");
    input.oninput = function () {
      emailError.style.display = "none";
      setBorder(input, "");
    };
    setBorder(input, "1px solid red");
    isValid = false;
  }

  if (!isValidPhone(formData.phone)) {
    const phoneError = getInput("phoneError");
    phoneError.style.display = "flex";
    const input = getInput("phone");
    input.oninput = function () {
      phoneError.style.display = "none";
      setBorder(input, "");
    };
    setBorder(input, "1px solid red");
    isValid = false;
  }

  if (isValid) {
    paymentButton.disabled = true;
    paymentButton.style.opacity = 0.7;
    paymentButton.innerText = "Submitting...";
    const urlParams = new URLSearchParams(window.location.search);
    const data = {
      name: formData.name,
      amount,
      email: formData.email,
      phone: formData.phone,
      purpose,
      redirectUrl,
      utm_source: urlParams.get("utm_source"),
      utm_medium: urlParams.get("utm_medium"),
      utm_campaign: urlParams.get("utm_campaign"),
      utm_adgroup: urlParams.get("utm_adgroup"),
      utm_content: urlParams.get("utm_content"),
      utm_term: urlParams.get("utm_term"),
      utm_id: urlParams.get("utm_id"),
      adsetname: urlParams.get("adset name"),
      adname: urlParams.get("ad name"),
      landingPageUrl: window.location.href,
    };

    const updatedData = {
      formData: data,
      userDetailWebhook,
      paymentDetailWebhook,
      checkPaymentWebhook,
    };
    try {
      const response = await fetch(
        `https://instamojopaymentsetup-test.onrender.com/api/payments/new/instamojo/createPayment/${clientName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      form.style.display = "none";
      document.getElementById("loader-container").style.display = "flex";
      const jsonData = await response.json();
      console.log(jsonData);
      paymentButton.disabled = false;
      paymentButton.style.opacity = 1;
      paymentButton.innerText = "Pay ₹12.00";
      window.location.href = jsonData.data;
    } catch (error) {
      alert("Some error occured! Please retry");
      console.log(error);
    }
  }
});
