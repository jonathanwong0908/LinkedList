const languageFilterButton = document.querySelector(".language-selector-button");
const languageFilterContainer = document.querySelector(".language-input-container");
const salaryFilterButton = document.querySelector(".salary-selector-button");
const salaryFilterContainer = document.querySelector(".salary-input-container");
const searchLanguageInput = document.querySelector(".search-language-input");
const languageCheckboxContainers = document.querySelectorAll(".language-checkbox-container");
const languageCheckboxes = document.querySelectorAll(".language-checkbox");
const matchRateIndicators = document.querySelectorAll(".match-percentage-indicator");

languageFilterContainer.classList.add("hidden");
salaryFilterContainer.classList.add("hidden");

languageFilterButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (!salaryFilterContainer.classList.contains("hidden")) {
        salaryFilterContainer.classList.add("hidden");
    }
    languageFilterContainer.classList.toggle("hidden");
})

salaryFilterButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (!languageFilterContainer.classList.contains("hidden")) {
        languageFilterContainer.classList.add("hidden");
    }
    salaryFilterContainer.classList.toggle("hidden");
})

searchLanguageInput.addEventListener("input", (event) => {
    const value = event.target.value;
    languageCheckboxes.forEach(checkbox => {
        const isVisible = checkbox.innerText.includes(value);
        checkbox.closest(".language-checkbox-container").classList.toggle("hidden", !isVisible);
    })
})

matchRateIndicators.forEach(indicator => {
    const value = +indicator.firstElementChild.innerText.slice(0, -1);
    const degree = (value / 100) * 360;
    indicator.style.background = `conic-gradient(hsl(43 88% 60%) ${degree}deg, hsl(42, 89%, 89%) 0deg)`
})