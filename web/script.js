function sortTable(columnIndex) {
  const table = document.getElementById('projectsTable');
  const rows = Array.from(table.rows).slice(1); // Skip the header row
  const isNumeric = columnIndex === 1; // Stars column is numeric

  rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].innerText.replace(/,/g, '');
    const cellB = b.cells[columnIndex].innerText.replace(/,/g, '');

    return isNumeric
      ? parseInt(cellB) - parseInt(cellA) // Sort numerically
      : cellA.localeCompare(cellB); // Sort alphabetically
  });

  rows.forEach((row) => table.tBodies[0].appendChild(row));
}

let currentPage = 1;
const rowsPerPage = 10;
let rows = []; // Will hold the table rows

// Function to display a specific page
function displayPage(page) {
  const table = document.getElementById('projectsTable');
  const tbody = table.tBodies[0];
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  tbody.innerHTML = ''; // Clear the table body
  rows.slice(start, end).forEach((row) => tbody.appendChild(row)); // Add rows for the current page

  updatePagination();
}

// Function to update pagination controls
function updatePagination() {
  const pagination = document.getElementById('pagination');
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  pagination.innerHTML = ''; // Clear existing pagination controls

  // Create "Previous" button
  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => {
    currentPage--;
    displayPage(currentPage);
  });
  pagination.appendChild(prevButton);

  // Create page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.className = currentPage === i ? 'active' : '';
    pageButton.addEventListener('click', () => {
      currentPage = i;
      displayPage(currentPage);
    });
    pagination.appendChild(pageButton);
  }

  // Create "Next" button
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener('click', () => {
    currentPage++;
    displayPage(currentPage);
  });
  pagination.appendChild(nextButton);
}

// Initialize table with pagination
function initTableWithPagination() {
  const table = document.getElementById('projectsTable');
  rows = Array.from(table.rows).slice(1); // Skip the header row
  displayPage(currentPage);
}

// Call this function after populating the table
initTableWithPagination();
