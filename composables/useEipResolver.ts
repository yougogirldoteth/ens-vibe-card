import { createPublicClient, http } from 'viem';
import { mainnet, base } from 'viem/chains';

export function useEipResolver() {
  const resolveEipUrl = async (url: string): Promise<string | null> => {
    const match = url.match(/^eip155:(\d+)\/(erc\d+):([^/]+)\/(.+)$/);
    if (!match) {
        console.error('Invalid EIP-155 URI:', url);
        return null;
    }
    const chainId = Number(match[1]);
    const contractType = match[2];
    const contractAddress = match[3] as `0x${string}`;
    const tokenId = match[4];

    let chainConfig;
    switch (chainId) {
        case 1:
            chainConfig = mainnet;
        break;
        case 8453:
            chainConfig = base;
        break;
      // maybe add other chains - adding console.log for now
      default:
        console.error(`Unsupported chainId: ${chainId}`);
        return null;
    }

    const client = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });

    if (!client) {
      console.error('Public client is undefined');
      return null;
    }

    let tokenURI: string;
    try {
      if (contractType === 'erc721') {
        const erc721TokenUriAbi = [
          {
            name: 'tokenURI',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'tokenId', type: 'uint256' }],
            outputs: [{ name: '', type: 'string' }],
          },
        ];

        tokenURI = await client.readContract({
          address: contractAddress,
          abi: erc721TokenUriAbi,
          functionName: 'tokenURI',
          args: [BigInt(tokenId)],
        });
      } else if (contractType === 'erc1155') {
        const erc1155UriAbi = [
          {
            name: 'uri',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'id', type: 'uint256' }],
            outputs: [{ name: '', type: 'string' }],
          },
        ];

        tokenURI = await client.readContract({
          address: contractAddress,
          abi: erc1155UriAbi,
          functionName: 'uri',
          args: [BigInt(tokenId)],
        });

        if (tokenURI.includes('{id}')) {
          const tokenIdHex = BigInt(tokenId).toString(16).padStart(64, '0');
          tokenURI = tokenURI.replace('{id}', tokenIdHex);
        }
      } else {
        console.error('Unsupported contract type:', contractType);
        return null;
      }
    } catch (error) {
      console.error('Error fetching tokenURI:', error);
      return null;
    }

    if (tokenURI.startsWith('ipfs://')) {
      tokenURI = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
    } else if (tokenURI.startsWith('ipfs/')) {
      tokenURI = 'https://ipfs.io/' + tokenURI;
    }

    // maybe have to add arweave

    let metadata;
    try {
      const response = await fetch(tokenURI);
      metadata = await response.json();
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return null;
    }

    let imageUrl = metadata.image || metadata.image_url;

    if (!imageUrl) {
      console.error('No image found in metadata');
      return null;
    }

    if (imageUrl.startsWith('ipfs://')) {
      imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    } else if (imageUrl.startsWith('ipfs/')) {
      imageUrl = 'https://ipfs.io/' + imageUrl;
    }

    return imageUrl;
  };

  return { resolveEipUrl };
}
