const ethers = require('ethers');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

/**
 * @description This script reads wallet addresses from a CSV file and sends a
 * fixed amount of ETH to each from a main funding wallet.
 */

// --- CONFIGURATION ---
const WALLETS_FILE_PATH = './wallets.csv';
const BASE_AMOUNT_TO_SEND_ETH = '0.0012'; // Amount to send to each wallet 0.02

const MAIN_PRIVATE_KEY = process.env.MAIN_PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Reads wallet addresses from the CSV file.
 * @returns {string[]} An array of wallet addresses.
 */
const getRecipientAddresses = () => {
    if (!fs.existsSync(WALLETS_FILE_PATH)) {
        throw new Error(`Wallet file not found at ${WALLETS_FILE_PATH}. Please run generateWallets.js first.`);
    }
    const fileContent = fs.readFileSync(WALLETS_FILE_PATH, 'utf8');
    const rows = fileContent.trim().split('\n').slice(1); // Remove header
    return rows.map(row => row.split(',')[0]); // Get the address
};

/**
 * Sends ETH to a list of addresses sequentially.
 */
const batchTransfer = async () => {
    // --- 1. Input Validation ---
    if (!MAIN_PRIVATE_KEY || !RPC_URL) {
        console.error("🚨 Error: MAIN_PRIVATE_KEY and RPC_URL must be set in your .env file.");
        return;
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const senderWallet = new ethers.Wallet(MAIN_PRIVATE_KEY, provider);
    console.log(`🏦 Using sender wallet: ${senderWallet.address}`);

    const senderBalance = await provider.getBalance(senderWallet.address);
    console.log(`💰 Sender balance: ${ethers.formatEther(senderBalance)} ETH`);

    const recipients = getRecipientAddresses();

    console.log(`\n🚀 Starting batch transfer to ${recipients.length} addresses...`);

    // --- 4. Process Transactions Sequentially ---
    for (let i = 0; i < recipients.length; i++) {
                const recipientAddress = recipients[i];

        // --- Calculate random extra ---
        const randomExtra = getRandomNumber(1, 9) * 0.00001; // between 0.00001 and 0.00009
        const finalAmountEth = (parseFloat(BASE_AMOUNT_TO_SEND_ETH) + randomExtra).toFixed(8); // keep precision
        const amountToSendWei = ethers.parseEther(finalAmountEth);

        console.log(`\n--- Sending to wallet ${i + 1}/${recipients.length} ---`);
        console.log(`   -> To: ${recipientAddress}`);
        console.log(`   -> Amount: ${finalAmountEth} ETH`);
        try {
            const tx = {
                to: recipientAddress,
                value: amountToSendWei,
            };

            const txResponse = await senderWallet.sendTransaction(tx);
            console.log(`   ⏳ Transaction sent. Waiting for confirmation...`);
            console.log(`   - Hash: ${txResponse.hash}`);

            await txResponse.wait(); // Wait for the transaction to be mined

            console.log(`   ✅ Success! Transaction confirmed.`);

        } catch (error) {
            console.error(`   ❌ Failed to send to ${recipientAddress}. Error: ${error.message}`);
        }
    }

    console.log("\n🎉 Batch transfer process complete!");
    const finalBalance = await provider.getBalance(senderWallet.address); // <-- UPDATED
    console.log(`💰 Sender final balance: ${ethers.formatEther(finalBalance)} ETH`);
};

// --- Execute the function ---
batchTransfer().catch(error => {
    console.error("An unexpected error occurred:", error);
});