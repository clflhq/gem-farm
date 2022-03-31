import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios from 'axios';
import { programs } from '@metaplex/js';
import * as anchor from '@project-serum/anchor';

const CANDY_MACHINE_PROGRAM_V2_ID = new PublicKey(
  'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ'
);

const {
  metadata: { Metadata },
} = programs;

export interface INFT {
  pubkey?: PublicKey;
  mint: PublicKey;
  onchainMetadata: unknown;
  externalMetadata: unknown;
}

async function getTokensByOwner(owner: PublicKey, conn: Connection) {
  const tokens = await conn.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  // initial filter - only tokens with 0 decimals & of which 1 is present in the wallet
  return tokens.value
    .filter((t) => {
      const amount = t.account.data.parsed.info.tokenAmount;
      return amount.decimals === 0 && amount.uiAmount === 1;
    })
    .map((t) => {
      console.log('token', t);
      console.log('public', t.pubkey.toString());
      console.log('mint', t.account.data.parsed.info.mint);
      return { pubkey: t.pubkey, mint: t.account.data.parsed.info.mint };
    });
}

async function getNFTMetadata(
  mint: string,
  conn: Connection,
  pubkey?: string
): Promise<INFT | undefined> {
  // console.log('Pulling metadata for:', mint);
  try {
    const metadataPDA = await Metadata.getPDA(mint);
    console.log('mint', mint);
    console.log('metadataPDA', metadataPDA.toString());
    const onchainMetadata = (await Metadata.load(conn, metadataPDA)).data;
    const externalMetadata = (await axios.get(onchainMetadata.data.uri)).data;
    return {
      pubkey: pubkey ? new PublicKey(pubkey) : undefined,
      mint: new PublicKey(mint),
      onchainMetadata,
      externalMetadata,
    };
  } catch (e) {
    console.log(`failed to pull metadata for token ${mint}`);
  }
}

export async function getNFTMetadataForMany(
  tokens: any[],
  conn: Connection,
  collectionName?: string
): Promise<INFT[]> {
  const promises: Promise<INFT | undefined>[] = [];
  tokens.forEach((t) => promises.push(getNFTMetadata(t.mint, conn, t.pubkey)));
  let nfts = (await Promise.all(promises)).filter((n) => !!n);
  if (collectionName) {
    nfts.forEach((n) => {
      console.log('name', (n?.externalMetadata as any).collection?.name);
      console.log('collectionName', collectionName);
      console.log(
        'true',
        (n?.externalMetadata as any).collection?.name === collectionName
      );
    });
    nfts = nfts.filter(
      (n) => (n?.externalMetadata as any).collection?.name === collectionName
    );
  }
  console.log('nfts', nfts);
  console.log(`found ${nfts.length} metadatas`);

  return nfts as INFT[];
}

async function deriveCandyMachineV2ProgramAddress(
  candyMachineId: anchor.web3.PublicKey
): Promise<[PublicKey, number]> {
  return await PublicKey.findProgramAddress(
    [Buffer.from('candy_machine'), candyMachineId.toBuffer()],
    CANDY_MACHINE_PROGRAM_V2_ID
  );
}

export async function getNFTsByOwner(
  owner: PublicKey,
  conn: Connection,
  candyMachineId: string
): Promise<INFT[]> {
  const [candyMachineCreator] = await deriveCandyMachineV2ProgramAddress(
    new PublicKey(candyMachineId)
  );
  console.log('candyMachineCreator', candyMachineCreator.toString());
  const metadatas = (await Metadata.findByOwnerV2(conn, owner)).filter(
    (m) =>
      m.data.data.creators &&
      m.data.data.creators.length > 0 &&
      m.data.data.creators[0].address === candyMachineCreator.toBase58()
  );
  console.log('metadatas', metadatas);
  const tokens = metadatas.map((m) => ({
    pubkey: m.pubkey,
    mint: m.data.mint,
  }));
  console.log(`found ${metadatas.length} tokens`);

  return await getNFTMetadataForMany(tokens, conn);
}
