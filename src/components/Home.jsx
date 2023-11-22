import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import SharklerNft from '../../sharkler-nft-contract/src/artifacts/contracts/SharklerNft.sol/SharklerNft.json';

const contractAddress = '0xF1f3E5e56A8A562cF0010dEb06484AbfBEc43353';
const provider = new ethers.providers.Web3Provider(window.ethereum);
// get the end user
const signer = provider.getSigner();
// get the smart contract
const contract = new ethers.Contract(contractAddress, SharklerNft.abi, signer);


function Home() {
  const [totalMinted, setTotalMinted] = useState(0);
  
  // update totalMinted
  const getCount = async () => {
    const count = await contract.count();
    console.log(count);
    setTotalMinted(parseInt(count));
  };

  useEffect(() => {
    getCount();
  }, []);

  return (
    <div>
        <WalletBalance />
        {Array(totalMinted + 1)
        .fill(0)
        .map((_, i) => (
            <div key={i}>
              1
            </div>
        ))}
    </div>
  );
}

export default Home;
