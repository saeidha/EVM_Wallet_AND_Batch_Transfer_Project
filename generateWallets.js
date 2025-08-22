/*
================================================================================

    EVM Wallet Generator & Batch Transfer Project

    This project contains two main scripts:
    1. generateWallets.js: Creates N number of EVM wallets and saves them to wallets.csv.
    2. batchTransfer.js: Reads addresses from wallets.csv and sends a small amount of ETH
       to each from a main funding account.

================================================================================

    --- 🚨 SETUP INSTRUCTIONS 🚨 ---

    1. INITIALIZE YOUR PROJECT:
       - Create a new folder for your project.
       - Open a terminal in that folder and run the following commands:
         npm init -y
         npm install ethers dotenv

    2. CREATE THE SCRIPT FILES:
       - Create a file named `generateWallets.js` and copy the first script below into it.
       - Create a file named `batchTransfer.js` and copy the second script below into it.

    3. CREATE THE .env FILE:
       - In the same folder, create a file named `.env`
       - This file will store your secret keys securely. Add the following lines to it,
         replacing the placeholder values with your actual data:

         # Your main wallet's private key (must have funds for transactions)
         # IMPORTANT: Make sure this is a testnet wallet for testing!
         MAIN_PRIVATE_KEY="0x..."

         # An RPC URL for the network you want to use (e.g., Sepolia, Goerli, or Mainnet)
         # You can get one for free from services like Infura, Alchemy, or QuickNode.
         SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"


    4. RUN THE SCRIPTS:
       - First, run the wallet generator:
         node generateWallets.js

       - After it creates the wallets.csv file, run the transfer script:
         node batchTransfer.js

================================================================================
*/


// ======= FILE 1: generateWallets.js =======

const { ethers } = require('ethers');
const fs = require('fs');

/**
 * @description This script generates a specified number of EVM wallets
 * and saves their addresses and private keys to a CSV file.
 */

// --- CONFIGURATION ---
const NUMBER_OF_WALLETS = 25; // The number of wallets you want to create.
const FILE_PATH = './wallets.csv'; // The output file name.

/**
 * Generates wallets and saves them to a CSV file.
 * @param {number} count - The number of wallets to generate.
 */
const generateWallets = (count) => {
    console.log(`🔥 Starting wallet generation for ${count} wallets...`);

    // Prepare the CSV header
    const csvHeader = "address,privateKey\n";
    fs.writeFileSync(FILE_PATH, csvHeader);

    const wallets = [];
    for (let i = 0; i < count; i++) {
        // Create a new random wallet
        const wallet = ethers.Wallet.createRandom();

        const walletData = {
            address: wallet.address,
            privateKey: wallet.privateKey,
        };
        wallets.push(walletData);

        // Append the new wallet to the CSV file
        const csvLine = `${wallet.address},${wallet.privateKey}\n`;
        fs.appendFileSync(FILE_PATH, csvLine);

        // Log to console
        console.log(`✅ Wallet ${i + 1} generated:`);
        console.log(`   - Address: ${wallet.address}`);
        console.log(`   - Private Key: [REDACTED FOR CONSOLE]`); // Avoid logging private keys in production
    }

    console.log(`\n🎉 Success! ${count} wallets have been generated.`);
    console.log(`💾 Wallet details saved to: ${FILE_PATH}`);
};

// --- Execute the function ---
generateWallets(NUMBER_OF_WALLETS);
