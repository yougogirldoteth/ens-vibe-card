# ENS VIBE CARD

This simple Single Page App doesn't rely on any proprietary APIs and interacts with the Ethereum blockchain via Node RPC endpoints.

The profiles are bootstrapped from on-chain data via ENS domains.

ENS domains provide a simple way for Ethereum users to attach profile data to their wallets.

We read this data to render profiles with avatars, headers, descriptions, and links to other networks.

As an example of a filled-out ENS profile, check out [brantly.eth](https://app.ens.domains/brantly.eth).

If `NUXT_PUBLIC_WALLET_ADDRESS` is not set in the .env file, it becomes [a dynamic card with a search function](https://vibes.scapes.xyz).

If you set `NUXT_PUBLIC_WALLET_ADDRESS` to your wallet address, it becomes your own static [ENS Vibe Card](https://me.worldcomputer.art).

## Prerequisites

- pnpm

## Steps

1. Clone the repo:
    ```sh
    git clone https://github.com/yougogirldoteth/ens-vibe-card.git
    ```

2. Duplicate the `.env.example` file and add the wallet address you want to see displayed:
    ```sh
    NUXT_PUBLIC_WALLET_ADDRESS=0x90f64E01FfAE16490aeFe03C8ED7Dab6c66198C3
    ```

3. Install dependencies:
    ```sh
    pnpm install
    ```

4. Run development server:
    ```sh
    pnpm dev
    ```

5. Easily style your ENS Vibe Card by modifying the `style.css` file located in the `assets` folder. Or change anything else you want.

6. Commit your changes:
    ```sh
    git add .
    git commit -m "first commit"
    ```

7. Create a new repo on GitHub. Push the clone to your new GitHub repo:
    ```sh
    git remote set-url origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
    git push -u origin main
    ```

8. Deploy your ENS Vibe Card however you want. For example with [Vercel](https://vercel.com). If you want it to be YOUR static ENS Vibe Card don't forget to set the environment variable `NUXT_PUBLIC_WALLET_ADDRESS` in the UI of the deployment service.