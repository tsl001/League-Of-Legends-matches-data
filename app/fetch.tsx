
import summonerInterface from "./interfaces/summonerInterface";

async function fetchPatchVersion(){
    try{
        const fetchPatchData = async () => {
            const res = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
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

async function fetchSummonerData(summonerName: string){
    const URL_FETCH = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName + "?api_key=" + process.env.API_KEY;
    try{
        const res = await fetch(URL_FETCH)
        const dataReceived: summonerInterface = await res.json()
        // setSummonerData(dataReceived)
        // fetchSummonerMatches(dataReceived.puuid, 1)
        const matchesData = await fetchSummonerMatches(dataReceived.puuid, 20)

        return {
            'summonerProfileData': dataReceived,
            'summonerMatchesData': matchesData
        }
    }catch(err){
        // setSummonerData({})
        // setSummonerMatches([])
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

export { fetchPatchVersion, fetchSummonerData }