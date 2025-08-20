

// ======= FILE 2: batchTransfer.js =======

const { ethers } = require('ethers');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

/**
 * @description This script reads wallet addresses from a CSV file and sends a
 * fixed amount of ETH to each from a main funding wallet.
 */

// --- CONFIGURATION ---
const WALLETS_FILE_PATH = './wallets.csv'; // Path to the CSV file with wallet addresses.
const AMOUNT_TO_SEND_ETH = '0.000007'; // The amount of ETH to send to each wallet.
const MAIN_PRIVATE_KEY = process.env.MAIN_PRIVATE_KEY;
const RPC_URL = process.env.SEPOLIA_RPC_URL; // Using Sepolia as an example

/**
 * Reads wallet addresses from the CSV file.
 * @returns {string[]} An array of wallet addresses.
 */
const getRecipientAddresses = () => {
    if (!fs.existsSync(WALLETS_FILE_PATH)) {
        throw new Error(`Wallet file not found at ${WALLETS_FILE_PATH}. Please run generateWallets.js first.`);
    }
    const fileContent = fs.readFileSync(WALLETS_FILE_PATH, 'utf8');
    const rows = fileContent.trim().split('\n').slice(1); // Remove header and split by line
    return rows.map(row => row.split(',')[0]); // Get the address (first column)
};

/**
 * Sends ETH to a list of addresses sequentially.
 */
const batchTransfer = async () => {
    // --- 1. Input Validation ---
    if (!MAIN_PRIVATE_KEY || !RPC_URL) {
        console.error("🚨 Error: MAIN_PRIVATE_KEY and SEPOLIA_RPC_URL must be set in your .env file.");
        return;
    }

    // --- 2. Setup Provider and Wallet ---
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const senderWallet = new ethers.Wallet(MAIN_PRIVATE_KEY, provider);
    console.log(`🏦 Using sender wallet: ${senderWallet.address}`);

    const senderBalance = await senderWallet.getBalance();
    console.log(`💰 Sender balance: ${ethers.utils.formatEther(senderBalance)} ETH`);

    // --- 3. Get Recipients and Calculate Total Cost ---
    const recipients = getRecipientAddresses();
    const amountToSendWei = ethers.utils.parseEther(AMOUNT_TO_SEND_ETH);
    const totalAmountToSend = amountToSendWei.mul(recipients.length);

    if (senderBalance.lt(totalAmountToSend)) {
        console.error("🚨 Error: Insufficient funds in the sender wallet to complete all transfers.");
        console.error(`   - Required: ~${ethers.utils.formatEther(totalAmountToSend)} ETH + gas fees.`);
        return;
    }

    console.log(`\n🚀 Starting batch transfer of ${AMOUNT_TO_SEND_ETH} ETH to ${recipients.length} addresses...`);

   