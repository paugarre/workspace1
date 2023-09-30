function toggleDarkMode() {
    const currentTheme = document.querySelector("body").getAttribute("data-bs-theme");
    if (currentTheme === "light") {
        localStorage.setItem("darkMode", "dark");
        document.querySelector("body").setAttribute("data-bs-theme", "dark");
    } else {
        localStorage.setItem("darkMode", "light");
        document.querySelector("body").setAttribute("data-bs-theme", "light");
    }
};


document.addEventListener("DOMContentLoaded", function () {
    const darkMode = localStorage.getItem("darkMode");
    document.querySelector("body").setAttribute("data-bs-theme", darkMode ?? "light");
    const darkModeButton = document.getElementById("dark-mode");

    if (darkModeButton) {
        darkModeButton.addEventListener('click', () => {
            toggleDarkMode();
        })
    }

});
