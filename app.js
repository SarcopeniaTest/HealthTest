// Questions data
const questions = [
    {
        id: 1,
        title: "1. ความแข็งแรงของกล้ามเนื้อ (Strength)",
        question: "ท่านคิดว่าการยกและถือของที่มีน้ำหนัก 20 กิโลกรัมยากหรือไม่",
        options: [
            { value: 0, label: "ไม่ยาก (0 คะแนน)" },
            { value: 1, label: "ยากเล็กน้อย (1 คะแนน)" },
            { value: 2, label: "ยาก (2 คะแนน)" }
        ]
    },
    {
        id: 2,
        title: "2. การเดิน (Assistance in walking)",
        question: "ท่านรู้สึกว่าการเดินภายในห้องยากหรือไม่",
        options: [
            { value: 0, label: "ไม่ยาก (0 คะแนน)" },
            { value: 1, label: "ยากเล็กน้อย (1 คะแนน)" },
            { value: 2, label: "ยาก (2 คะแนน)" }
        ]
    },
    {
        id: 3,
        title: "3. การลุกจากเก้าอี้ (Rise from a chair)",
        question: "ท่านเคลื่อนย้ายตัวเองจากเก้าอี้ไปที่เตียงนอนยากหรือไม่",
        options: [
            { value: 0, label: "ไม่ยาก (0 คะแนน)" },
            { value: 1, label: "ยากเล็กน้อย (1 คะแนน)" },
            { value: 2, label: "ยาก (2 คะแนน)" }
        ]
    },
    {
        id: 4,
        title: "4. การขึ้นบันได (Climb stairs)",
        question: "ท่านรู้สึกว่าการเดินขึ้นบันไดจำนวน 10 ขั้นยากหรือไม่",
        options: [
            { value: 0, label: "ไม่ยาก (0 คะแนน)" },
            { value: 1, label: "ยากเล็กน้อย (1 คะแนน)" },
            { value: 2, label: "ยาก (2 คะแนน)" }
        ]
    },
    {
        id: 5,
        title: "5. การล้ม (Fall)",
        question: "ท่านเคยมีประวัติการล้มกี่ครั้ง",
        options: [
            { value: 0, label: "ไม่เคย (0 คะแนน)" },
            { value: 1, label: "1-3 ครั้ง (1 คะแนน)" },
            { value: 2, label: "มากกว่า 4 ครั้ง (2 คะแนน)" }
        ]
    }
];

// Storage keys
const STORAGE_KEYS = {
    PERSONAL_INFO: 'healthAssessment_personalInfo',
    ANSWERS: 'healthAssessment_answers',
    CURRENT_QUESTION: 'healthAssessment_currentQuestion'
};

// Google Apps Script Web App URL - ใส่ URL ของคุณที่นี่
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXcPjDodCH8OQ3hYai4QpVNhIgm5rdAjuSMIZlHNIzTciMcLRCZuLfMu6hjBG3aQwF/exec';

// BMI Evaluation Function (เกณฑ์คนไทย)
function evaluateBMI(bmi, gender) {
    const bmiValue = parseFloat(bmi);
    let category = '';
    let categoryClass = '';
    let advice = '';
    
    if (bmiValue < 18.5) {
        category = 'น้ำหนักน้อย / ผอม';
        categoryClass = 'underweight';
        advice = 'ควรเพิ่มน้ำหนักให้อยู่ในเกณฑ์ปกติ';
    } else if (bmiValue >= 18.5 && bmiValue <= 22.9) {
        category = 'สมส่วน / ปกติ';
        categoryClass = 'normal';
        advice = 'น้ำหนักอยู่ในเกณฑ์ที่เหมาะสม';
    } else if (bmiValue >= 23.0 && bmiValue <= 24.9) {
        category = 'น้ำหนักเกิน';
        categoryClass = 'overweight';
        advice = 'ควรควบคุมน้ำหนักและออกกำลังกาย';
    } else if (bmiValue >= 25.0 && bmiValue <= 29.9) {
        category = 'อ้วน';
        categoryClass = 'obese';
        advice = 'ควรลดน้ำหนักและปรึกษาทีมสุขภาพ';
    } else {
        category = 'อ้วนมาก';
        categoryClass = 'very-obese';
        advice = 'ควรลดน้ำหนักและปรึกษาทีมสุขภาพ';
    }
    
    return { category, categoryClass, advice };
}

// ========== Index Page (Personal Info) ==========
if (document.getElementById('personalInfoForm')) {
    const form = document.getElementById('personalInfoForm');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const bmiInput = document.getElementById('bmi');
    const diseasesDisplay = document.getElementById('diseasesDisplay');
    const diseasesOptions = document.getElementById('diseasesOptions');
    const diseaseCheckboxes = document.querySelectorAll('input[data-disease]');
    const otherDiseaseCheck = document.getElementById('otherDiseaseCheck');
    const otherDiseaseText = document.getElementById('otherDiseaseText');

    // Toggle dropdown
    if (diseasesDisplay && diseasesOptions) {
        diseasesDisplay.addEventListener('click', (e) => {
            e.stopPropagation();
            diseasesOptions.classList.toggle('show');
            diseasesDisplay.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!diseasesDisplay.contains(e.target) && !diseasesOptions.contains(e.target)) {
                diseasesOptions.classList.remove('show');
                diseasesDisplay.classList.remove('active');
            }
        });

        // Update display text when checkboxes change
        diseaseCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateDiseasesDisplay();
                
                // Handle "ไม่มี" checkbox - uncheck others when selected
                if (checkbox.value === 'ไม่มี' && checkbox.checked) {
                    diseaseCheckboxes.forEach(cb => {
                        if (cb !== checkbox) cb.checked = false;
                    });
                } else if (checkbox.checked && checkbox.value !== 'ไม่มี') {
                    // Uncheck "ไม่มี" when selecting other diseases
                    diseaseCheckboxes.forEach(cb => {
                        if (cb.value === 'ไม่มี') cb.checked = false;
                    });
                }
                
                // Show/hide other disease text input
                if (otherDiseaseCheck && otherDiseaseText) {
                    otherDiseaseText.style.display = otherDiseaseCheck.checked ? 'block' : 'none';
                    if (!otherDiseaseCheck.checked) {
                        otherDiseaseText.value = '';
                    }
                }
            });
        });

        function updateDiseasesDisplay() {
            const selected = [];
            diseaseCheckboxes.forEach(cb => {
                if (cb.checked) {
                    const label = cb.parentElement.querySelector('span').textContent;
                    selected.push(label);
                }
            });

            if (selected.length === 0) {
                diseasesDisplay.textContent = 'เลือกโรคประจำตัว...';
            } else if (selected.length <= 2) {
                diseasesDisplay.textContent = selected.join(', ');
            } else {
                diseasesDisplay.textContent = `${selected.slice(0, 2).join(', ')} และอื่นๆ ${selected.length - 2} รายการ`;
            }
        }
    }

    // Calculate BMI
    function calculateBMI() {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        if (height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
            bmiInput.value = bmi;
        } else {
            bmiInput.value = '';
        }
    }

    heightInput.addEventListener('input', calculateBMI);
    weightInput.addEventListener('input', calculateBMI);

    // Clear all previous data when page loads
    localStorage.removeItem(STORAGE_KEYS.PERSONAL_INFO);
    localStorage.removeItem(STORAGE_KEYS.ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_QUESTION);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        // Collect chronic diseases from custom multi-select
        const diseases = [];
        const diseaseCheckboxes = document.querySelectorAll('input[data-disease]:checked');
        
        if (diseaseCheckboxes.length === 0) {
            // No diseases selected
            diseases.push('ไม่มี');
        } else {
            diseaseCheckboxes.forEach(checkbox => {
                if (checkbox.value === 'อื่นๆ' && otherDiseaseText && otherDiseaseText.value.trim()) {
                    diseases.push('อื่นๆ: ' + otherDiseaseText.value.trim());
                } else if (checkbox.value !== 'อื่นๆ') {
                    diseases.push(checkbox.value);
                }
            });
        }
        
        const data = {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            age: formData.get('age'),
            gender: formData.get('gender'),
            height: formData.get('height'),
            weight: formData.get('weight'),
            bmi: bmiInput.value,
            diseases: diseases,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.PERSONAL_INFO, JSON.stringify(data));
        localStorage.setItem(STORAGE_KEYS.CURRENT_QUESTION, '0');
        
        // Redirect to question page
        window.location.href = 'question.html';
    });
}

// ========== Question Page ==========
if (document.getElementById('questionForm')) {
    let currentQuestion = parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_QUESTION) || '0');
    let answers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS) || '{}');

    const form = document.getElementById('questionForm');
    const titleElement = document.getElementById('questionTitle');
    const textElement = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const progressElement = document.getElementById('questionProgress');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function loadQuestion() {
        const question = questions[currentQuestion];
        
        titleElement.textContent = question.title;
        textElement.textContent = question.question;
        progressElement.textContent = `แบบสอบถามคัดกรองภาวะมวลกล้ามเนื้อน้อยชนิด SARC-F ${currentQuestion + 1} จาก ${questions.length}`;

        // Render options
        optionsContainer.innerHTML = question.options.map((option, index) => `
            <label class="radio-label">
                <input type="radio" name="answer" value="${option.value}" 
                    ${answers[question.id] === option.value ? 'checked' : ''} required>
                <span>${option.label}</span>
            </label>
        `).join('');

        // Show/hide buttons
        prevBtn.style.display = currentQuestion > 0 ? 'block' : 'none';
        nextBtn.textContent = currentQuestion === questions.length - 1 ? 'ต่อไป' : 'ถัดไป';
    }

    prevBtn.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            localStorage.setItem(STORAGE_KEYS.CURRENT_QUESTION, currentQuestion.toString());
            loadQuestion();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            const questionId = questions[currentQuestion].id;
            answers[questionId] = parseInt(selectedAnswer.value);
            localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));

            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                localStorage.setItem(STORAGE_KEYS.CURRENT_QUESTION, currentQuestion.toString());
                loadQuestion();
            } else {
                // All questions answered, show results
                showResults();
            }
        }
    });

    function showResults() {
        // Calculate total score
        const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
        
        // Get personal info
        const personalInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERSONAL_INFO) || '{}');
        
        // Determine muscle mass result
        const isNormal = totalScore < 4;
        const resultText = isNormal ? 'ท่านไม่มีความเสี่ยงต่อภาวะมวลกล้ามเนื้อน้อย' : 'ท่านมีความเสี่ยงต่อภาวะมวลกล้ามเนื้อน้อย';
        const resultClass = isNormal ? 'normal' : 'abnormal';
        
        // Evaluate BMI
        const bmiEval = evaluateBMI(personalInfo.bmi, personalInfo.gender);

        // Show modal
        const modal = document.getElementById('resultModal');
        const modalBody = document.getElementById('modalBody');
        const additionalTestsSection = document.getElementById('additionalTestsSection');
        
        const age = parseInt(personalInfo.age);

        // If SARC-F >= 4 AND age >= 50, show additional tests FIRST (before showing results)
        if (totalScore >= 4 && age >= 50) {
            // Hide main result body initially
            modalBody.style.display = 'none';
            
            // Show only additional tests section
            if (additionalTestsSection) {
                additionalTestsSection.style.display = 'block';
                
                // Clear previous content
                const handgripInput = document.getElementById('handgripStrength');
                const gaitSpeedInput = document.getElementById('gaitSpeed');
                const resultsDiv = document.getElementById('additionalTestResults');
                
                if (handgripInput) handgripInput.value = '';
                if (gaitSpeedInput) gaitSpeedInput.value = '';
                if (resultsDiv) resultsDiv.style.display = 'none';
                
                // Store additional test data
                let additionalTestData = {
                    handgripStrength: null,
                    gaitSpeed: null,
                    handgripStatus: null,
                    gaitSpeedStatus: null,
                    overallStatus: null
                };

                // Handle additional tests evaluation
                document.getElementById('evaluateAdditionalTests').onclick = () => {
                    const handgrip = parseFloat(handgripInput.value);
                    const gaitSpeed = parseFloat(gaitSpeedInput.value);
                    const age = parseInt(personalInfo.age);
                    const gender = personalInfo.gender;
                    
                    if (isNaN(handgrip) || isNaN(gaitSpeed)) {
                        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
                        return;
                    }
                    
                    // Evaluate Handgrip strength
                    let handgripStatus = 'ปกติ';
                    let handgripThreshold = 0;
                    
                    if (age >= 50 && age <= 64) {
                        if (gender === 'ชาย') {
                            handgripThreshold = 34;
                            handgripStatus = handgrip <= 34 ? 'ความแข็งแรงของกล้ามเนื้อต่ำกว่าปกติ' : 'ความแข็งแรงของกล้ามเนื้อปกติ';
                        } else {
                            handgripThreshold = 20;
                            handgripStatus = handgrip <= 20 ? 'ความแข็งแรงของกล้ามเนื้อต่ำกว่าปกติ' : 'ความแข็งแรงของกล้ามเนื้อปกติ';
                        }
                    } else if (age >= 65) {
                        if (gender === 'ชาย') {
                            handgripThreshold = 28;
                            handgripStatus = handgrip <= 28 ? 'ความแข็งแรงของกล้ามเนื้อต่ำกว่าปกติ' : 'ความแข็งแรงของกล้ามเนื้อปกติ';
                        } else {
                            handgripThreshold = 18;
                            handgripStatus = handgrip <= 18 ? 'ความแข็งแรงของกล้ามเนื้อต่ำกว่าปกติ' : 'ความแข็งแรงของกล้ามเนื้อปกติ';
                        }
                    }
                    
                    // Evaluate Gait speed test
                    const gaitSpeedStatus = gaitSpeed > 12 ? 'สมรรถภาพกายต่ำกว่าปกติ' : 'สมรรถภาพกายปกติ';
                    
                    // Overall result
                    const overallStatus = (handgripStatus === 'ความแข็งแรงของกล้ามเนื้อต่ำกว่าปกติ' || gaitSpeedStatus === 'สมรรถภาพกายต่ำกว่าปกติ') 
                        ? 'ท่านอาจจะมีภาวะมวลกล้ามเนื้อน้อย (Possible Sarcopenia)' : 'ท่านไม่มีภาวะมวลกล้ามเนื้อน้อย';
                    
                    // Store test data
                    additionalTestData = {
                        handgripStrength: handgrip,
                        gaitSpeed: gaitSpeed,
                        handgripStatus: handgripStatus,
                        gaitSpeedStatus: gaitSpeedStatus,
                        overallStatus: overallStatus
                    };
                    
                    // Display additional test results
                    const handgripClass = handgripStatus === 'ปกติ' ? 'normal' : 'abnormal';
                    const gaitSpeedClass = gaitSpeedStatus === 'ปกติ' ? 'normal' : 'abnormal';
                    const overallClass = overallStatus === 'ปกติ' ? 'normal' : 'abnormal';
                    
                    resultsDiv.innerHTML = `
                        <div style="margin-bottom: 10px;">
                            <strong>Handgrip strength:</strong> ${handgrip} kg<br>
                            <span>เกณฑ์: ${gender} อายุ ${age} ปี ต้อง ${gender === 'ชาย' ? '≥' : '≥'} ${handgripThreshold} kg</span><br>
                            <span class="result-status ${handgripClass}" style="display: inline-block; margin-top: 5px; padding: 5px 10px;">
                                ${handgripStatus}
                            </span>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <strong>Gait speed test:</strong> ${gaitSpeed} นาที<br>
                            <span>เกณฑ์: ต้องไม่เกิน 12 นาที</span><br>
                            <span class="result-status ${gaitSpeedClass}" style="display: inline-block; margin-top: 5px; padding: 5px 10px;">
                                ${gaitSpeedStatus}
                            </span>
                        </div>
                        <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">
                        <div>
                            <strong>สรุปผลการทดสอบเพิ่มเติม:</strong><br>
                            <span class="result-status ${overallClass}" style="display: inline-block; margin-top: 5px; padding: 8px 15px; font-size: 1.1em;">
                                ${overallStatus}
                            </span>
                        </div>
                    `;
                    resultsDiv.style.display = 'block';
                    
                    // NOW show the full results with all information
                    displayFullResults(personalInfo, totalScore, isNormal, resultText, resultClass, bmiEval, additionalTestData);
                };
                
                // Setup save button for additional tests scenario
                document.getElementById('saveBtn').onclick = () => {
                    if (additionalTestData.overallStatus) {
                        saveWithAdditionalTests(personalInfo, answers, totalScore, isNormal, bmiEval, additionalTestData);
                    } else {
                        alert('กรุณากดปุ่ม "ประเมินผล" ก่อนบันทึกข้อมูล');
                    }
                };
            }
        } else {
            // SARC-F <= 4: Show results immediately
            displayFullResults(personalInfo, totalScore, isNormal, resultText, resultClass, bmiEval, null);
            
            // Hide additional tests section
            if (additionalTestsSection) {
                additionalTestsSection.style.display = 'none';
            }
            
            // Setup save button for normal scenario
            document.getElementById('saveBtn').onclick = () => {
                saveToGoogleSheets(personalInfo, answers, totalScore, isNormal, bmiEval);
            };
        }

        // Show modal
        modal.style.display = 'block';
        document.body.classList.add('modal-open');

        // Close modal function
        const closeModal = () => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        };

        // Close modal
        document.querySelector('.close').onclick = closeModal;

        window.onclick = (event) => {
            if (event.target === modal) {
                closeModal();
            }
        };

        // New assessment
        document.getElementById('newAssessmentBtn').onclick = () => {
            localStorage.removeItem(STORAGE_KEYS.ANSWERS);
            localStorage.removeItem(STORAGE_KEYS.CURRENT_QUESTION);
            window.location.href = 'index.html';
        };
    }

    // Function to display full results
    function displayFullResults(personalInfo, totalScore, isNormal, resultText, resultClass, bmiEval, additionalTestData) {
        const modalBody = document.getElementById('modalBody');
        
        // Display chronic diseases
        const diseasesDisplay = personalInfo.diseases && personalInfo.diseases.length > 0 
            ? personalInfo.diseases.join(', ') 
            : 'ไม่มี';

        let resultsHTML = `
            <div class="result-bmi">
                <strong>ชื่อ-นามสกุล:</strong> ${personalInfo.firstname} ${personalInfo.lastname}<br>
                <strong>อายุ:</strong> ${personalInfo.age} ปี | <strong>เพศ:</strong> ${personalInfo.gender}<br>
                <strong>ส่วนสูง:</strong> ${personalInfo.height} ซม. | <strong>น้ำหนัก:</strong> ${personalInfo.weight} กก.<br>
                <strong>โรคประจำตัว:</strong> ${diseasesDisplay}
            </div>
            <div class="bmi-result">
                <div class="bmi-value">
                    <strong>BMI:</strong> ${personalInfo.bmi}
                </div>
                <div class="bmi-category ${bmiEval.categoryClass}">
                    ${bmiEval.category}
                </div>
                <div class="bmi-advice">
                    ${bmiEval.advice}
                </div>
            </div>
            <hr style="margin: 20px 0; border: none; border-top: 2px solid #eee;">
            <div class="result-score">
                <strong>คะแนน SARC-F: ${totalScore} คะแนน</strong>
            </div>
            <div class="result-status ${resultClass}">
                ${resultText}
            </div>
        `;

        // Add additional test results if available
        if (additionalTestData && additionalTestData.overallStatus) {
            const handgripClass = additionalTestData.handgripStatus === 'ปกติ' ? 'normal' : 'abnormal';
            const gaitSpeedClass = additionalTestData.gaitSpeedStatus === 'ปกติ' ? 'normal' : 'abnormal';
            const overallClass = additionalTestData.overallStatus === 'ปกติ' ? 'normal' : 'abnormal';
            
            resultsHTML += `
                <hr style="margin: 20px 0; border: none; border-top: 2px solid #eee;">
                <h3 style="margin-bottom: 15px;">การประเมินเพื่อระบุผู้ป่วยที่สงสัยภาวะมวลกล้ามเนื้อน้อย</h3>
                <div style="margin-top: 15px; padding: 15px; border-radius: 8px; background: #f5f5f5;">
                    <div style="margin-bottom: 10px;">
                        <strong>Handgrip strength:</strong> ${additionalTestData.handgripStrength} kg<br>
                        <span class="result-status ${handgripClass}" style="display: inline-block; margin-top: 5px; padding: 5px 10px;">
                            ${additionalTestData.handgripStatus}
                        </span>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <strong>Gait speed test:</strong> ${additionalTestData.gaitSpeed} min<br>
                        <span class="result-status ${gaitSpeedClass}" style="display: inline-block; margin-top: 5px; padding: 5px 10px;">
                            ${additionalTestData.gaitSpeedStatus}
                        </span>
                    </div>
                    <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">
                    <div>
                        <strong>สรุปผลการทดสอบเพิ่มเติม:</strong><br>
                        <span class="result-status ${overallClass}" style="display: inline-block; margin-top: 5px; padding: 8px 15px; font-size: 1.1em;">
                            ${additionalTestData.overallStatus}
                        </span>
                    </div>
                </div>
            `;
        }

        modalBody.innerHTML = resultsHTML;
        modalBody.style.display = 'block';
        
        // Hide additional tests section when showing full results
        const additionalTestsSection = document.getElementById('additionalTestsSection');
        if (additionalTestsSection) {
            additionalTestsSection.style.display = 'none';
        }
    }

    async function saveToGoogleSheets(personalInfo, answers, totalScore, isNormal, bmiEval, additionalTestData = null) {
        const saveBtn = document.getElementById('saveBtn');
        const originalText = saveBtn.textContent;
        
        // Check if URL is configured
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE' || !GOOGLE_SCRIPT_URL.includes('script.google.com')) {
            alert('⚠️ กรุณาตั้งค่า Google Script URL ก่อน!\n\nดูคู่มือที่ไฟล์ SETUP_GOOGLE_SHEETS.md');
            return;
        }
        
        // Disable button and show loading
        saveBtn.disabled = true;
        saveBtn.textContent = 'กำลังบันทึก...';
        
        try {
            // Prepare answers array
            const answersArray = questions.map(q => {
                const answer = answers[q.id];
                const option = q.options.find(opt => opt.value === answer);
                return {
                    question: q.title,
                    answer: option ? option.label : 'ไม่ได้ตอบ',
                    score: answer || 0
                };
            });

            // Prepare data to send
            const data = {
                timestamp: new Date().toLocaleString('th-TH'),
                firstname: personalInfo.firstname,
                lastname: personalInfo.lastname,
                age: personalInfo.age,
                gender: personalInfo.gender,
                height: personalInfo.height,
                weight: personalInfo.weight,
                bmi: personalInfo.bmi,
                bmiCategory: bmiEval.category,
                bmiAdvice: bmiEval.advice,
                diseases: personalInfo.diseases ? personalInfo.diseases.join(', ') : 'ไม่มี',
                answers: answersArray,
                totalScore: totalScore,
                result: isNormal ? 'มวลกล้ามเนื้อปกติ' : 'มีภาวะมวลกล้ามเนื้อน้อย',
                resultStatus: isNormal ? 'ปกติ' : 'ผิดปกติ'
            };
            
            // Add additional test data if available
            if (additionalTestData && additionalTestData.overallStatus) {
                data.handgripStrength = additionalTestData.handgripStrength;
                data.handgripStatus = additionalTestData.handgripStatus;
                data.gaitSpeed = additionalTestData.gaitSpeed;
                data.gaitSpeedStatus = additionalTestData.gaitSpeedStatus;
                data.additionalTestsOverallStatus = additionalTestData.overallStatus;
            }

            console.log('Sending data to Google Sheets:', data);

            // Send to Google Sheets with no-cors mode
            // หมายเหตุ: ใช้ no-cors เพื่อหลีกเลี่ยงปัญหา CORS แต่จะไม่สามารถอ่าน response ได้
            // ถ้า request ไม่ error แสดงว่าส่งสำเร็จ
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // ถ้าไม่มี error แสดงว่าส่งสำเร็จ (no-cors จะไม่ throw error ถ้าส่งได้)
            console.log('Data sent successfully');
            
            // Show success message and redirect
            saveBtn.textContent = '✓ บันทึกสำเร็จ!';
            saveBtn.style.backgroundColor = '#4caf50';
            
            // Clear data and redirect to index page
            setTimeout(() => {
                localStorage.removeItem(STORAGE_KEYS.PERSONAL_INFO);
                localStorage.removeItem(STORAGE_KEYS.ANSWERS);
                localStorage.removeItem(STORAGE_KEYS.CURRENT_QUESTION);
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Error saving to Google Sheets:', error);
            
            // Show detailed error message
            const errorMsg = `❌ ไม่สามารถบันทึกข้อมูลได้
            
เช็คเพิ่มเติม:
✓ ตรวจสอบว่า Deploy Google Script แล้ว
✓ เลือก "Who has access: Anyone"
✓ URL ถูกต้องและลงท้ายด้วย /exec
✓ เปิด Console (F12) เพื่อดูรายละเอียด Error

ต้องการบันทึกข้อมูลนี้ในเครื่องหรือไม่?`;
            
            if (confirm(errorMsg)) {
                // Save to localStorage as backup
                const backupData = {
                    personalInfo,
                    answers,
                    totalScore,
                    result: isNormal ? 'ปกติ' : 'ผิดปกติ',
                    timestamp: new Date().toISOString()
                };
                
                const backups = JSON.parse(localStorage.getItem('backup_assessments') || '[]');
                backups.push(backupData);
                localStorage.setItem('backup_assessments', JSON.stringify(backups));
                
                alert('✓ บันทึกข้อมูลไว้ในเครื่องแล้ว\nเปิด Console (F12) แล้วพิมพ์:\nlocalStorage.getItem("backup_assessments")');
            }
            
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }
    }

    // Wrapper function for saving with additional tests
    async function saveWithAdditionalTests(personalInfo, answers, totalScore, isNormal, bmiEval, additionalTestData) {
        await saveToGoogleSheets(personalInfo, answers, totalScore, isNormal, bmiEval, additionalTestData);
    }

    // Load first question
    loadQuestion();
}
