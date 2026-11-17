"use strict";

const DATA_URL = "data.json";   // шлях відносно index.html


function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function setTextContent(elementId, text) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.textContent = text;
}


async function loadData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
}


function showError(message) {
    let box = document.getElementById("statusMessage");

    if (!box) {
        box = document.createElement("div");
        box.id = "statusMessage";
        box.setAttribute("role", "alert");
        box.style.cssText =
            "max-width:746px;margin:0 auto 12px;padding:8px 12px;" +
            "background:#fff3cd;border:1px solid #ffc900;border-radius:4px;" +
            "font:13px sans-serif;color:#25242d;";
        document.body.prepend(box);
    }
    box.textContent = message;
}


function setPersonName(person) {
    setTextContent("personFirstName", person.firstName);
    setTextContent("personLastName", person.lastName);
}


function toggleSection(arrow) {

    const targets = arrow.dataset.targets
        ? document.querySelectorAll(arrow.dataset.targets)
        : [document.getElementById(arrow.dataset.target)].filter(Boolean);

    if (targets.length === 0) return;


    const hide = arrow.getAttribute("aria-expanded") === "true";

    targets.forEach((element) => element.classList.toggle("is-hidden", hide));
    arrow.classList.toggle("rotated", hide);
    arrow.setAttribute("aria-expanded", String(!hide));
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


function renderList(selector, items, createItem) {
    const container = document.querySelector(selector);
    if (!container) return;

    container.innerHTML = "";
    container.insertAdjacentHTML("beforeend", items.map(createItem).join(""));
}


async function init() {
    initToggleArrows();

    try {
        const data = await loadData(DATA_URL);

        setPersonName(data.person);
        renderList("#experienceList", data.experience, createExperienceItem);
        renderList(".skills-list", data.skills, createSkillItem);
    } catch (error) {
        console.error(error);
        showError(`Не вдалося завантажити дані (${DATA_URL}): ${error.message}`);
    }
}

document.addEventListener("DOMContentLoaded", init);