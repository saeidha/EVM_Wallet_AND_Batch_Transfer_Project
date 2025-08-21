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
