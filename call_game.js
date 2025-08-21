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
