document.addEventListener("DOMContentLoaded", () => {
    const totalNumbersInput = document.getElementById("totalNumbers");
    const restartButton = document.getElementById("restartButton");
    const generateButton = document.getElementById("generateButton");
    const currentNumberDisplay = document.getElementById("currentNumber");
    const drawnNumbersCard = document.getElementById("drawnNumbersCard");
    const drawnNumbersContainer = document.getElementById("drawnNumbersContainer");
    const drawnCountDisplay = document.getElementById("drawnCount");
    const totalCountDisplay = document.getElementById("totalCount");
    const completeMessage = document.getElementById("completeMessage");
    const progressBarFill = document.querySelector(".progress-bar-fill");
    const progressDrawnDisplay = document.getElementById("progressDrawn");
    const progressTotalDisplay = document.getElementById("progressTotal");

    let totalNumbers = parseInt(totalNumbersInput.value);
    let drawnNumbers = [];
    let isAnimating = false;

    // 初始化顯示
    updateProgressDisplay();

    // 更新進度顯示
    function updateProgressDisplay() {
        totalCountDisplay.textContent = totalNumbers;
        progressTotalDisplay.textContent = totalNumbers;
        drawnCountDisplay.textContent = drawnNumbers.length;
        progressDrawnDisplay.textContent = drawnNumbers.length;
        const progress = (drawnNumbers.length / totalNumbers) * 100;
        progressBarFill.style.width = `${progress}%`;

        if (drawnNumbers.length > 0) {
            drawnNumbersCard.classList.remove("hidden");
        } else {
            drawnNumbersCard.classList.add("hidden");
        }

        if (drawnNumbers.length === totalNumbers && totalNumbers > 0) {
            completeMessage.classList.remove("hidden");
            generateButton.disabled = true;
            generateButton.textContent = "抽獎完成";
        } else {
            completeMessage.classList.add("hidden");
            generateButton.disabled = isAnimating;
            generateButton.innerHTML = `<span class="icon">🔀</span> 下個幸運號碼`;
        }
    }

    // 產生下一個幸運號碼
    generateButton.addEventListener("click", () => {
        if (isAnimating || drawnNumbers.length === totalNumbers) return;

        isAnimating = true;
        generateButton.disabled = true;
        generateButton.textContent = "抽獎中...";
        currentNumberDisplay.textContent = "?";
        currentNumberDisplay.classList.add("animating");

        const availableNumbers = [];
        for (let i = 1; i <= totalNumbers; i++) {
            if (!drawnNumbers.includes(i)) {
                availableNumbers.push(i);
            }
        }

        if (availableNumbers.length === 0) {
            isAnimating = false;
            updateProgressDisplay();
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const newNumber = availableNumbers[randomIndex];

        setTimeout(() => {
            currentNumberDisplay.textContent = newNumber;
            currentNumberDisplay.classList.remove("animating");
            drawnNumbers.push(newNumber); // 直接加入，不排序
            renderDrawnNumbers();
            isAnimating = false;
            updateProgressDisplay();
        }, 800);
    });

    // 重新開始
    restartButton.addEventListener("click", () => {
        drawnNumbers = [];
        currentNumberDisplay.textContent = "—";
        currentNumberDisplay.classList.remove("animating");
        totalNumbers = parseInt(totalNumbersInput.value); // 重新讀取號碼總數
        renderDrawnNumbers();
        updateProgressDisplay();
        generateButton.disabled = false;
        generateButton.innerHTML = `<span class="icon">🔀</span> 下個幸運號碼`;
    });

    // 渲染已抽號碼
    function renderDrawnNumbers() {
        drawnNumbersContainer.innerHTML = "";
        drawnNumbers.forEach((number, index) => {
            const badge = document.createElement("span");
            badge.classList.add("badge");
            if (index === drawnNumbers.length - 1) {
                badge.classList.add("latest");
            }
            badge.textContent = number;
            drawnNumbersContainer.appendChild(badge);
        });
    }

    // 號碼總數輸入框變化事件
    totalNumbersInput.addEventListener("change", (e) => {
        const num = parseInt(e.target.value);
        if (num >= 1 && num <= 1000) {
            totalNumbers = num;
            restartButton.click(); // 觸發重新開始，重置狀態
        } else {
            alert("號碼總數必須在 1 到 1000 之間！");
            totalNumbersInput.value = totalNumbers; // 恢復舊值
        }
    });

    totalNumbersInput.addEventListener("input", (e) => {
        // 確保輸入框只包含數字，並限制長度
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
        if (e.target.value.length > 4) {
            e.target.value = e.target.value.slice(0, 4);
        }
    });
});
