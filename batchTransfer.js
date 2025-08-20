

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
