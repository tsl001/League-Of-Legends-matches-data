/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["ddragon.leagueoflegends.com"],
    },
    env: {
        API_KEY: process.env.API_KEY
    }
}

module.exports = nextConfig
