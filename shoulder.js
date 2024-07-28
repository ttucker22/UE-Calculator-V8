function calculateShoulderROM() {
    console.log("Calculating Shoulder ROM");
    updateShoulderImpairment();
    updateTotalImpairment();
}

function updateShoulderImpairment() {
    console.log("Updating Shoulder Impairment");
    const movements = [
        { name: 'flexion', dataArray: SHOULDERFlexionExtensionData, group: 'fe' },
        { name: 'extension', dataArray: SHOULDERFlexionExtensionData, group: 'fe' },
        { name: 'abduction', dataArray: SHOULDERAbductionAdductionData, group: 'aa' },
        { name: 'adduction', dataArray: SHOULDERAbductionAdductionData, group: 'aa' },
        { name: 'internal-rotation', dataArray: SHOULDERInternalExternalRotationData, field: 'internalRotation', group: 'ie' },
        { name: 'external-rotation', dataArray: SHOULDERInternalExternalRotationData, field: 'externalRotation', group: 'ie' }
    ];

    let impairments = {
        fe: { normal: 0, ankylosis: 0 },
        aa: { normal: 0, ankylosis: 0 },
        ie: { normal: 0, ankylosis: 0 }
    };

    movements.forEach(movement => {
        const angleInput = document.getElementById(`shoulder-${movement.name}`);
        const impOutput = document.getElementById(`shoulder-${movement.name}-imp`);
        const angle = angleInput.value !== '' ? parseInt(angleInput.value) : null;

        if (angle !== null) {
            const imp = findImpairment(angle, movement.dataArray, movement.field || movement.name);
            impOutput.textContent = imp;
            impairments[movement.group].normal += imp;
        } else {
            impOutput.textContent = '';
        }
    });

    // Handle ankylosis
    ['fe', 'aa', 'ie'].forEach(group => {
        const ankylosisInput = document.getElementById(`shoulder-ankylosis-${group}`);
        const ankylosisImpOutput = document.getElementById(`shoulder-ankylosis-${group}-imp`);
        const ankylosisAngle = ankylosisInput.value !== '' ? parseInt(ankylosisInput.value) : null;

        if (ankylosisAngle !== null) {
            const dataArray = group === 'fe' ? SHOULDERFlexionExtensionData :
                              group === 'aa' ? SHOULDERAbductionAdductionData :
                              SHOULDERInternalExternalRotationData;
            const imp = findImpairment(ankylosisAngle, dataArray, 'ankylosis');
            ankylosisImpOutput.textContent = imp;
            impairments[group].ankylosis = imp;
        } else {
            ankylosisImpOutput.textContent = '';
        }
    });

    // Calculate and update subtotals
    let totalImp = 0;
    ['fe', 'aa', 'ie'].forEach(group => {
        const subtotal = Math.max(impairments[group].normal, impairments[group].ankylosis);
        document.getElementById(`shoulder-${group}-imp`).textContent = subtotal;
        totalImp += subtotal;
    });

    // Calculate total shoulder impairment
    const wpi = Math.round(totalImp * 0.6);

    document.getElementById('shoulder-rom-total').textContent = totalImp;
    document.getElementById('shoulder-rom-wpi').textContent = wpi;
}

function calculateShoulderStrength(movement, inputType) {
    const deficitInput = document.getElementById(`shoulder-${movement}-strength-deficit`);
    const impInput = document.getElementById(`shoulder-${movement}-strength-imp`);
    const maxUE = parseInt(deficitInput.closest('tr').children[1].textContent);

    if (inputType === 'deficit') {
        let deficit = Math.min(parseFloat(deficitInput.value) || 0, 50);
        deficitInput.value = deficit;
        const impairment = Math.round((deficit / 100) * maxUE);
        impInput.value = impairment;
    } else {
        let impairment = Math.min(parseInt(impInput.value) || 0, Math.floor(maxUE / 2));
        impInput.value = impairment;
        const deficit = Math.round((impairment / maxUE) * 100);
        deficitInput.value = deficit;
    }

    updateTotalShoulderStrengthImpairment();
    updateTotalImpairment();
}

function updateTotalShoulderStrengthImpairment() {
    const movements = ['flexion', 'extension', 'abduction', 'adduction', 'internal-rotation', 'external-rotation'];
    let totalUEImpairment = 0;

    movements.forEach(movement => {
        const impInput = document.getElementById(`shoulder-${movement}-strength-imp`);
        totalUEImpairment += parseInt(impInput.value) || 0;
    });

    const totalWPI = Math.round(totalUEImpairment * 0.6);

    document.getElementById('shoulder-strength-total-ue').textContent = `${totalUEImpairment} UE = ${totalWPI} WPI`;
}

function calculateShoulderArthroplasty() {
    console.log("calculateShoulderArthroplasty function called");
    const selectedOption = document.querySelector('input[name="shoulder-arthroplasty"]:checked');
    const totalElement = document.getElementById('shoulder-arthroplasty-total');
    
    if (selectedOption) {
        const ueImpairment = parseInt(selectedOption.value);
        const wpi = Math.round(ueImpairment * 0.6);
        totalElement.textContent = `${ueImpairment} UE = ${wpi} WPI`;
    } else {
        totalElement.textContent = '0 UE = 0 WPI';
    }
    
    updateTotalImpairment();
}

function calculateShoulderInstability() {
    console.log("calculateShoulderInstability function called");
    const selectedOption = document.querySelector('input[name="shoulder-instability"]:checked');
    const totalElement = document.getElementById('shoulder-instability-total');
    
    if (selectedOption) {
        const ueImpairment = parseInt(selectedOption.value);
        const wpi = Math.round(ueImpairment * 0.6);
        totalElement.textContent = `${ueImpairment} UE = ${wpi} WPI`;
    } else {
        totalElement.textContent = '0 UE = 0 WPI';
    }
    
    updateTotalImpairment();
}

function calculateShoulderSynovialHypertrophy(event) {
    const changedCheckbox = event.target;
    const joint = changedCheckbox.dataset.joint;
    
    // Uncheck other checkboxes for the same joint
    document.querySelectorAll(`.synovial-checkbox[data-joint="${joint}"]`).forEach(checkbox => {
        if (checkbox !== changedCheckbox) {
            checkbox.checked = false;
        }
    });

    // Calculate total impairment
    let totalUEImpairment = 0;
    document.querySelectorAll('.synovial-checkbox:checked').forEach(checkbox => {
        totalUEImpairment += parseInt(checkbox.value);
    });

    const totalWPI = Math.round(totalUEImpairment * 0.6);
    document.getElementById('shoulder-synovial-hypertrophy-total').textContent = `${totalUEImpairment} UE = ${totalWPI} WPI`;

    updateTotalImpairment();
}

function setupShoulderCalculators() {
    if (selectedOptions.shoulder && selectedOptions.shoulder.includes('ROM')) {
        const shoulderInputs = ['flexion', 'extension', 'abduction', 'adduction', 'internal-rotation', 'external-rotation', 'ankylosis-fe', 'ankylosis-aa', 'ankylosis-ie'];
        shoulderInputs.forEach(input => {
            const element = document.getElementById(`shoulder-${input}`);
            if (element) {
                element.addEventListener('input', calculateShoulderROM);
                console.log(`Added event listener for shoulder-${input}`);
            } else {
                console.log(`Element not found: shoulder-${input}`);
            }
        });
    }

    if (selectedOptions.shoulder && selectedOptions.shoulder.includes('Strength')) {
        const movements = ['flexion', 'extension', 'abduction', 'adduction', 'internal-rotation', 'external-rotation'];
        movements.forEach(movement => {
            const deficitElement = document.getElementById(`shoulder-${movement}-strength-deficit`);
            const impElement = document.getElementById(`shoulder-${movement}-strength-imp`);
            if (deficitElement) {
                deficitElement.addEventListener('input', (e) => calculateShoulderStrength(movement, 'deficit'));
            }
            if (impElement) {
                impElement.addEventListener('input', (e) => calculateShoulderStrength(movement, 'imp'));
            }
        });
    }

    if (selectedOptions.shoulder && selectedOptions.shoulder.includes('Arthroplasty')) {
        console.log("Setting up arthroplasty event listeners");
        const arthroplastyOptions = document.querySelectorAll('input[name="shoulder-arthroplasty"]');
        console.log("Number of arthroplasty options found:", arthroplastyOptions.length);
        arthroplastyOptions.forEach(option => {
            option.addEventListener('change', calculateShoulderArthroplasty);
            console.log("Added event listener to option:", option.value);
        });
    }

    if (selectedOptions.shoulder && selectedOptions.shoulder.includes('Instability/Subluxation/Dislocation')) {
        const instabilityOptions = document.querySelectorAll('input[name="shoulder-instability"]');
        instabilityOptions.forEach(option => {
            option.addEventListener('change', calculateShoulderInstability);
        });
    }

    if (selectedOptions.shoulder && selectedOptions.shoulder.includes('Synovial Hypertrophy')) {
        const synovialCheckboxes = document.querySelectorAll('.synovial-checkbox');
        synovialCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', calculateShoulderSynovialHypertrophy);
        });
    }
}

function getShoulderImpairment() {
    let impairments = [];

    if (selectedOptions.shoulder && selectedOptions.shoulder.includes('ROM')) {
        const romImpairment = parseInt(document.getElementById('shoulder-rom-total').textContent);
        impairments.push(romImpairment);
    }

    if (selectedOptions.shoulder && selectedOptions.shoulder.includes('Strength')) {
        const strengthImpairment = parseInt(document.getElementById('shoulder-strength-total-ue').textContent.split(' ')[0]);
        if (!isNaN(strengthImpairment) && strengthImpairment > 0) {
            impairments.push(strengthImpairment);
        }
    }

    if (selectedOptions.shoulder && selectedOptions.shoulder.includes('Arthroplasty')) {
        const arthroplastyImpairment = parseInt(document.getElementById('shoulder-arthroplasty-total').textContent.split(' ')[0]);
        if (!isNaN(arthroplastyImpairment) && arthroplastyImpairment > 0) {
            impairments.push(arthroplastyImpairment);
        }
    }

    if (selectedOptions.shoulder && selectedOptions.shoulder.includes('Instability/Subluxation/Dislocation')) {
        const instabilityImpairment = parseInt(document.getElementById('shoulder-instability-total').textContent.split(' ')[0]);
        if (!isNaN(instabilityImpairment) && instabilityImpairment > 0) {
            impairments.push(instabilityImpairment);
        }
    }

    if (selectedOptions.shoulder && selectedOptions.shoulder.includes('Synovial Hypertrophy')) {
        const synovialImpairment = parseInt(document.getElementById('shoulder-synovial-hypertrophy-total').textContent.split(' ')[0]);
        if (!isNaN(synovialImpairment) && synovialImpairment > 0) {
            impairments.push(synovialImpairment);
        }
    }

    return impairments;
}
