let steps = [];
let currentStep = -1;

async function startSort() {
    const input = document.getElementById('quick-input').value; // Input field for values
    const visualizationContainer = document.getElementById('quick-visualization'); // Visualization container for Quick Sort

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

    // Perform quick sort and store steps
    quickSort(array, 0, array.length - 1);

    // Enable the next button after sorting
    document.getElementById('next-button').disabled = false;
}

function quickSort(array, low, high) {
    if (low < high) {
        const pi = partition(array, low, high);

        quickSort(array, low, pi - 1);
        quickSort(array, pi + 1, high);
    }
}

function partition(array, low, high) {
    const pivot = array[high]; // Choosing the last element as pivot
    let i = low - 1; // Index of smaller element

    for (let j = low; j < high; j++) {
        steps.push({ array: [...array], indices: [j, high] }); // Record the current state

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]]; // Swap if element is smaller than pivot
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]]; // Swap the pivot element with the element at i + 1
    steps.push({ array: [...array], indices: [] }); // Record the final state after partitioning
    return i + 1; // Return the partitioning index
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
    const visualizationContainer = document.getElementById('quick-visualization');
    const items = visualizationContainer.querySelectorAll('.number-item');

    const step = steps[stepIndex];
    if (step.indices && step.indices.length > 0) {
        const [index1, index2] = step.indices;
        items[index1].style.backgroundColor = 'rgb(190, 138, 255)'; // Highlight the current element
        items[index2].style.backgroundColor = 'rgb(93, 18, 185)'; // Highlight the pivot element
    }

    step.array.forEach((value, index) => {
        items[index].textContent = value; // Update the displayed values
    });

    const iframe = document.getElementById('quick-graph-frame'); // Reference to the graph frame
    iframe.contentWindow.postMessage({ type: 'updateChart', array: step.array }, '*'); // Update the chart with the current array state
}

// Function to display initial values as blocks in the initial-values container
function displayInitialValues() {
    const input = document.getElementById('quick-input').value; // Use the input field for values
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
document.getElementById('quick-input').addEventListener('input', displayInitialValues);