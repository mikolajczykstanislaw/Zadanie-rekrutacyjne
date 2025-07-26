import "bootstrap";

import { pricingPage } from "./parts/pricing_page";

pricingPage();

const featuresPage = () => {
    document.addEventListener("DOMContentLoaded", () => {
        const menuItems = document.querySelectorAll(".menu-item");
        const featureItems = document.querySelectorAll(".feature-item");

        // Funkcja do usuwania klasy active ze wszystkich elementów
        const removeActiveClasses = () => {
            menuItems.forEach((item) => item.classList.remove("active"));
            featureItems.forEach((item) => item.classList.remove("active"));
        };

        // Funkcja do ustawiania aktywnego elementu
        const setActiveItem = (targetId) => {
            removeActiveClasses();

            // Aktywuj odpowiedni menu item
            const activeMenuItem = document.querySelector(
                `[data-target="${targetId}"]`
            );
            if (activeMenuItem) {
                activeMenuItem.classList.add("active");
            }

            // Aktywuj odpowiedni feature item
            const activeFeatureItem = document.getElementById(targetId);
            if (activeFeatureItem) {
                activeFeatureItem.classList.add("active");
            }
        };

        // Obsługa kliknięć w menu
        menuItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const targetId = item.getAttribute("data-target");
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });

                    // Ustaw aktywny element po kliknięciu
                    setActiveItem(targetId);
                }
            });
        });

        // Intersection Observer do automatycznego podświetlania podczas przewijania
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -70% 0px", // Aktywuj gdy element jest w górnej części viewport
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.id;
                    setActiveItem(targetId);
                }
            });
        }, observerOptions);

        // Obserwuj wszystkie feature items
        featureItems.forEach((item) => {
            observer.observe(item);
        });

        // Ustaw pierwszy element jako aktywny na start
        if (featureItems.length > 0) {
            const firstItemId = featureItems[0].id;
            setActiveItem(firstItemId);
        }
    });
};

featuresPage();
