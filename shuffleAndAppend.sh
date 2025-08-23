#!/bin/bash

# --- Configuration ---
# The CSV file containing the wallets.
WALLET_FILE="wallets.csv"
# The number of times to shuffle and append the wallets.
ITERATIONS=5

# --- Script ---

# 1. Check if the wallet file exists.
if [ ! -f "$WALLET_FILE" ]; then
    echo "🔴 Error: The file '$WALLET_FILE' was not found. Please make sure it's in the same directory."
    exit 1
fi

# 2. Count the lines in the file to ensure it's not empty or just a header.
LINE_COUNT=$(wc -l < "$WALLET_FILE")
if [ "$LINE_COUNT" -le 1 ]; then
    echo "🟡 Warning: The file '$WALLET_FILE' is empty or contains only a header. Nothing to shuffle."
    exit 0
fi

echo "🚀 Reading the original wallet list from '$WALLET_FILE'..."

# 3. Read the original data rows into a variable, skipping the header line.
# 'tail -n +2' starts reading from the second line of the file.
ORIGINAL_WALLETS=$(tail -n +2 "$WALLET_FILE")

echo "✅ Found original wallets. Starting the shuffle and append process for $ITERATIONS iterations."
echo "--------------------------------------------------"

# 4. Loop for the specified number of iterations.
for i in $(seq 1 $ITERATIONS)
do
    echo "🔄 Iteration $i of $ITERATIONS: Shuffling and appending..."
    
    # 5. Shuffle the original wallet list and append (>>) the result to the end of the file.
    # The 'shuf' command randomly permutes its input lines.
    echo "$ORIGINAL_WALLETS" | shuf >> "$WALLET_FILE"
done

echo "--------------------------------------------------"
echo "🎉 Success! The script has finished."
echo "✅ $ITERATIONS shuffled sets of wallets have been appended to '$WALLET_FILE'."
