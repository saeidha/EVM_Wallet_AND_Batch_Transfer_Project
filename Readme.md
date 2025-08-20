# EVM Wallet Generator & Batch Transfer Project

## Overview

This project provides a set of Node.js scripts to automate two common tasks in EVM blockchain development:
1.  **Wallet Generation**: Create a large number of EVM-compatible wallets and securely save their credentials.
2.  **Batch Funding**: Distribute a small amount of ETH from a primary "funder" wallet to all the newly created wallets.

This is particularly useful for airdrops, setting up test accounts, or distributing funds for a decentralized application.

---


## Features

-   **Generate Wallets**: Creates any number of wallets and exports their addresses and private keys to a `wallets.csv` file.
-   **Batch Transfers**: Reads addresses from the CSV and sends a pre-configured amount of ETH to each one sequentially.
-   **Secure**: Uses a `.env` file to keep your private keys and RPC URLs out of the source code.
-   **Configurable**: Easily change the number of wallets, the amount to send, and the network configuration.
-   **Robust**: Includes error handling for file access and insufficient funds.

---

## Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (version 14.x or later)
-   npm (usually comes with Node.js)

---
## 🚀 Setup Instructions

Follow these steps to get the project running on your local machine.

### 1. Clone or Download the Project
First, get the project files into a folder on your computer.

### 2. Install Dependencies
Navigate into the project directory with your terminal and run the following command to install the necessary libraries (`ethers.js` and `dotenv`):

```bash
npm install