let steps = [];
let currentStep = -1;

async function startSort() {
    const input = document.getElementById('merge-input').value;
    const visualizationContainer = document.getElementById('merge-visualization');

    // Parse input values
    let array = input.split(',').map(Number);

    // Clear the visualization container for new sorting
    visualizationContainer.innerHTML = '';

    // Create visual representation as a list
    const list = document.createElement('ul');
    list.className = 'number-list';
    array.forEach(value => {
        const listItem = document.createElement('li');
        listItem.className = 'number-item';
        listItem.textContent = value;
        list.appendChild(listItem);
    });
    visualizationContainer.appendChild(list);

    // Clear previous steps
    steps = [];
    currentStep = -1;

    // Perform merge sort and store steps
    mergeSort(array, 0, array.length - 1);

    // Enable the next button after sorting
    document.getElementById('next-button').disabled = false;
}

function mergeSort(array, left, right) {
    if (left < right) {
        const middle = Math.floor((left + right) / 2);

        mergeSort(array, left, middle);
        mergeSort(array, middle + 1, right);

        merge(array, left, middle, right);
    }
}

function merge(array, left, middle, right) {
    const leftArray = array.slice(left, middle + 1);
    const rightArray = array.slice(middle + 1, right + 1);

    let i = 0, j = 0, k = left;

    while (i < leftArray.length && j < rightArray.length) {
        steps.push({ array: [...array], indices: [k, k + 1] });

        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            i++;
        } else {
            array[k] = rightArray[j];
            j++;
        }
        k++;
    }

    // Copy remaining elements of leftArray, if any
    while (i < leftArray.length) {
        array[k] = leftArray[i];
        i++;
        k++;
    }

    // Copy remaining elements of rightArray, if any
    while (j < rightArray.length) {
        array[k] = rightArray[j];
        j++;
        k++;
    }

    // Record the final state of the array after merging
    steps.push({ array: [...array], indices: [] });
}

async function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        await displayStep(currentStep);
    } else {
        // Disable the button if there are no more steps
        document.getElementById('next-button').disabled = true;
    }
}

async function displayStep(stepIndex) {
    const visualizationContainer = document.getElementById('merge-visualization');
    const items = visualizationContainer.querySelectorAll('.number-item');

    const step = steps[stepIndex];
    if (step.indices && step.indices.length > 0) {
        const [index1, index2] = step.indices;
        items[index1].style.backgroundColor = 'rgb(190, 138, 255)';
        items[index2].style.backgroundColor = 'rgb(93, 18, 185)';
    }

    step.array.forEach((value, index) => {
        items[index].textContent = value;
    });

    const iframe = document.getElementById('merge-graph-frame');
    iframe.contentWindow.postMessage({ type: 'updateChart', array: step.array }, '*');
}

// Function to display initial values as blocks in the initial-values container
function displayInitialValues() {
    const input = document.getElementById('merge-input').value; // Use the merge input field
    const initialValuesContainer = document.getElementById('initial-values-display');

    // Clear previous blocks
    initialValuesContainer.innerHTML = '';

    // Split the input values and trim whitespace
    const values = input.split(',').map(value => value.trim());

    // Create a block for each initial value
    values.forEach(value => {
        if (value) { // Avoid empty blocks if there's extra comma
            const block = document.createElement('div');
            block.classList.add('array-block');
            block.textContent = value;
            initialValuesContainer.appendChild(block);
        }
    });
}

// Event listener for real-time updates as the user types
document.getElementById('merge-input').addEventListener('input', displayInitialValues);