const fs = require('fs');
const csv = require('csv-parser');

const filePath = 'wallets.csv';
const ITERATIONS = 5;

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array The array to shuffle.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

/**
 * Reads a CSV file, then shuffles and appends its content back to the file
 * for a specified number of iterations.
 */
async function shuffleAndAppend() {
  const originalWallets = [];

  // 1. Read all original rows from the CSV into an array.
  // We do this first to get a clean list before we start appending.
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      originalWallets.push(row);
    })
    .on('end', () => {
      if (originalWallets.length === 0) {
        console.error('🔴 No data found in the CSV file. Aborting.');
        return;
      }
      
      console.log(`✅ Found ${originalWallets.length} original wallets. Starting shuffle and append process...`);
      console.log("--------------------------------------------------");

      try {
        // 2. Loop for the specified number of iterations.
        for (let i = 0; i < ITERATIONS; i++) {
          console.log(`🔄 Iteration ${i + 1} of ${ITERATIONS}: Shuffling and appending...`);

          // Create a fresh copy of the original wallets to shuffle.
          let walletsToShuffle = [...originalWallets];
          
          shuffleArray(walletsToShuffle);

          // 3. Convert the shuffled data back into a CSV string (without a header).
          const shuffledRows = walletsToShuffle.map(row => `${row.address},${row.privateKey}`);
          
          // The content to append is just the joined rows. A newline is added before it
          // to ensure it starts on a new line in the file.
          let csvContentToAppend =  '';
          if (i === 0) {
            csvContentToAppend =  shuffledRows.join('\n');
          }else{
            csvContentToAppend = '\n' + shuffledRows.join('\n');
          }
          

          // 4. Append the shuffled content to the file synchronously.
          fs.appendFileSync(filePath, csvContentToAppend, 'utf8');
        }
        
        console.log("--------------------------------------------------");
        console.log(`🎉 Success! Appended ${ITERATIONS} shuffled sets to "${filePath}"!`);
      } catch (err) {
        console.error('🔴 An error occurred while writing to the file:', err);
      }
    });
}

shuffleAndAppend();
