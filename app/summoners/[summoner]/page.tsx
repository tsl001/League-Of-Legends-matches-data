import { fetchPatchVersion, fetchSummonerData, fetchSummonerRanks} from '../../fetch'
import Image from 'next/image';
import Match from '@/app/components/Match';
import Fade from '@mui/material/Fade';


function returnRankedType(queueType: string){
    if(queueType === "RANKED_SOLO_5x5"){
        return "Ranked Solo/Duo"
    }

    if(queueType === "RANKED_FLEX_SR"){
        return "Ranked Flex"
    }


    return "N/A"
}


export default async function Summoner({ params }){
    const currentPatchVersion = await fetchPatchVersion();
    const summonerData = await fetchSummonerData(params.summoner);
    const summonerRanks = await fetchSummonerRanks(summonerData.summonerProfileData["id"]);

    return (
        <>
            <p className="font-bold flex justify-center">Summoner Name: {summonerData.summonerProfileData["name"]}</p>
            <p className="font-bold flex justify-center">Summoner Level: {summonerData.summonerProfileData["summonerLevel"]}</p>
            
            <div className="flex justify-center">
                <Image
                    src={"http://ddragon.leagueoflegends.com/cdn/" + currentPatchVersion + "/img/profileicon/" + summonerData.summonerProfileData["profileIconId"] + ".png"}
                    width={0}
                    height={0}
                    sizes='100%'
                    style={{ width: '8vw', height: 'auto' }}
                    alt="Summoner Profile Picture"
                />

                {
                    summonerRanks.map((rankData) => {
                        return(
                            <div className="flex flex-col">
                                <p className="font-bold p-4">{returnRankedType(rankData.queueType)}</p>
                                <Image
                                    src={`/${rankData.tier}.png`}
                                    width={100}
                                    height={100}
                                    alt="Summoner Rank"
                                />
                                <p className="font-bold">{rankData.tier + " " + rankData.rank}</p>
                                <p className="font-bold">{"Wins: " + rankData["wins"]}</p>
                                <p className="font-bold">{"Losses: " + rankData["losses"]}</p>
                                <p className="font-bold">{
                                    ((parseInt(rankData["wins"]) / (parseInt(rankData["wins"]) + parseInt(rankData["losses"]))) * 100).toFixed(2) + 
                                    "% winrate"}</p>
                            </div>
                        )
                    })
                }

            </div>
            
            
            {summonerData.summonerMatchesData.map((m) => {
                return (
                    <Match matchId={m} patchVersion={currentPatchVersion} currentPuuid={summonerData.summonerProfileData["puuid"]}/>
                )
            })}
        </>
    )
}