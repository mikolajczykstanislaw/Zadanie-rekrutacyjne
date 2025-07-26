const pricingPage = () => {
    document.addEventListener("DOMContentLoaded", async () => {
        // Ładowanie danych modułów z JSON
        let moduleCheckboxes;
        let vatMultiplier;

        try {
            const response = await fetch("./assets/data/modules.json");
            const moduleData = await response.json();
            moduleCheckboxes = moduleData.modules;
            vatMultiplier = moduleData.vat.multiplier;
        } catch (error) {
            console.error("Błąd ładowania danych modułów:", error);
            return;
        }

        const studentCountInput = document.getElementById(
            "student-count-input"
        );
        const studentCountRange = document.getElementById(
            "student-count-range"
        );
        const rangeValueBubble = document.querySelector(".range-value-bubble");
        const summaryStudentsDisplay = document.getElementById(
            "summary-students-display"
        );
        const monthlyPricePerStudentDisplay = document.getElementById(
            "monthly-price-per-student-display"
        );
        const monthlyBruttoDisplay = document.getElementById(
            "monthly-brutto-display"
        );
        const monthlyNettoDisplay = document.getElementById(
            "monthly-netto-display"
        );
        const trialButton = document.getElementById("trial-button");

        if (studentCountInput) {
            studentCountInput.style.color = "#01579B";
        }

        function updateRangeBubble() {
            const value = parseInt(studentCountRange.value);
            const min = parseInt(studentCountRange.min);
            const max = parseInt(studentCountRange.max);
            const percent = ((value - min) / (max - min)) * 100;

            rangeValueBubble.textContent = value;

            const thumbWidth = 20;
            const trackWidth = studentCountRange.offsetWidth - thumbWidth;
            const thumbPosition = (percent / 100) * trackWidth + thumbWidth / 2;

            rangeValueBubble.style.left = `${thumbPosition}px`;
            rangeValueBubble.style.transform = "translateX(-50%)";

            studentCountRange.style.setProperty(
                "--range-progress",
                `${percent}%`
            );
        }

        function getSelectedModules() {
            const selectedModules = [];
            let totalPricePerStudent = 0;

            for (const [moduleId, moduleData] of Object.entries(
                moduleCheckboxes
            )) {
                const checkbox = document.getElementById(moduleId);
                if (checkbox) {
                    const isChecked =
                        checkbox.checked || checkbox.hasAttribute("checked");

                    if (isChecked) {
                        selectedModules.push({
                            id: moduleId,
                            name: moduleData.name,
                            price: moduleData.price,
                        });
                        totalPricePerStudent += moduleData.price;
                    }
                }
            }

            return { selectedModules, totalPricePerStudent };
        }

        function updateSummary() {
            const studentCount = parseInt(studentCountInput.value);
            const { selectedModules, totalPricePerStudent } =
                getSelectedModules();

            const monthlyNettoTotal = totalPricePerStudent * studentCount;
            const monthlyBruttoTotal = monthlyNettoTotal * vatMultiplier;
            const monthlyPricePerStudent = totalPricePerStudent;

            summaryStudentsDisplay.textContent = studentCount;
            monthlyPricePerStudentDisplay.textContent = `${monthlyPricePerStudent.toFixed(
                2
            )} zł`;
            monthlyBruttoDisplay.textContent = `${monthlyBruttoTotal.toFixed(
                2
            )} zł`;
            monthlyNettoDisplay.textContent = `${monthlyNettoTotal.toFixed(
                2
            )} zł`;
        }

        function showTrialData() {
            const studentCount = parseInt(studentCountInput.value);
            const { selectedModules, totalPricePerStudent } =
                getSelectedModules();

            const monthlyNettoTotal = totalPricePerStudent * studentCount;
            const monthlyBruttoTotal = monthlyNettoTotal * vatMultiplier;
            const monthlyPricePerStudent = totalPricePerStudent;

            const modulesList = selectedModules
                .map(
                    (module) => `${module.name} (${module.price.toFixed(2)} zł)`
                )
                .join("\n");

            const alertMessage = `
=== DANE WYCENY ===

Zaznaczone moduły:
${modulesList}

Liczba słuchaczy: ${studentCount}
Miesięczna cena za słuchacza: ${monthlyPricePerStudent.toFixed(2)} zł
Miesięczny koszt netto: ${monthlyNettoTotal.toFixed(2)} zł
Miesięczny koszt brutto: ${monthlyBruttoTotal.toFixed(2)} zł

Wypróbuj za darmo przez 14 dni!
            `.trim();

            alert(alertMessage);
        }

        // Event listeners
        studentCountInput.addEventListener("input", () => {
            studentCountRange.value = studentCountInput.value;
            updateRangeBubble();
            updateSummary();
        });

        studentCountRange.addEventListener("input", () => {
            studentCountInput.value = studentCountRange.value;
            updateRangeBubble();
            updateSummary();
        });

        Object.keys(moduleCheckboxes).forEach((moduleId) => {
            const checkbox = document.getElementById(moduleId);
            if (checkbox && !checkbox.disabled) {
                checkbox.addEventListener("change", updateSummary);
            }
        });

        trialButton.addEventListener("click", (event) => {
            event.preventDefault();
            showTrialData();
        });

        updateRangeBubble();
        updateSummary();

        window.addEventListener("resize", updateRangeBubble);
    });
};

export { pricingPage };
