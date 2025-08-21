const { ethers } = require("ethers");
const fs = require("fs");
const csv = require("csv-parser");
require("dotenv").config();

// --- CONFIGURATION ---
const { RPC_URL, CONTRACT_ADDRESS } = process.env;
const contractABI = require("./abi.json"); // Load the ABI

// List of all functions that can be called
const functionNames = [
    'mintTokens', 'playSimpleGamble', 'playShiftedGamble', 'playHighReward',
    'playEvenOrOdd', 'playInvertedDice', 'playJackpot', 'playMultiplier',
    'playPowerOfTwo', 'playAllOrNothing', 'playSafeBet'
];

// --- HELPER FUNCTIONS ---

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create a delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- MAIN LOGIC ---

async function main() {
    if (!RPC_URL || !CONTRACT_ADDRESS) {
        console.error("❌ Missing RPC_URL or CONTRACT_ADDRESS in .env file");
        return;
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallets = [];

    // 1. Read and parse the CSV file
    fs.createReadStream("wallet.csv")
        .pipe(csv())
        .on("data", (row) => {
            // Ensure the privateKey column exists and is not empty
            if (row.privateKey) {
                wallets.push(row.privateKey);
            }
        })
        .on("end", async () => {
            console.log(`✅ CSV file successfully processed. Found ${wallets.length} wallets.`);
            
            // 2. Loop through each wallet and interact with the contract
            for (let i = 0; i < wallets.length; i++) {
                const privateKey = wallets[i];
                const wallet = new ethers.Wallet(privateKey, provider);
                const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

                console.log(`\n--- Processing Wallet #${i + 1}: ${wallet.address} ---`);

                

                // d. Wait for a random duration before the next wallet
                const delay = getRandomNumber(500, 1000); // 0.5 to 1 second
                console.log(`⏳ Waiting for ${delay}ms...`);
                await sleep(delay);
            }

            console.log("\n🎉 All wallets have been processed!");
        });
}

main().catch((error) => {
    console.error("An unexpected error occurred:", error);
    process.exitCode = 1;
});