import WalletBalance from './WalletBalance';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
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
            <NFTImage tokenId={i} getCount={getCount} />
          </div>
        ))}
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {
  const metadataCID = 'QmR9nXy6XHmJcGLXHDjWN79BhaQEN21LU4kU4V2QvkdbDN';
  const metadataURI = `ipfs://${metadataCID}/${tokenId}.json`;
  const metadataAccessURI = `https://ipfs.io/ipfs/${metadataCID}/${tokenId}.json`;
  const imageCID = 'QmesATCiAPVNA6X7C3TnbMnvZjK4g27HAV3cdr1aTKYeH4'
  const imageURI = `https://ipfs.io/ipfs/${imageCID}/${tokenId}.png`;

  async function checkResource(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }

  const [nftExists, setNftExists] = useState(null);
  useEffect(() => {
    const checkNft = async () => {
      const exists = await checkResource(metadataAccessURI);
      setNftExists(exists);
    };
    checkNft();
  }, [metadataAccessURI]);

  const [isMinted, setIsMinted] = useState(false);
  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result)
    setIsMinted(result);
  };

  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther('0.05'),
    });

    await result.wait();
    getMintedStatus();
    getCount();
  };

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
    alert(uri);
  }
  if (nftExists) {
    return (
      <div>
        <img src={isMinted ? imageURI : "src/assets/placeholder.png"} width="240" height="240"></img>
        <h5>ID #{tokenId}</h5>
        {!isMinted ? (
          <button onClick={mintToken}>
            Mint
          </button>
        ) : (
          <button onClick={getURI}>
            Taken! Show URI
          </button>
        )}
      </div>
    );
  } else {
    return;
  }

}

export default Home;
