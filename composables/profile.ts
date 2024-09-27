import { defineStore } from 'pinia'
import { getPublicClient } from '@wagmi/core'
import { type PublicClient } from 'viem'

export const CURRENT_STATE_VERSION = 4

export const useOnchainStore = () => {
  const { $wagmi } = useNuxtApp()

  return defineStore('onchainStore', {
    state: () => ({
      version: CURRENT_STATE_VERSION,
      users: {} as { [key: `0x${string}`]: User },
    }),

    getters: {
      hasUser(state) {
        return (address: `0x${string}`) => state.users[address] !== undefined
      },
      user(state) {
        return (address: `0x${string}`) => state.users[address]
      },
      ens() {
        return (address: `0x${string}`) => this.user(address)?.ens
      },
      displayName() {
        return (address: `0x${string}`) => this.ens(address) || shortAddress(address)
      },
    },

    actions: {
      ensureStoreVersion() {
        if (this.version < CURRENT_STATE_VERSION) {
          console.info(`Resetting store due to version mismatch...`);
          this.$reset();
        }
      },

      initializeUser(address: `0x${string}`) {
        this.ensureStoreVersion();

        if (!address || typeof address !== 'string' || !address.startsWith('0x') || address.length !== 42) {
          console.error('Invalid address passed to initializeUser:', address);
          return null;
        }

        if (!this.users[address]) {
          const user: User = {
            address,
            ens: '',
            avatar: '',
            header: '',
            description: '',
            profileUpdatedAtBlock: 0n,
          };
          this.users[address] = user;
        }
        return this.users[address];
      },

      async fetchUserProfile(identifier: string): Promise<User | undefined> {
        this.ensureStoreVersion();
      
        const client = getPublicClient($wagmi, { chainId: 1 }) as PublicClient;
      
        let address: `0x${string}` | undefined;
        let ensName: string | undefined;
      
        if (identifier.startsWith('0x') && identifier.length === 42) {
          address = identifier as `0x${string}`;
          ensName = await client.getEnsName({ address });
        } else {
          ensName = identifier;
          try {
            address = await client.getEnsAddress({ name: ensName }) as `0x${string}`;
            if (!address) {
              throw new Error(`ENS name ${ensName} did not resolve to an address`);
            }
          } catch (error) {
            console.error(`Error resolving ENS name ${ensName}:`, error);
            return;
          }
        }
      
        let user = this.initializeUser(address);
      
        if (!user) {
          console.error('Unable to initialize user for address:', address);
          return;
        }
      
        const block = await client.getBlockNumber();
      
        if (
          this.user(address) &&
          this.user(address).profileUpdatedAtBlock > 0n &&
          (block - this.user(address).profileUpdatedAtBlock) < BLOCKS_PER_CACHE
        ) {
          console.info(`User profile already fetched for address ${address} at block ${block}...`);
          return this.user(address);
        }
      
        console.info(`Fetching user profile for address ${address}...`);
      
        let ens, avatar, header, location, description, url, email, twitter, discord, telegram, reddit, linkedin, github;
        
        const { resolveEipUrl } = useEipResolver();
      
        try {
          if (!ensName) {
            ensName = await client.getEnsName({ address });
          }
          ens = ensName;
      
          if (ens) {
            [avatar, header, location, description, url, email, twitter, discord, telegram, reddit, linkedin, github] = await Promise.all([
              client.getEnsAvatar({ name: ens }),
              client.getEnsText({ name: ens, key: 'header' }),
              client.getEnsText({ name: ens, key: 'location' }),
              client.getEnsText({ name: ens, key: 'description' }),
              client.getEnsText({ name: ens, key: 'url' }),
              client.getEnsText({ name: ens, key: 'email' }),
              client.getEnsText({ name: ens, key: 'com.twitter' }),
              client.getEnsText({ name: ens, key: 'com.discord' }),
              client.getEnsText({ name: ens, key: 'org.telegram' }),
              client.getEnsText({ name: ens, key: 'com.reddit' }),
              client.getEnsText({ name: ens, key: 'com.linkedin' }),
              client.getEnsText({ name: ens, key: 'com.github' }),
            ]);
            console.log("Fetched ENS data:", { avatar, header, description });
            
            if (avatar && avatar.startsWith('eip')) {
              avatar = await resolveEipUrl(avatar);
            }
            if (header && header.startsWith('eip')) {
              header = await resolveEipUrl(header);
            }
          }
        } catch (error) {
          console.error(`Error fetching ENS data for address ${address}:`, error);
        }


      
        this.users[address].ens = ens || '';
        this.users[address].avatar = avatar || '';
        this.users[address].header = header || '';
        this.users[address].location = location || '';
        this.users[address].description = description || '';
        this.users[address].url = url || '';
        this.users[address].email = email || '';
        this.users[address].twitter = twitter || '';
        this.users[address].discord = discord || '';
        this.users[address].telegram = telegram || '';
        this.users[address].reddit = reddit || '';
        this.users[address].linkedin = linkedin || '';
        this.users[address].github = github || '';
        this.users[address].profileUpdatedAtBlock = block;
      
        return this.user(address);
      },
    },

    persist: {
      storage: persistedState.localStorage,
      serializer: {
        serialize: stringifyJSON,
        deserialize: parseJSON,
      },
      key: 'onchainStore',
    },
  })();
};