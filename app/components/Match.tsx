"use client";
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import matchInterface from '../interfaces/matchInterface'
import summonerInterface from '../interfaces/summonerInterface';
import { Card, CardContent, CardMedia, CardHeader} from '@mui/material';
import { useRouter } from "next/navigation";

import matchStyles from '../css/match.module.css'
import { Collapse, IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function Match({matchId , patchVersion, currentPuuid}: matchInterface){
    const [returnData, setReturnData] = useState<Array<summonerInterface>>([])
    const [championList, setChampionList] = useState<Array<string>>([])
    const [matchData, setMatchData] = useState({})
    const [completedDataRetrieval, setCompletedDataRetrieval] = useState(false)

    const [open, setOpen] = useState(false)
    const [summonerToChampMap, setSummonerToChampMap] = useState<Map<string, string>>(new Map<string, string>)
    const [summonerToPuuidMap, setSummonerToPuuidMap] = useState<Map<string, string>>(new Map<string, string>)
    const [winLossMap, setWinLossMap] = useState<Map<string, Array<Object>>>(new Map<string, Array<Object>>)
    const [currSummonerChamp, setCurrSummonerChamp] = useState<string>()
    const [summNameToIndexMap, setSummNameToIndexMap] = useState<Map<string, number>>(new Map<string, number>) //This is to keep track of which summoner is based on
                                                                                                               //their index in the returned Data

    const [currSummMatchWon, setCurrSummMatchWon] = useState<boolean>()
    const router = useRouter();

    const fetchData = async () => {
        winLossMap.set('win', [])
        winLossMap.set('loss', [])
        const URL_FETCH = "https://americas.api.riotgames.com/lol/match/v5/matches/" + matchId + "?api_key=" + process.env.API_KEY;
        const res = await fetch(URL_FETCH);
        const getMatchData = await res.json();
        setMatchData(getMatchData)
        // const participants: Map<string, string> = getMatchData.metadata.participants;
        const numOfParticipants: number = getMatchData.metadata.participants.length;


        // let returnDataList: Array<summonerInterface> = []
        // let addChampList: Array<string> = []

        for(let i = 0; i < numOfParticipants; i++){
            // const playerFetch = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/" + participants[i] + "?api_key=" + process.env.API_KEY;
            // const res = await fetch(playerFetch)
            // const userData: summonerInterface = await res.json();
            // addChampList.push(getMatchData.info.participants[i].championName)
            // returnDataList.push(userData)
            const currParticipant = getMatchData.info.participants[i]
            if(currParticipant.puuid === currentPuuid){
                setCurrSummonerChamp(currParticipant.championName)
                setCurrSummMatchWon(currParticipant.win === true ? true : false)
            }
            summNameToIndexMap.set(currParticipant.summonerName , i)
            
            if(currParticipant.win === true){
                winLossMap.get('win').push(currParticipant)
            }else if(currParticipant.win === false){
                winLossMap.get('loss').push(currParticipant)
            }

            summonerToChampMap.set(currParticipant.summonerName,  currParticipant.championName)
            summonerToPuuidMap.set(currParticipant.summonerName, currParticipant.puuid)
        }

        // setReturnData(returnDataList)
        // setChampionList(addChampList)
        
    }

    const processTableContent = () => {
        let returnList = []
        console.log(winLossMap)
        
        // Header
        returnList.push((
            <Card className={`${matchStyles['card-header']}`}>
                <CardContent className={`${matchStyles['card-content']} text-white`}>
                    <div className={`${matchStyles['champ-photo']}`}>
                        <p>Victory Team</p>
                    </div>

                    <div className={`${matchStyles['summoner-name']}`}>
                    </div>

                    <div className={`${matchStyles['kda']}`}>
                        <p>KDA</p>
                    </div>

                    <div className={`${matchStyles['dmg-dealt']}`}>
                        <p>Damage</p>
                    </div>

                    <div className={`${matchStyles['dmg-bar']}`}>
                        <p>Damage Bar</p>
                    </div>

                    <div className={`${matchStyles['gold-earned']}`}>
                        <p>Gold</p>
                    </div>

                    <div className={`${matchStyles['cs']}`}>
                        <p>CS</p>
                    </div>

                    <div className={`${matchStyles['wards-placed']}`}>
                        <p>Wards</p>
                    </div>
                </CardContent>
            </Card>
        ))

        winLossMap.get('win').forEach((participant) => {
            returnList.push((
                <Card variant="outlined" className={`${matchStyles['card']} 
                                                    ${participant.win === true ? matchStyles['victorious'] : matchStyles['defeated']}`}>

                    <CardContent className={`${matchStyles['card-content']} text-white`}> 
                        <div className={`${matchStyles['champ-photo']}`}>
                            <CardMedia
                                component="img"
                                image={`http://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${participant.championName}.png`}
                                sx={{ width: '2em', height: '2em' }}
                                alt="Champion Picture"
                            />
                        </div>
                        
                        <div className={`${matchStyles['summoner-name']}`}>
                            <a 
                                className="font-bold truncate cursor-pointer hover:underline"
                                onClick={() => router.push(`/summoners/${participant.summonerName}`)}>
                                {participant.summonerName}
                            </a>
                        </div>
                        
                        <div className={`${matchStyles['kda']}`}>
                            <p>{participant.kills + "/" + 
                                participant.deaths + "/" + 
                                participant.assists}</p>
                        </div>
                        
                        <div className={`${matchStyles['dmg-dealt']}`}>
                            <p>{participant.totalDamageDealtToChampions}</p>
                        </div>
                        

                        <div className={`${matchStyles['dmg-bar']}`}>
                            <div className={`${matchStyles['top-bar']}`}></div>
                            <div className={`${matchStyles['total-bar']}`}></div>
                        </div>

                        <div className={`${matchStyles['gold-earned']}`}>
                            <p>{participant.goldEarned}</p>
                        </div>
                        
                        <div className={`${matchStyles['cs']}`}>
                            <p>{participant.totalMinionsKilled + participant.totalEnemyJungleMinionsKilled}</p>
                        </div>
                        
                        <div className={`${matchStyles['wards-placed']}`}>
                            <p>{participant.wardsPlaced}</p>
                        </div> 
                    </CardContent>
                </Card>
            ))
        })

        // Header
        returnList.push((
            <Card className={`${matchStyles['card-header']}`}>
                <CardContent className={`${matchStyles['card-content']} text-white`}>
                    <div className={`${matchStyles['champ-photo']}`}>
                        <p>Defeat Team</p>
                    </div>

                    <div className={`${matchStyles['summoner-name']}`}>
                    </div>

                    <div className={`${matchStyles['kda']}`}>
                        <p>KDA</p>
                    </div>

                    <div className={`${matchStyles['dmg-dealt']}`}>
                        <p>Damage</p>
                    </div>

                    <div className={`${matchStyles['dmg-bar']}`}>
                        <p>Damage Bar</p>
                    </div>

                    <div className={`${matchStyles['gold-earned']}`}>
                        <p>Gold</p>
                    </div>

                    <div className={`${matchStyles['cs']}`}>
                        <p>CS</p>
                    </div>

                    <div className={`${matchStyles['wards-placed']}`}>
                        <p>Wards</p>
                    </div>
                </CardContent>
            </Card>
        ))

        winLossMap.get('loss').forEach((participant) => {
            returnList.push((
                <Card variant="outlined" className={`${matchStyles['card']} 
                                                    ${participant.win === true ? matchStyles['victorious'] : matchStyles['defeated']}`}>

                    <CardContent className={`${matchStyles['card-content']} text-white`}> 
                        <div className={`${matchStyles['champ-photo']}`}>
                            <CardMedia
                                component="img"
                                image={`http://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${participant.championName}.png`}
                                sx={{ width: '2em', height: '2em' }}
                                alt="Champion Picture"
                            />
                        </div>
                        
                        <div className={`${matchStyles['summoner-name']}`}>
                            <a 
                                className="font-bold truncate cursor-pointer hover:underline"
                                onClick={() => router.push(`/summoners/${participant.summonerName}`)}>
                                {participant.summonerName}
                            </a>
                        </div>
                        
                        <div className={`${matchStyles['kda']}`}>
                            <p>{participant.kills + "/" + 
                                participant.deaths + "/" + 
                                participant.assists}</p>
                        </div>
                        
                        <div className={`${matchStyles['dmg-dealt']}`}>
                            <p>{participant.totalDamageDealtToChampions}</p>
                        </div>
                        

                        <div className={`${matchStyles['dmg-bar']}`}>
                            <div className={`${matchStyles['top-bar']}`}></div>
                            <div className={`${matchStyles['total-bar']}`}></div>
                        </div>

                        <div className={`${matchStyles['gold-earned']}`}>
                            <p>{participant.goldEarned}</p>
                        </div>
                        
                        <div className={`${matchStyles['cs']}`}>
                            <p>{participant.totalMinionsKilled + participant.totalEnemyJungleMinionsKilled}</p>
                        </div>
                        
                        <div className={`${matchStyles['wards-placed']}`}>
                            <p>{participant.wardsPlaced}</p>
                        </div> 
                    </CardContent>
                </Card>
            ))
        })

        return returnList
    }

    useEffect(() => {
        fetchData()
            .then(() => {
                setCompletedDataRetrieval(true)
            })
            .catch((err) => console.log(err))
    },[])
    
    return(
        // <Stack spacing={0} className={`${matchStyles['card-stack']}`}>
        <Card variant="outlined" className={`${matchStyles['overall-card']}`}> 
            {/* Unexpanded Card */}
            <Card
                sx={{
                    color: "white",
                }}
                className={`${matchStyles['card']} w-1/2 ${currSummMatchWon === true ? matchStyles['victorious'] : matchStyles['defeated'] }`}
            >
                <CardContent className={`${matchStyles['card-content']}`}>
                    <p>Your champion played</p>
                    <CardMedia
                        component="img"
                        image={`http://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${currSummonerChamp}.png`}
                        sx={{ width: '2em', height: '2em' }}
                        alt="Champion Picture"
                    />

                    <p>{currSummonerChamp}</p>

                    <IconButton
                        onClick={() => setOpen(!open)}
                        size="small"
                    >
                        {open ? <KeyboardArrowUpIcon className="text-white"/> : <KeyboardArrowDownIcon className="text-white"/>}
                    </IconButton>
                </CardContent>
            </Card>

            {/* Expanded Card Content */}
            <Collapse in={open} className={`${matchStyles['card-stack']}`}>
                <CardContent>
                    {
                        completedDataRetrieval && processTableContent()
                    }
                </CardContent>
            </Collapse>
        </Card>
    )

}