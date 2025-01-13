function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findElementGlobal(selector, root = document) {
  let elements = [];

  elements.push(...root.querySelectorAll(selector));

  if (root.shadowRoot) {
    elements.push(...findElementGlobal(selector, root.shadowRoot));
  }

  root.querySelectorAll("*").forEach((child) => {
    if (child.shadowRoot) {
      elements.push(...findElementGlobal(selector, child.shadowRoot));
    }
  });

  return elements;
}

async function fixCards() {
  let cards = null;
  while (cards === null) {
    await wait(50);
    if (findElementGlobal("d2l-enrollment-card").length != 0) cards = findElementGlobal("d2l-enrollment-card");
  }

  cards.forEach((card) => {
    console.log(findElementGlobal("d2l-card")[0].getAttribute("text"));
  });
}

async function fixTabs() {
  const helpCard = document.querySelector("div[class='d2l-widget d2l-tile d2l-custom-widget']");
  helpCard.remove();
  const wellnessNavigator = document.querySelector("div[class='d2l-widget d2l-tile d2l-custom-widget']");
  wellnessNavigator.remove();

  let coursesBody = document
    .querySelector("d2l-my-courses")
    .shadowRoot.querySelector("d2l-my-courses-container")
    .shadowRoot.querySelector("d2l-tabs");
  while (coursesBody === null) {
    coursesBody = document.querySelector("d2l-my-courses").shadowRoot.querySelector("d2l-my-courses-container").shadowRoot.querySelector("d2l-tabs");
    await wait(50);
  }

  coursesBody.shadowRoot.querySelector(".d2l-tabs-layout").style.display = "none";

  const tabs = coursesBody.shadowRoot
    .querySelector(".d2l-tabs-layout")
    .querySelector(".d2l-tabs-container")
    .querySelector(".arrow-keys-container")
    .querySelector(".d2l-tabs-container-list")
    .querySelectorAll("d2l-tab-internal");

  const tabsSelectElement = document.createElement("select");

  tabs.forEach((tab) => {
    const tabHtml = tab.shadowRoot.firstElementChild.innerHTML;
    const tabTitle = tabHtml.substring(tabHtml.indexOf("-->") + 3);

    const optionElement = document.createElement("option");
    optionElement.value = tabTitle;
    optionElement.textContent = tabTitle;

    optionElement.addEventListener("click", () => {
      tab.click();
    });

    tabsSelectElement.appendChild(optionElement);

    if (tab.getAttribute("aria-selected") === "true") {
      tabsSelectElement.value = tabTitle;
    }
  });

  tabsSelectElement.addEventListener("change", (e) => {
    e.target.querySelector(`option[value='${e.target.value}']`).click();
  });

  document
    .querySelector(".d2l-page-main")
    .querySelector(".d2l-page-main-padding")
    .querySelector(".d2l-homepage")
    .querySelector(".homepage-container")
    .querySelector(".homepage-row")
    .firstElementChild.querySelector(".homepage-col-8")
    .querySelector(".d2l-widget")
    .querySelector("d2l-expand-collapse-content")
    .insertAdjacentElement("beforebegin", tabsSelectElement);
}

fixTabs();

fixCards();
