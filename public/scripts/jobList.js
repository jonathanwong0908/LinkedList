const languageFilterButton = document.querySelector(".language-selector-button");
const languageFilterContainer = document.querySelector(".language-input-container");
const salaryFilterButton = document.querySelector(".salary-selector-button");
const salaryFilterContainer = document.querySelector(".salary-input-container");

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