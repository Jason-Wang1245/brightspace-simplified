async function main() {
  const helpCard = document.querySelector("div[class='d2l-widget d2l-tile d2l-custom-widget']");
  helpCard.remove();
  const wellnessNavigator = document.querySelector("div[class='d2l-widget d2l-tile d2l-custom-widget']");
  wellnessNavigator.remove();

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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

  console.log(tabs);

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
    console.log(e.target.value);
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

main().then(() => {
  console.log("done");
});
