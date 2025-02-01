// Function to display the selected sorting algorithm section
function navigateToPage(page) {
    if (page) { // Only navigate if an option is selected
        window.location.href = page; // Redirect to the selected page
    }
}

function handleSortSelection() {
    const selectedSort = document.getElementById("sort-select").value;

    // Hide all sort sections initially
    document.querySelectorAll(".sort-section").forEach(section => section.style.display = "none");

    // Show the selected sort section
    if (selectedSort) {
        document.getElementById(selectedSort).style.display = "block";
    }
}
function showSort(sortType) {
    const sections = document.querySelectorAll('.sort-section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sortType).style.display = 'block';
}


// script.js

let steps = []; // To store the steps of the sorting process
let currentStep = -1; // To keep track of the current step

async function startSort() {
    const input = document.getElementById('bubble-input').value;
    const visualizationContainer = document.getElementById('bubble-visualization');

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

    // Perform bubble sort and store steps
    bubbleSort(array);
    
    // Enable the next button after sorting
    document.getElementById('next-button').disabled = false; 
}

function bubbleSort(array) {
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Store the current state before any swap
            steps.push({ array: [...array], indices: [j, j + 1] });

            // Compare and swap if necessary
            if (array[j] > array[j + 1]) {
                // Perform the swap and store the updated array state
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                steps.push({ array: [...array], indices: [j, j + 1], swapped: true });
            } else {
                steps.push({ array: [...array], indices: [j, j + 1], swapped: false });
            }
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
    const visualizationContainer = document.getElementById('bubble-visualization');
    const items = visualizationContainer.querySelectorAll('.number-item');

    // Reset all items
    items.forEach(item => {
        item.style.backgroundColor = 'transparent';
    });

    // Get the current step
    const step = steps[stepIndex];

    // Highlight the indices for the current step
    if (step.indices.length > 0) {
        const [index1, index2] = step.indices;
        items[index1].style.backgroundColor = 'rgb(158, 86, 252)';
        items[index2].style.backgroundColor = 'rgb(158, 86, 252)';

        // If the step indicates a swap, animate the swap
        if (step.swapped) {
            await swapAnimate(items[index1], items[index2]);
        }
    }

    // Update the numbers displayed immediately after the animation
    step.array.forEach((value, index) => {
        items[index].textContent = value; // Update the text content immediately
    });
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

    // Update the text content immediately
    const tempText = item1.textContent; // Store text of item1
    item1.textContent = item2.textContent; // Update the text content
    item2.textContent = tempText; // Update the text content

    // Move the items to their new positions
    item1.style.transform = `translateY(${rect2.top - rect1.top}px)`;
    item2.style.transform = `translateY(${rect1.top - rect2.top}px)`;

    // Wait for the movement to finish
    await new Promise(resolve => setTimeout(resolve, 300));
}

// Function to display initial values as blocks in the initial-values container
function displayInitialValues() {
    const input = document.getElementById('bubble-input').value;
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
document.getElementById('bubble-input').addEventListener('input', displayInitialValues);