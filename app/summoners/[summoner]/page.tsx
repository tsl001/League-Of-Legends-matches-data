import { fetchPatchVersion, fetchSummonerData } from '../../fetch'
import Image from 'next/image';
import Match from '@/app/components/Match'
import Fade from '@mui/material/Fade';

export default async function Summoner({ params }){
    const currentPatchVersion = await fetchPatchVersion()
    const summonerData = await fetchSummonerData(params.summoner)

    
    return (
        <>
            <p className="font-bold flex justify-center">Summoner Name: {summonerData.summonerProfileData.name}</p>
            <p className="font-bold flex justify-center">Summoner Level: {summonerData.summonerProfileData.summonerLevel}</p>
            
            <div className="flex justify-center">
                <Image
                    src={"http://ddragon.leagueoflegends.com/cdn/" + currentPatchVersion + "/img/profileicon/" + summonerData.summonerProfileData.profileIconId + ".png"}
                    width={100}
                    height={100}
                    alt="Summoner Profile Picture"
                />
            </div>
            
            
            {summonerData.summonerMatchesData.map((m) => {
                return (
                    <Match matchId={m} patchVersion={currentPatchVersion} currentPuuid={summonerData.summonerProfileData.puuid}/>
                )
            })}
        </>
    )
}