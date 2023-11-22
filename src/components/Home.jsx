import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import SharklerNft from '../../sharkler-nft-contract/artifacts/contracts/SharklerNft.sol/SharklerNft.json';

const contractAddress = '0xBd39415E98723804AC3CAB33ee6989d326816108';
const provider = new ethers.providers.Web3Provider(window.ethereum);
// get the end user
const signer = provider.getSigner();
// get the smart contract
const contract = new ethers.Contract(contractAddress, SharklerNft.abi, signer);


function Home() {
  const [totalMinted, setTotalMinted] = useState(0);
  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
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
            < getCount/>
            </div>
        ))}
    </div>
  );
}

export default Home;
