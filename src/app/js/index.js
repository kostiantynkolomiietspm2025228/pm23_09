"use strict";


const FULL_NAME = "JHON ABIRAR";

const experienceData = [
    {
        position: "Enter Job Position Here",
        period: "Present",
        company: "Company Name / Location",
        description: "Lorem ipsum dolor sit amet, this is a thena consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore."
    },
    {
        position: "Enter Job Position Here",
        period: "2017 - 2019",
        company: "Company Name / Location",
        description: "Lorem ipsum dolor sit amet, this is a thena consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore."
    }
];


const skillsData = [
    { lines: ["Adobe", "Photoshop"],   progress: 280 },
    { lines: ["Adobe", "Illustrator"], progress: 260 },
    { lines: ["Adobe", "Indesign"],    progress: 245 },
    { lines: ["Power", "Point"],       progress: 300 }
];


function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function setTextContent(elementId, text) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.textContent = text;          // тільки текст, без вставлення HTML
}


function setPersonName(fullName) {
    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    setTextContent("personFirstName", firstName);
    setTextContent("personLastName", rest.join(" "));
}


function toggleSection(arrow) {
    const content = document.getElementById(arrow.dataset.target);
    if (!content) return;

    const isHidden = content.classList.toggle("is-hidden");   // показати / сховати
    arrow.classList.toggle("rotated", isHidden);              // повернути стрілку
    arrow.setAttribute("aria-expanded", String(!isHidden));
}

function initToggleArrows() {
    document.querySelectorAll(".toggle-arrow").forEach((arrow) => {
        arrow.addEventListener("click", () => toggleSection(arrow));

        arrow.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleSection(arrow);
            }
        });
    });
}


function createExperienceItem(item) {
    return `
        <div class="experience-item">
            <h3>${escapeHtml(item.position)}</h3>
            <div class="experience-info">
                <span class="year-badge">${escapeHtml(item.period)}</span>
                <span>${escapeHtml(item.company)}</span>
            </div>
            <p>${escapeHtml(item.description)}</p>
        </div>`;
}

function createSkillItem(skill) {
    const label = skill.lines.map(escapeHtml).join("<br>");
    return `
        <div class="skill">
            <div class="skill-circle" style="--progress: ${Number(skill.progress)}deg">
                <span>${label}</span>
            </div>
        </div>`;
}


function renderList(containerId, items, createItem) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    container.insertAdjacentHTML("beforeend", items.map(createItem).join(""));
}


document.addEventListener("DOMContentLoaded", () => {
    setPersonName(FULL_NAME);
    renderList("experienceList", experienceData, createExperienceItem);
    renderList("skillsList", skillsData, createSkillItem);
    initToggleArrows();
});