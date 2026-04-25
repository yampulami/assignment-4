const $ = document.querySelector.bind(document);

const breedInput = $("#breed");
const dataListEl = $("#breeds");
const dogImgEl = $("#dog-img");
const errorEl = $("#img-err-text");
const placeholderEl = $("#img-placeholder");
const timeLogEl = $("#img-time-log");
const secondsEl = $("#img-change-seconds");

let imageIntervalId = null;
let countdownIntervalId = null;
let secondsRemaining = 5;

function toApiPath(breedValue) {
  const breedParts = breedValue.trim().toLowerCase().split(/\s+/);

  if (breedParts.length > 1) {
    return `${breedParts[1]}/${breedParts[0]}`;
  }

  return breedParts[0];
}

function resetCountdown() {
  secondsRemaining = 5;
  secondsEl.textContent = "5 seconds";
}

function startCountdown() {
  clearInterval(countdownIntervalId);
  resetCountdown();

  countdownIntervalId = setInterval(() => {
    secondsRemaining = secondsRemaining === 1 ? 5 : secondsRemaining - 1;
    secondsEl.textContent = `${secondsRemaining} ${
      secondsRemaining === 1 ? "second" : "seconds"
    }`;
  }, 1000);
}

function showError(message) {
  dogImgEl.classList.add("hide");
  timeLogEl.classList.add("hide");
  placeholderEl.classList.add("hide");
  errorEl.textContent = message;
  errorEl.classList.remove("hide");
}

function showImage(imageUrl, breedLabel) {
  dogImgEl.src = imageUrl;
  dogImgEl.alt = breedLabel;
  dogImgEl.classList.remove("hide");
  errorEl.classList.add("hide");
  placeholderEl.classList.add("hide");
  timeLogEl.classList.remove("hide");
}

async function fetchBreedImage() {
  const breed = breedInput.value.trim();

  if (!breed) {
    showError("Please enter a dog breed.");
    clearInterval(imageIntervalId);
    clearInterval(countdownIntervalId);
    return false;
  }

  const response = await fetch(`/image/${toApiPath(breed)}`);
  const data = await response.json();

  if (response.ok && data.status === "success") {
    showImage(data.message, breed);
    return true;
  }

  showError("Breed not found! Please try another breed.");
  return false;
}

async function fetchAllBreeds() {
  const response = await fetch("/breeds");
  const data = await response.json();

  const breeds = Object.keys(data.message)
    .map((breed) => {
      if (data.message[breed].length > 0) {
        return data.message[breed].map((type) => `${type} ${breed}`);
      }

      return breed;
    })
    .flat();

  breeds.forEach((breed) => {
    const optionEl = document.createElement("option");
    optionEl.value = breed;
    dataListEl.appendChild(optionEl);
  });
}

async function handleBreedSubmit(event) {
  event.preventDefault();

  clearInterval(imageIntervalId);
  clearInterval(countdownIntervalId);

  const imageFound = await fetchBreedImage();

  if (!imageFound) {
    return;
  }

  startCountdown();
  imageIntervalId = setInterval(async () => {
    const refreshed = await fetchBreedImage();

    if (refreshed) {
      resetCountdown();
    }
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAllBreeds();
  $("#dog-form").addEventListener("submit", handleBreedSubmit);
});
