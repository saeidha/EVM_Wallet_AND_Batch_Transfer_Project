#!/bin/bash

# This script runs a sequence of Node.js and shell scripts in a specific order,
# with a 3-second delay between each step.

# --- Start of Execution ---

echo "🚀 Starting the process..."
echo "---------------------------------"

# Step 1: Generate wallets
echo "1. Running 'generateWallets.js'..."
node generateWallets.js
echo "✅ 'generateWallets.js' finished."

# Wait for 3 seconds
sleep 3

# Step 2: Run the batch transfer
echo "---------------------------------"
echo "2. Running 'batchTransfer.js'..."
# node batchTransfer.js
echo "✅ 'batchTransfer.js' finished."

# Wait for 3 seconds
sleep 3

# Step 3: Shuffle and append wallets
# Note: Ensure 'shuffleAndAppend.sh' is executable with 'chmod +x shuffleAndAppend.sh'
echo "---------------------------------"
echo "3. Running 'shuffleAndAppend.sh'..."
./shuffleAndAppend.sh
echo "✅ 'shuffleAndAppend.sh' finished."

# Wait for 3 seconds
sleep 3

# Step 4: Call the game script
echo "---------------------------------"
echo "4. Running 'call_game.js'..."
# node call_game.js
echo "✅ 'call_game.js' finished."

echo "---------------------------------"
echo "🎉 All steps completed successfully!"
