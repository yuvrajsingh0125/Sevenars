// interact.js
import { ethers } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = [
  "function uploadFile(string _fileHash, string _fileURL) public",
  "function viewFile(uint _fileId) public view returns (string , string)",
  "function grantAccess(uint _fileId, address _user) public",
  "function revokeAccess(uint _fileId, address _user) public",
  "function hasAccess(uint _fileId, address _user) public view returns (bool)",
  "function fileCount() public view returns (uint)"
];

const privateKey = "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e";

export async function uploadToBlockchain(fileHash, fileURL) {
  // Pass a pre-defined Network so ethers skips auto-detection (no background polling)
  const network  = new ethers.Network("localhost", 31337);
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545", network, { staticNetwork: network });
  const wallet   = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  const tx = await contract.uploadFile(fileHash, fileURL);
  await tx.wait();

  const count  = await contract.fileCount();
  const fileId = Number(count) - 1;
  const [storedHash, storedURL] = await contract.viewFile(fileId);
  const hasAccess = await contract.hasAccess(fileId, wallet.address);

  provider.destroy();

  return { fileId, fileHash: storedHash, fileURL: storedURL, hasAccess, message: "✅ Uploaded to Ethereum successfully!" };
}
