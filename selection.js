// Updated selection.js

let steps = []; // To store the steps of the sorting process
let currentStep = -1; // To keep track of the current step
async function startSort() {
    const input = document.getElementById('selection-input').value;
    const visualizationContainer = document.getElementById('selection-visualization');

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
        listItem.textContent = value; // Display the number
        list.appendChild(listItem);
    });
    visualizationContainer.appendChild(list);

    // Clear previous steps
    steps = [];
    currentStep = -1;

    // Perform selection sort and store steps
    selectionSort(array);
    
    // Enable the next button after sorting
    document.getElementById('next-button').disabled = false; 
}

function selectionSort(array) {
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            // Store the current state before any swap
            steps.push({ array: [...array], indices: [j, minIndex] });

            // Find the minimum element in the unsorted array
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }

        // Swap the found minimum element with the first element
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            steps.push({ array: [...array], indices: [i, minIndex], swapped: true });
        } else {
            steps.push({ array: [...array], indices: [i, minIndex], swapped: false });
        }
    }

    // Store the final sorted state
    steps.push({ array: [...array], indices: [] });
}

async function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        await displayStep(currentStep); // Await to ensure the animation completes
    }
}

async function displayStep(stepIndex) {
    const visualizationContainer = document.getElementById('selection-visualization');
    const items = visualizationContainer.querySelectorAll('.number-item');
    
    // Keep track of which elements are sorted
    const sortedIndices = steps.slice(0, stepIndex + 1)
        .filter(step => step.sortedIndex !== undefined)
        .map(step => step.sortedIndex);

    // Reset all items but keep sorted elements highlighted
    items.forEach((item, index) => {
        // Remove background color for unsorted elements in this step
        if (!sortedIndices.includes(index)) {
            item.style.backgroundColor = ''; // Reset inline background
            item.style.boxShadow = ''; // Reset glow
            item.classList.remove('sorted-element'); // Remove the sorted class
        }
    });

    // Get the current step
    const step = steps[stepIndex];

    // Highlight the indices for the current step
    if (step.indices && step.indices.length > 0) {
        const [index1, index2] = step.indices;
        items[index1].style.backgroundColor = 'rgb(190, 138, 255)';
        items[index2].style.backgroundColor = 'rgb(93, 18, 185)';
        items[index2].style.boxShadow = '0.3s ease';

        // If the step indicates a swap, animate the swap
        if (step.swapped) {
            await swapAnimate(items[index1], items[index2]);
        }
    }

    // Add or retain the sorted element effect
    if (step.sortedIndex !== undefined) {
        const sortedItem = items[step.sortedIndex];
        sortedItem.classList.add('sorted-element'); // Apply sorted element style
    }

    // Update the numbers displayed immediately after the animation
    step.array.forEach((value, index) => {
        items[index].textContent = value; // Update the text content
    });

    // Send the current array to the iframe for graph update
    const iframe = document.getElementById('selection-graph-frame');
    iframe.contentWindow.postMessage({ type: 'updateChart', array: step.array }, '*');
}

async function swapAnimate(item1, item2) {
    // Get the positions of the items
    const rect1 = item1.getBoundingClientRect();
    const rect2 = item2.getBoundingClientRect();

    // Move the items up a little
    item1.style.transform = `translateY(-20px)`;
    item2.style.transform = `translateY(-20px)`;

    // Wait for the upward movement to finish
    await new Promise(resolve => setTimeout(resolve, 300));

    // Swap text content
    const tempText = item1.textContent; // Store text of item1
    item1.textContent = item2.textContent; // Update the text content
    item2.textContent = tempText; // Update the text content

    // Move the items to their new positions
    item1.style.transform = `translateY(${rect2.top - rect1.top}px)`;
    item2.style.transform = `translateY(${rect1.top - rect2.top}px)`;

    // Wait for the movement to finish
    await new Promise(resolve => setTimeout(resolve, 300));

    // Reset transformations
    item1.style.transform = '';
    item2.style.transform = '';
}

// Function to display initial values as blocks in the initial-values container
function displayInitialValues() {
    const input = document.getElementById('selection-input').value;
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
document.getElementById('selection-input').addEventListener('input', displayInitialValues);