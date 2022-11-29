let selectLanguageButtons = document.querySelectorAll(".language-button");
const requiredLanguageContainer = document.querySelector(".required-language-button-container");
let selectedLanguageButtons = document.querySelectorAll(".selected-language-button");
const languageTextarea = document.querySelector(".selected-language-textarea");
const searchInput = document.querySelector(".search-language-input");

searchInput.addEventListener("input", (event) => {
    const value = event.target.value;
    selectLanguageButtons.forEach(button => {
        const isVisible = button.innerText.includes(value);
        button.classList.toggle("hidden", !isVisible);
    })
})

searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        return;
    };
})

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        return;
    };
})

selectLanguageButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        const language = button.innerText;
        const addValid = addSelectedLanguage(language);
        if (addValid) {
            languageTextarea.value ? languageTextarea.value += `,${language}` : languageTextarea.value = language;
        }

        selectedLanguageButtons = document.querySelectorAll(".selected-language-button")
        selectedLanguageButtons.forEach(selectedButton => {
            selectedButton.addEventListener("click", (event) => {
                event.preventDefault();
                const languageName = selectedButton.innerText;
                languageTextarea.value = removeLanguageFromText(languageTextarea.value, languageName);
                console.log(languageTextarea.value);
                selectedButton.remove();
            })
        })
    })
})

selectedLanguageButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        const languageName = button.innerText;
        languageTextarea.value = removeLanguageFromText(languageTextarea.value, languageName);
        button.remove();
    })
})

function removeLanguageFromText(string, selectedLanguage) {
    const languagesArray = string.split(",");
    for (let i = 0; i < languagesArray.length; i++) {
        if (languagesArray[i] === selectedLanguage) {
            languagesArray.splice(i, 1);
        }
    }
    return languagesArray.toString();
}

function addSelectedLanguage(language) {
    if (languageTextarea.value.includes(language)) {
        return false;
    }
    let button = document.createElement("button");
    let crossIcon = document.createElement("i");
    crossIcon.classList.add("fa-solid", "fa-xmark", "fa-icon");
    button.classList.add("flex", "selected-language-button", "fs-400", "text-neutral-500", "bg-primary-300");
    button.append(language, crossIcon);
    requiredLanguageContainer.append(button);
    return true;
}