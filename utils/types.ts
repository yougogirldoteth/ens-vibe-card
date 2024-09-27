export interface User {
    address: `0x${string}`
    ens?: string|null
    avatar?: string|null
    header?: string|null
    location?: string|null
    description?: string|null
    url?: string|null
    email?: string|null
    twitter?: string|null
    discord?: string|null
    telegram?: string|null
    reddit?: string|null
    linkedin?: string|null
    github?: string|null
    profileUpdatedAtBlock: bigint
}