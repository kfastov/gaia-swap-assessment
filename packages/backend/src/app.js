import express from 'express';
import { ethers } from 'ethers';
import fs from 'fs';
const app = express();
const port = process.env.PORT || 3001;

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const contractAddress = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0';

const miniswapAbi = JSON.parse(fs.readFileSync('./src/abi/miniswap.json', 'utf8'));

// Create a contract instance
const contract = new ethers.Contract(contractAddress, miniswapAbi, provider);

// Create an interface for decoding logs
const iface = new ethers.Interface(miniswapAbi);

// Function to read and decode all past logs
async function readAndDecodePastLogs() {
  const filter = {
    address: contractAddress,
    fromBlock: 0, // You can specify the starting block number
    toBlock: 'latest',
  };

  try {
    const logs = await provider.getLogs(filter);
    logs.forEach(log => {
      try {
        const parsedLog = iface.parseLog(log);
        console.log(parsedLog);
      } catch (error) {
        console.error('Error parsing log:', error);
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
  }
}

// Call the function to read and decode past logs
readAndDecodePastLogs();

// get latest block
const latestBlock = await provider.getBlockNumber();

console.log(latestBlock);

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});