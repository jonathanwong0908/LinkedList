const languageFilterButton = document.querySelector(".language-selector-button");
const languageFilterContainer = document.querySelector(".language-input-container");
const salaryFilterButton = document.querySelector(".salary-selector-button");
const salaryFilterContainer = document.querySelector(".salary-input-container");
const searchLanguageInput = document.querySelector(".search-language-input");
const languageCheckboxContainers = document.querySelectorAll(".language-checkbox-container");
const languageCheckboxes = document.querySelectorAll(".language-checkbox");

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