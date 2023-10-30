
import summonerInterface from "./interfaces/summonerInterface";

async function fetchPatchVersion(){
    try{
        const fetchPatchData = async () => {
            const res = await fetch("https://ddragon.leagueoflegends.com/api/versions.json",{
                cache: "no-store"
            });
            const patchesList = await res.json()
            // setPatchVersion(patchesList[0])
            return patchesList[0]
        }
        
        return fetchPatchData()
    }catch(err){
        console.log("Error: ",err)
        return null
    } 
}

async function fetchSummonerSpells(){
    try{
        const patchVer = await fetchPatchVersion();
        const res = await fetch("https://ddragon.leagueoflegends.com/cdn/" + patchVer + "/data/en_US/summoner.json")
        const spells = await res.json();

        
        const spellsMap = new Map<number, string>();

        Object.entries(spells["data"]).map(([key, val]) => {
            spellsMap.set(parseInt(val["key"]) , key)
        })
        
        // console.log(spellsMap)
        return spellsMap;
    }catch(err){
        console.log("Error: ",err)
        return null
    }
}

async function fetchSummonerRanks(summonerId: string){
    const URL_FETCH = "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + summonerId + "?api_key=" + process.env.API_KEY
    try{
        const res = await fetch(URL_FETCH)
        const dataReceived = await res.json()
        return dataReceived
    }catch(err){
        console.log("Error trying to fetch summoner ID ", summonerId,": ", err)
        return {}
    }
}

async function fetchSummonerData(summonerName: string){
    const URL_FETCH = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName + "?api_key=" + process.env.API_KEY;
    try{
        const res = await fetch(URL_FETCH)
        const dataReceived: summonerInterface = await res.json()
        const matchesData = await fetchSummonerMatches(dataReceived.puuid, 1)

        return {
            'summonerProfileData': dataReceived,
            'summonerMatchesData': matchesData
        }
    }catch(err){
        console.log("Error from onSubmitInput: ", err)
        return {}
    }
}

async function fetchSummonerMatches(summonerPuuid: string, numOfMatches: number){
    const URL_FETCH = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + summonerPuuid + "/ids?start=0&count=" + numOfMatches + "&api_key=" + process.env.API_KEY

    try{
        const res = await fetch(URL_FETCH)
        const dataReceived = await res.json()
        // setSummonerMatches(dataReceived)

        return dataReceived
    }catch(err){
        console.log("Error from fetchSummonerMatches: ", err)
        return null
    }
}

// export const SummonerSpellsMap = await fetchSummonerSpells()
export { fetchPatchVersion, fetchSummonerData, fetchSummonerSpells, fetchSummonerRanks}