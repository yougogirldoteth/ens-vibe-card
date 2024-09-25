export interface User {
    address: `0x${string}`
    ens?: string|null
    avatar?: string|null
    header?: string|null
    description?: string|null
    url?: string|null
    email?: string|null
    twitter?: string|null
    discord?: string|null
    github?: string|null
    profileUpdatedAtBlock: bigint
}