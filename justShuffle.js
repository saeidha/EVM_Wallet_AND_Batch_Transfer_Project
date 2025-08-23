const fs = require('fs');
const csv = require('csv-parser');

const filePath = 'wallets.csv';

// This function shuffles an array in place using the Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

async function processAndShuffleCSV() {
  const wallets = [];

  console.log(`Reading wallets from "${filePath}"...`);

  // 1. Read all rows from the CSV into an array
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      wallets.push(row);
    })
    .on('end', () => {
      if (wallets.length === 0) {
        console.error('🔴 No data found in the CSV file. Aborting.');
        return;
      }
      
      console.log(`Found ${wallets.length} wallets. Shuffling...`);

      // 2. Shuffle the array of wallets
      shuffleArray(wallets);
      console.log('✅ Wallets have been shuffled.');

      // 3. Convert the shuffled data back into a CSV string
      // Start with the header row
      const header = Object.keys(wallets[0]).join(',');
      // Convert each wallet object back to a comma-separated string
      const shuffledRows = wallets.map(row => `${row.address},${row.privateKey}`);
      
      // Combine the header and the shuffled rows
      const csvContent = [header, ...shuffledRows].join('\n');

      // 4. Write the new content back to the original file, overwriting it
      fs.writeFile(filePath, csvContent, 'utf8', (err) => {
        if (err) {
          console.error('🔴 An error occurred while writing the file:', err);
          return;
        }
        console.log(`🎉 Successfully shuffled and saved the new order to "${filePath}"!`);
      });
    });
}

processAndShuffleCSV();