const filters = document.querySelectorAll(".filter-button");
const items = document.querySelectorAll(".item");
const emptyMessage = document.querySelector(".inventory__empty");
const modeButton = document.querySelector(".mode-button");
const domainButton = document.querySelector(".domain-button");
const domainOverlay = document.querySelector(".domain-overlay");
const toast = document.querySelector(".toast");
let toastTimeout;

filters.forEach((button) => {
	button.addEventListener("click", () => {
		const category = button.dataset.filter;
		filters.forEach((filter) => {
			const active = filter === button;
			filter.classList.toggle("is-active", active);
			filter.setAttribute("aria-pressed", String(active));
		});
		let visibleCount = 0;
		items.forEach((item) => {
			const visible = category === "all" || item.dataset.category === category;
			item.classList.toggle("is-hidden", !visible);
			visibleCount += Number(visible);
		});
		emptyMessage.hidden = visibleCount > 0;
	});
});

modeButton.addEventListener("click", () => {
	const light = document.body.classList.toggle("light-mode");
	modeButton.setAttribute("aria-pressed", String(light));
	modeButton.querySelector(".mode-label").textContent = light ? "Modo humano" : "Modo hechicero";
	modeButton.querySelector(".mode-indicator").style.background = light ? "var(--blue)" : "var(--red)";
	document.querySelector('meta[name="theme-color"]').content = light ? "#e8e6df" : "#111313";
});

function closeDomain() {
	domainOverlay.classList.remove("is-open");
	domainOverlay.setAttribute("aria-hidden", "true");
	domainButton.setAttribute("aria-pressed", "false");
	document.body.classList.remove("domain-active");
}

domainButton.addEventListener("click", () => {
	domainOverlay.classList.add("is-open");
	domainOverlay.setAttribute("aria-hidden", "false");
	domainButton.setAttribute("aria-pressed", "true");
	document.body.classList.add("domain-active");
});
domainOverlay.addEventListener("click", closeDomain);
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") closeDomain();
});

function showToast(message) {
	toast.textContent = message;
	toast.classList.add("is-visible");
	window.clearTimeout(toastTimeout);
	toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

document.querySelectorAll(".character").forEach((character) => {
	character.addEventListener("click", () => {
		const name = character.classList.contains("character--sukuna") ? "Sukuna" : "Gojo";
		showToast(`${name}: entidad de categoría especial. Zicheng: caso perdido.`);
	});
});

const revealObserver = new IntersectionObserver((entries, observer) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add("is-visible");
			observer.unobserve(entry.target);
		}
	});
}, { threshold: 0.12 });

document.querySelectorAll(".section-wrap, .passion, .domain").forEach((section) => {
	section.classList.add("reveal");
	revealObserver.observe(section);
});

function loadCharacterGif(image) {
	image.addEventListener("load", () => image.classList.add("is-loaded"), { once: true });
	image.addEventListener("error", () => image.closest(".character").classList.add("gif-unavailable"), { once: true });
	image.src = image.dataset.gif;
	if (image.complete && image.naturalWidth > 0) image.classList.add("is-loaded");
}

document.querySelectorAll(".character__gif").forEach(loadCharacterGif);
