const matchRateIndicators = document.querySelectorAll(".match-percentage-indicator");

matchRateIndicators.forEach(indicator => {
    const value = +indicator.firstElementChild.innerText.slice(0, -1);
    const degree = (value / 100) * 360;
    indicator.style.background = `conic-gradient(hsl(43 88% 60%) ${degree}deg, hsl(42, 89%, 89%) 0deg)`
})