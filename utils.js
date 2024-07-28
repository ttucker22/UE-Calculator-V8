function findImpairment(angle, dataArray, angleField) {
    let impairment = 0;
    for (let i = 0; i < dataArray.length; i++) {
        let dataAngle = dataArray[i][angleField];
        if (typeof dataAngle === 'string') {
            if (dataAngle.startsWith('<') && angle <= parseInt(dataAngle.slice(1))) {
                impairment = dataArray[i]['ue' + angleField.charAt(0).toUpperCase() + angleField.slice(1)];
                break;
            } else if (dataAngle.startsWith('>') && angle >= parseInt(dataAngle.slice(1))) {
                impairment = dataArray[i]['ue' + angleField.charAt(0).toUpperCase() + angleField.slice(1)];
                break;
            }
        } else if (angle === dataAngle) {
            impairment = dataArray[i]['ue' + angleField.charAt(0).toUpperCase() + angleField.slice(1)];
            break;
        }
    }
    return impairment;
}

function combineImpairments(impairments) {
    if (impairments.length === 0) return 0;
    if (impairments.length === 1) return impairments[0];

    impairments.sort((a, b) => b - a); // Sort in descending order
    let result = impairments[0];

    for (let i = 1; i < impairments.length; i++) {
        result = result + impairments[i] * (1 - result / 100);
        result = Math.round(result * 10) / 10; // Round to nearest 0.1%
    }

    return Math.round(result); // Round to nearest whole percent for final result
}
