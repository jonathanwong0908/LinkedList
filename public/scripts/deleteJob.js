const deleteJobButtons = document.querySelectorAll(".delete-job-button");
const deleteJobModal = document.querySelector(".delete-job-modal-container");
let cancelButton;

deleteJobButtons.forEach(button => {
    button.addEventListener("click", () => {
        deleteJobModal.classList.remove("hidden");
        cancelButton = document.querySelector(".cancel-button");
        cancelButton.addEventListener("click", (event) => {
            event.preventDefault();
            deleteJobModal.classList.add("hidden");
        })
    })
})