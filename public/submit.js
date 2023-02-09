const label = document.querySelector("label[for=gradeLevel]");
const slider = document.querySelector("#gradeLevel");

let oldValue;

function animate() {
    if (slider.value != oldValue) {
        label.textContent = `Grade Level: ${slider.value}`
        oldValue = slider.value;
    }

    requestAnimationFrame(animate);
}

animate();