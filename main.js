let selectedOptions = {};

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOM fully loaded");
    const cardContainer = document.getElementById('cardContainer');
    const calculateBtn = document.getElementById('calculate');
    const resultDiv = document.getElementById('result');
    const optionsContainer = document.getElementById('optionsContainer');
    const currentCardTitle = document.getElementById('currentCardTitle');
    const optionsList = document.getElementById('optionsList');
    const nextCardBtn = document.getElementById('nextCard');
    const calculatorsContainer = document.getElementById('calculatorsContainer');
    const calculatorsList = document.getElementById('calculatorsList');
    const totalImpairmentDiv = document.getElementById('totalImpairment');
    const finalizeImpairmentBtn = document.getElementById('finalizeImpairment');

    let selectedCards = [];
    let selectedOptions = {};
    let currentCardIndex = 0;

    const cardOptions = {
        shoulder: ['ROM', 'Strength', 'Arthroplasty', 'Instability/Subluxation/Dislocation', 'Synovial Hypertrophy'],
        elbow: ['ROM', 'Strength', 'Arthroplasty', 'Synovial Hypertrophy', 'Persistent Subluxation/Dislocation', 'Excessive Passive Mediolateral Instability', 'Excessive Active Mediolateral Deviation'],
        wrist: ['ROM', 'Arthroplasty', 'Synovial Hypertrophy', 'Excessive Active Mediolateral Deviation', 'Carpal Instability Patterns'],
        thumb: ['ROM', 'Arthroplasty', 'Sensory', 'Amputation', 'Synovial Hypertrophy', 'Lateral Deviation', 'Digit Rotational Deformity', 'Persistent Joint Subluxation/Dislocation', 'Joint Passive Mediolateral Instability', 'Constrictive Tenosynovitis'],
        index: ['ROM', 'Arthroplasty', 'Sensory', 'Amputation', 'Synovial Hypertrophy', 'Lateral Deviation', 'Digit Rotation Deformity', 'Persistent Joint Subluxation/Dislocation', 'Joint Passive Mediolateral Instability', 'Intrinsic Tightness', 'Constrictive Tenosynovitis', 'Extensor Tendon Subluxation at MP Joint'],
        middle: ['ROM', 'Arthroplasty', 'Sensory', 'Amputation', 'Synovial Hypertrophy', 'Lateral Deviation', 'Digit Rotation Deformity', 'Persistent Joint Subluxation/Dislocation', 'Joint Passive Mediolateral Instability', 'Intrinsic Tightness', 'Constrictive Tenosynovitis', 'Extensor Tendon Subluxation at MP Joint'],
        ring: ['ROM', 'Arthroplasty', 'Sensory', 'Amputation', 'Synovial Hypertrophy', 'Lateral Deviation', 'Digit Rotation Deformity', 'Persistent Joint Subluxation/Dislocation', 'Joint Passive Mediolateral Instability', 'Intrinsic Tightness', 'Constrictive Tenosynovitis', 'Extensor Tendon Subluxation at MP Joint'],
        little: ['ROM', 'Arthroplasty', 'Sensory', 'Amputation', 'Synovial Hypertrophy', 'Lateral Deviation', 'Digit Rotation Deformity', 'Persistent Joint Subluxation/Dislocation', 'Joint Passive Mediolateral Instability', 'Intrinsic Tightness', 'Constrictive Tenosynovitis', 'Extensor Tendon Subluxation at MP Joint'],
        nerve: ['Peripheral Nerves', 'CRPS', 'Spinal Nerves', 'Brachial Plexus'],
        vascular: ['Option 1', 'Option 2', 'Option 3'],
        grip: ['Grip Strength', 'Pinch Strength'],
        amputation: ['Option 1', 'Option 2', 'Option 3']
    };

    // Create cards
    Object.keys(cardOptions).forEach(cardValue => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = cardValue;
        card.textContent = cardValue.charAt(0).toUpperCase() + cardValue.slice(1);
        card.addEventListener('click', () => {
            card.classList.toggle('selected');
        });
        cardContainer.appendChild(card);
    });

    calculateBtn.addEventListener('click', () => {
        console.log("Calculate button clicked");
        selectedCards = Array.from(document.querySelectorAll('.card.selected')).map(card => card.dataset.value);
        console.log("Selected cards:", selectedCards);
        if (selectedCards.length > 0) {
            currentCardIndex = 0;
            selectedOptions = {}; // Reset selectedOptions
            showOptionsForCard(selectedCards[currentCardIndex]);
        } else {
            resultDiv.textContent = "Please select at least one card.";
        }
    });

function showOptionsForCard(cardValue) {
        console.log("Showing options for:", cardValue);
        currentCardTitle.textContent = `Options for ${cardValue.charAt(0).toUpperCase() + cardValue.slice(1)}`;
        optionsList.innerHTML = '';
        cardOptions[cardValue].forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => {
                optionElement.classList.toggle('selected');
            });
            optionsList.appendChild(optionElement);
        });
        optionsContainer.style.display = 'block';
        calculatorsContainer.style.display = 'none';
    }

    nextCardBtn.addEventListener('click', () => {
        console.log("Next button clicked");
        const cardValue = selectedCards[currentCardIndex];
        selectedOptions[cardValue] = Array.from(document.querySelectorAll('.option.selected')).map(option => option.textContent);
        console.log("Selected options:", selectedOptions);
        
        currentCardIndex++;
        if (currentCardIndex < selectedCards.length) {
            showOptionsForCard(selectedCards[currentCardIndex]);
        } else {
            showCalculators();
        }
    });

function showCalculators() {
    console.log("Showing calculators");
    optionsContainer.style.display = 'none';
    calculatorsContainer.style.display = 'block';
    calculatorsList.innerHTML = '';
    
    for (const [cardValue, options] of Object.entries(selectedOptions)) {
        options.forEach(option => {
            const calculatorCard = document.createElement('div');
            calculatorCard.classList.add('calculator-card');
            calculatorCard.innerHTML = createCalculatorContent(cardValue, option);
            calculatorsList.appendChild(calculatorCard);
        });
    }
    
    const totalImpairmentCard = document.createElement('div');
    totalImpairmentCard.classList.add('calculator-card');
    totalImpairmentCard.id = 'total-impairment-card';
    totalImpairmentCard.innerHTML = `
        <h3 id="total-impairment-title">Total Impairment</h3>
        <div id="impairment-breakdown"></div>
        <p class="total-impairment"><strong>Total: <span id="total-impairment-result">0 UE = 0 WPI</span></strong></p>
    `;
    calculatorsList.appendChild(totalImpairmentCard);
    
    setupCalculatorEventListeners();
    updateTotalImpairment();
}

function createCalculatorContent(cardValue, option) {
    if (cardValue === 'shoulder') {
        switch (option) {
            case 'ROM':
                return `
                    <h3>Shoulder - ROM</h3>
                    <table class="rom-table">
                        <tr>
                            <th></th>
                            <th>Flexion</th>
                            <th>Extension</th>
                            <th>Ankylosis</th>
                            <th>Imp%</th>
                        </tr>
                        <tr>
                            <td>Angle°</td>
                            <td><input type="number" id="shoulder-flexion" min="0" max="180"></td>
                            <td><input type="number" id="shoulder-extension" min="0" max="60"></td>
                            <td><input type="number" id="shoulder-ankylosis-fe" min="0" max="180"></td>
                            <td rowspan="2" id="shoulder-fe-imp">0</td>
                        </tr>
                        <tr>
                            <td>Imp%</td>
                            <td id="shoulder-flexion-imp">0</td>
                            <td id="shoulder-extension-imp">0</td>
                            <td id="shoulder-ankylosis-fe-imp">0</td>
                        </tr>
                        <tr>
                            <th></th>
                            <th>Abduction</th>
                            <th>Adduction</th>
                            <th>Ankylosis</th>
                            <th>Imp%</th>
                        </tr>
                        <tr>
                            <td>Angle°</td>
                            <td><input type="number" id="shoulder-abduction" min="0" max="180"></td>
                            <td><input type="number" id="shoulder-adduction" min="0" max="50"></td>
                            <td><input type="number" id="shoulder-ankylosis-aa" min="0" max="180"></td>
                            <td rowspan="2" id="shoulder-aa-imp">0</td>
                        </tr>
                        <tr>
                            <td>Imp%</td>
                            <td id="shoulder-abduction-imp">0</td>
                            <td id="shoulder-adduction-imp">0</td>
                            <td id="shoulder-ankylosis-aa-imp">0</td>
                        </tr>
                        <tr>
                            <th></th>
                            <th>Internal Rotation</th>
                            <th>External Rotation</th>
                            <th>Ankylosis</th>
                            <th>Imp%</th>
                        </tr>
                        <tr>
                            <td>Angle°</td>
                            <td><input type="number" id="shoulder-internal-rotation" min="0" max="90"></td>
                            <td><input type="number" id="shoulder-external-rotation" min="0" max="90"></td>
                            <td><input type="number" id="shoulder-ankylosis-ie" min="0" max="90"></td>
                            <td rowspan="2" id="shoulder-ie-imp">0</td>
                        </tr>
                        <tr>
                            <td>Imp%</td>
                            <td id="shoulder-internal-rotation-imp">0</td>
                            <td id="shoulder-external-rotation-imp">0</td>
                            <td id="shoulder-ankylosis-ie-imp">0</td>
                        </tr>
                    </table>
                    <p class="total-impairment"><strong>Total: <span id="shoulder-rom-total">0</span> UE = <span id="shoulder-rom-wpi">0</span> WPI</strong></p>
                `;
            case 'Strength':
                return `
                    <h3>Shoulder - Muscle Strength</h3>
                    <table class="strength-table">
                        <tr class="header-row">
                            <th>Motion</th>
                            <th>Max UE</th>
                            <th>Strength Deficit % (max 50%)</th>
                            <th>UE Impairment</th>
                        </tr>
                        <tr>
                            <td>Flexion</td>
                            <td>24</td>
                            <td><input type="number" id="shoulder-flexion-strength-deficit" min="0" max="50" step="1"></td>
                            <td><input type="number" id="shoulder-flexion-strength-imp" min="0" max="12" step="1"></td>
                        </tr>
                        <tr>
                            <td>Extension</td>
                            <td>6</td>
                            <td><input type="number" id="shoulder-extension-strength-deficit" min="0" max="50" step="1"></td>
                            <td><input type="number" id="shoulder-extension-strength-imp" min="0" max="3" step="1"></td>
                        </tr>
                        <tr>
                            <td>Abduction</td>
                            <td>12</td>
                            <td><input type="number" id="shoulder-abduction-strength-deficit" min="0" max="50" step="1"></td>
                            <td><input type="number" id="shoulder-abduction-strength-imp" min="0" max="6" step="1"></td>
                        </tr>
                        <tr>
                            <td>Adduction</td>
                            <td>6</td>
                            <td><input type="number" id="shoulder-adduction-strength-deficit" min="0" max="50" step="1"></td>
                            <td><input type="number" id="shoulder-adduction-strength-imp" min="0" max="3" step="1"></td>
                        </tr>
                        <tr>
                            <td>Internal Rotation</td>
                            <td>6</td>
                            <td><input type="number" id="shoulder-internal-rotation-strength-deficit" min="0" max="50" step="1"></td>
                            <td><input type="number" id="shoulder-internal-rotation-strength-imp" min="0" max="3" step="1"></td>
                        </tr>
                        <tr>
                            <td>External Rotation</td>
                            <td>6</td>
                            <td><input type="number" id="shoulder-external-rotation-strength-deficit" min="0" max="50" step="1"></td>
                            <td><input type="number" id="shoulder-external-rotation-strength-imp" min="0" max="3" step="1"></td>
                        </tr>
                    </table>
                    <p class="total-impairment"><strong>Total: <span id="shoulder-strength-total-ue">0 UE = 0 WPI</span></strong></p>
                    <div class="instructions">
                        <p>Instructions: Enter the strength deficit percent provided by physician for each motion. If a strength deficit percent is not provided by physician, enter the strength UE impairment for each motion provided by physician. For reference, Grade 4 strength is 1 to 25% strength deficit and Grade 3 Strength is 26 to 50% strength deficit.</p>
                    </div>
                    <div class="reference">
                        <p>Reference: Table 16-35 on p. 510 of The AMA Guides 5th Edition</p>
                    </div>
                `;
            case 'Arthroplasty':
                return `
                    <h3>Shoulder - Arthroplasty</h3>
                    <div class="arthroplasty-options">
                        <div class="arthroplasty-option" data-value="30">
                            <input type="radio" id="total-shoulder-resection" name="shoulder-arthroplasty" value="30">
                            <label for="total-shoulder-resection">Total Shoulder Resection Arthroplasty</label>
                        </div>
                        <div class="arthroplasty-option" data-value="24">
                            <input type="radio" id="total-shoulder-implant" name="shoulder-arthroplasty" value="24">
                            <label for="total-shoulder-implant">Total Shoulder Implant Arthroplasty</label>
                        </div>
                        <div class="arthroplasty-option" data-value="10">
                            <input type="radio" id="distal-clavicle-resection" name="shoulder-arthroplasty" value="10">
                            <label for="distal-clavicle-resection">Distal Clavicle Resection Arthroplasty</label>
                        </div>
                        <div class="arthroplasty-option" data-value="3">
                            <input type="radio" id="proximal-clavicle-resection" name="shoulder-arthroplasty" value="3">
                            <label for="proximal-clavicle-resection">Proximal Clavicle Resection Arthroplasty</label>
                        </div>
                    </div>
                    <p class="total-impairment"><strong>Total: <span id="shoulder-arthroplasty-total">0 UE = 0 WPI</span></strong></p>
                `;
            case 'Instability/Subluxation/Dislocation':
                return `
                    <h3>Shoulder - Instability/Subluxation/Dislocation</h3>
                    <div class="instability-options">
                        <div class="instability-option" data-value="6">
                            <input type="radio" id="class-1-instability" name="shoulder-instability" value="6">
                            <label for="class-1-instability">Class 1 - Occult Instability (6 UE)</label>
                        </div>
                        <div class="instability-option" data-value="12">
                            <input type="radio" id="class-2-instability" name="shoulder-instability" value="12">
                            <label for="class-2-instability">Class 2 - Subluxating Humeral Head (12 UE)</label>
                        </div>
                        <div class="instability-option" data-value="24">
                            <input type="radio" id="class-3-instability" name="shoulder-instability" value="24">
                            <label for="class-3-instability">Class 3 - Dislocating Humeral Head (24 UE)</label>
                        </div>
                    </div>
                    <p class="total-impairment"><strong>Total: <span id="shoulder-instability-total">0 UE = 0 WPI</span></strong></p>
                `;
            case 'Synovial Hypertrophy':
                return `
                    <h3>Shoulder - Synovial Hypertrophy</h3>
                    <table class="synovial-hypertrophy-table">
                        <thead>
                            <tr>
                                <th>Shoulder Joints</th>
                                <th>Max UE</th>
                                <th>Mild (10%)</th>
                                <th>Moderate (20%)</th>
                                <th>Severe (30%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Glenohumeral</td>
                                <td>60</td>
                                <td><input type="checkbox" class="synovial-checkbox" data-joint="glenohumeral" value="6"> 6</td>
                                <td><input type="checkbox" class="synovial-checkbox" data-joint="glenohumeral" value="12"> 12</td>
                                <td><input type="checkbox" class="synovial-checkbox" data-joint="glenohumeral" value="18"> 18</td>
                            </tr>
                            <tr>
                                <td>Acromioclavicular</td>
                                <td>25</td>
                                <td><input type="checkbox" class="synovial-checkbox" data-joint="acromioclavicular" value="3"> 3</td>
                                <td><input type="checkbox" class="synovial-checkbox" data-joint="acromioclavicular" value="5"> 5</td>
                                <td><input type="checkbox" class="synovial-checkbox" data-joint="acromioclavicular" value="8"> 8</td>
                            </tr>
                            <tr>
                                <td>Sternoclavicular</td>
                                <td>5</td>
                                <td><input type="checkbox" class="synovial-checkbox" data-joint="sternoclavicular" value="1"> 1</td>
                                <td><input type="checkbox" class="synovial-checkbox" data-joint="sternoclavicular" value="1"> 1</td>
                                <td><input type="checkbox" class="synovial-checkbox" data-joint="sternoclavicular" value="2"> 2</td>
                            </tr>
                        </tbody>
                    </table>
                    <p class="instructions">Instructions: Check up to one box for each joint as applicable.</p>
                    <p class="reference">Reference: Tables 16-19 & 16-18 on pages 500 & 499 of The AMA Guides 5th Ed.</p>
                    <p class="total-impairment"><strong>Total: <span id="shoulder-synovial-hypertrophy-total">0 UE = 0 WPI</span></strong></p>
                `;
            default:
                return `<h3>${cardValue.charAt(0).toUpperCase() + cardValue.slice(1)} - ${option}</h3><p>Calculator content for ${option} goes here.</p>`;
        }
    } else {
        return `<h3>${cardValue.charAt(0).toUpperCase() + cardValue.slice(1)} - ${option}</h3><p>Calculator content for ${option} goes here.</p>`;
    }
}

function setupCalculatorEventListeners() {
    console.log("Setting up calculator event listeners");
    if (selectedOptions.shoulder) {
        setupShoulderCalculators(selectedOptions.shoulder);
    }
    // Add setup functions for other body parts as you implement them
}

    // Make sure setupShoulderCalculators is available globally
window.setupShoulderCalculators = setupShoulderCalculators;

function updateTotalImpairment() {
    console.log("Updating total impairment");
    const impairmentBreakdown = document.getElementById('impairment-breakdown');
    const totalImpairmentResult = document.getElementById('total-impairment-result');

    let allImpairments = [];
    let breakdownHTML = '';

    if (selectedOptions.shoulder) {
        const shoulderImpairments = getShoulderImpairment();
        if (shoulderImpairments.length > 0) {
            allImpairments = allImpairments.concat(shoulderImpairments);
            breakdownHTML += `<p>Shoulder:</p><ul>`;
            shoulderImpairments.forEach(imp => {
                breakdownHTML += `<li>${imp.name}: ${imp.value} UE</li>`;
            });
            breakdownHTML += `</ul>`;
        }
    }
    // Add similar blocks for other body parts as you implement them

    if (allImpairments.length > 0) {
        const impairmentValues = allImpairments.map(imp => imp.value);
        const combinedUE = combineImpairments(impairmentValues);
        const combinedWPI = Math.round(combinedUE * 0.6);

        if (impairmentValues.length > 1) {
            breakdownHTML += `<p><strong>Combined: ${impairmentValues.join(' C ')} = ${combinedUE} UE</strong></p>`;
        }
        
        breakdownHTML += `<p><strong>Total: ${combinedUE} UE = ${combinedWPI} WPI</strong></p>`;
        totalImpairmentResult.textContent = `${combinedUE} UE = ${combinedWPI} WPI`;
    } else {
        breakdownHTML = '<p>No impairments calculated yet.</p>';
        totalImpairmentResult.textContent = '0 UE = 0 WPI';
    }

    impairmentBreakdown.innerHTML = breakdownHTML;
}

    finalizeImpairmentBtn.addEventListener('click', () => {
        console.log("Finalize Impairment button clicked");
        // Implement finalization logic here
    });
});
