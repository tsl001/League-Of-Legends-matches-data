"use client";
import { useEffect, useState } from 'react';
import matchInterface from '../interfaces/matchInterface'
import summonerInterface from '../interfaces/summonerInterface';
import { Card, CardContent, CardMedia, CardHeader} from '@mui/material';
import { useRouter } from "next/navigation";
import LinearProgress from '@mui/material/LinearProgress';
import matchStyles from '../css/match.module.css'
import { Collapse, IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { fetchSummonerSpells, fetchSummonerRanks } from '../fetch';
import Image from 'next/image';

const styles = {
    'participant-spells': {
        width: '2rem', 
        height: '2rem',
        overflow: 'visible'
    },
    'card-header': {
        color: 'white',
        width: '60rem', 
        height: '5rem',
        border: '1px solid white'
    },
    'match-card': {
        width: '62rem',
        color: 'white',
        border: '1px solid',
    }
};


function HeaderRow(victor: boolean) {
    var matchResult = null;
    if(victor.victor == true){
        matchResult = "Victorious"
    }else if(victor.victor == false){
        matchResult = "Defeated"
    }

    return (
        <Card sx={styles['card-header']} className={`${matchResult === "Victorious" ? matchStyles['victorious'] : matchStyles['defeated']}`}>
                <CardContent className={`${matchStyles['card-content']} text-white`}>
                    <div className={`${matchStyles['champ-photo']}`}>
                        <p>{matchResult} Team</p>
                    </div>

                    <div className={`${matchStyles['summoner-name']}`}>
                        <p>Summoner Name</p>
                    </div>

                    <div className={`${matchStyles['kda']}`}>
                        <p>KDA</p>
                    </div>

                    <div className={`${matchStyles['dmg-dealt']}`}>
                        <p>Damage</p>
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

                    <div className={`${matchStyles['items']}`}>
                        <p>Items</p>
                    </div>
                </CardContent>
            </Card>
    )
}

function ParticipantContent({participant, router, patchVersion, highestDmg, mostGold, SummonerSpellsMap}) {
    let itemsId = []
            
    for(let i = 0; i < 7; i++){
        itemsId.push(participant[`item${i}`])
    }

    return(
        <Card variant="outlined" className={`${matchStyles['card']} 
                                                    ${participant.win === true ? matchStyles['victorious'] : matchStyles['defeated']}`}>

                    <CardContent className={`${matchStyles['card-content']} text-white`}> 
                        <div className={`${matchStyles['champ-photo']}`}>
                            <CardMedia
                                component="img"
                                image={`http://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${participant["championName"]}.png`}
                                sx={{ width: 'auto', height: '3rem' }}
                                alt="Champion Picture"
                            />

                            <ImageList
                                sx={styles['participant-spells']} 
                                cols={1}>
                                <ImageListItem>
                                    <img
                                        src={`http://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${SummonerSpellsMap.get(participant["summoner1Id"])}.png`}
                                    />
                                </ImageListItem>
                                <ImageListItem>
                                    <img
                                        src={`http://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${SummonerSpellsMap.get(participant["summoner2Id"])}.png`}
                                    />
                                </ImageListItem>
                            </ImageList>
                        </div>
                        
                        
                        <div className={`${matchStyles['summoner-name']}`}>
                            <a 
                                className="font-bold truncate cursor-pointer hover:underline"
                                onClick={() => router.push(`/summoners/${participant["summonerName"]}`)}>
                                {participant["summonerName"]}
                            </a>
                               
                            <ParticipantRank rankTier={participant["rankTier"]} rankNum={participant["rankNum"]}/>
                        </div>
                        
                        <div className={`${matchStyles['kda']}`}>
                            <p>{participant.kills + "/" + 
                                participant.deaths + "/" + 
                                participant.assists}</p>
                        </div>
                        
                        <div className={`${matchStyles['dmg-dealt']}`}>
                            <p>{participant["totalDamageDealtToChampions"].toLocaleString()}</p>
                            <LinearProgress 
                                variant="determinate"
                                value={(participant["totalDamageDealtToChampions"] / highestDmg) * 100}
                                style={{width: "100%"}}    
                            />
                        </div>

                        <div className={`${matchStyles['gold-earned']}`}>
                            <p>{participant["goldEarned"].toLocaleString()}</p>
                            <LinearProgress 
                                variant="determinate"
                                value={(participant["goldEarned"] / mostGold) * 100}
                                style={{width: "100%"}}    
                            />
                        </div>
                        
                        <div className={`${matchStyles['cs']}`}>
                            <p>{participant.totalMinionsKilled + participant.totalEnemyJungleMinionsKilled}</p>
                        </div>
                        
                        <div className={`${matchStyles['wards-placed']}`}>
                            <p>{participant.wardsPlaced}</p>
                        </div> 

                        <div className={`${matchStyles['items']}`}>
                            <ImageList cols={3}>
                                {
                                    itemsId.slice(0,6).map((itemId) => {
                                        return(
                                            <ImageListItem>
                                                <img
                                                    src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/item/${itemId}.png`}
                                                />
                                            </ImageListItem>
                                        )
                                    })
                                }
                            </ImageList>
                        </div>
                    </CardContent>
                </Card>
    );
}

function ParticipantRank({rankTier, rankNum}){
    if(rankTier !== "Unranked"){
        return (
            <div className="flex flex-row">
                <Image
                    src={`/${rankTier}.png`}
                    width={0}
                    height={0}
                    sizes='100%'
                    style={{ width: '3rem', height: 'auto' }}
                    alt="Summoner Rank Tier"
                />
                <p>{rankTier + ' ' + rankNum}</p>
            </div> 
        )
    }else{
        return(
            <div className="flex flex-row">
                <p>{'Unranked'}</p>
            </div>
        ) 
    }      
}


export default function Match({matchId , patchVersion, currentPuuid}: matchInterface){
    // const [returnData, setReturnData] = useState<Array<summonerInterface>>([])
    // const [championList, setChampionList] = useState<Array<string>>([])
    const [matchData, setMatchData] = useState({})
    const [completedDataRetrieval, setCompletedDataRetrieval] = useState(false)

    const [open, setOpen] = useState(false)
    const [winLossMap, setWinLossMap] = useState<Map<string, Array<Object>>>(new Map<string, Array<Object>>)
    const [currSummonerChamp, setCurrSummonerChamp] = useState<string>()
    const [highestDmg, setHighestDmg] = useState<number>(0)
    const [mostGold, setMostGold] = useState<number>(0)
    const [currSummMatchWon, setCurrSummMatchWon] = useState<boolean>()
    const router = useRouter();
    const [SummonerSpellsMap, setSummonerSpellsMap] = useState<Map<number, string>>();

    const fetchData = async () => {
        winLossMap.set('win', [])
        winLossMap.set('loss', [])
        const URL_FETCH = "https://americas.api.riotgames.com/lol/match/v5/matches/" + matchId + "?api_key=" + process.env.API_KEY;
        const res = await fetch(URL_FETCH);
        const getMatchData = await res.json();
        const setSpellsMap = await fetchSummonerSpells();
        setMatchData(getMatchData)
        setSummonerSpellsMap(setSpellsMap)
        const numOfParticipants: number = getMatchData.metadata.participants.length;
        let currHighestDmg = 0;
        let currMostGold = 0;
        
        for(let i = 0; i < numOfParticipants; i++){
           
            let currParticipant = getMatchData.info.participants[i]
            
            if(currParticipant["championName"] === "FiddleSticks"){
                currParticipant["championName"] = "Fiddlesticks"
            }


            if(currParticipant["puuid"] === currentPuuid){
                setCurrSummonerChamp(currParticipant["championName"])
                setCurrSummMatchWon(currParticipant["win"] === true ? true : false)
            }

            const participantRanks = await fetchSummonerRanks(currParticipant["summonerId"])
            
            const rankedSoloObj = participantRanks.find((rankObj) => {
                return rankObj["queueType"] === "RANKED_SOLO_5x5"
            })

            if(rankedSoloObj !== undefined){
                currParticipant["rankTier"] = rankedSoloObj["tier"]
                currParticipant["rankNum"] = rankedSoloObj["rank"]
            }else{
                currParticipant["rankTier"] = "Unranked"
                currParticipant["rankNum"] = ""
            }

            if(currParticipant["win"] === true){
                winLossMap.get('win').push(currParticipant)
            }else if(currParticipant.win === false){
                winLossMap.get('loss').push(currParticipant)
            }

            if(currParticipant["totalDamageDealtToChampions"] > currHighestDmg){
                currHighestDmg = currParticipant["totalDamageDealtToChampions"];
            }

            if(currParticipant["goldEarned"] > currMostGold){
                currMostGold = currParticipant["goldEarned"];
            }
        }
        
        setHighestDmg(currHighestDmg)
        setMostGold(currMostGold)
    }

    const processTableContent = () => {
        let returnList = []

        // Header
        returnList.push((
            <HeaderRow victor={true}/>
        ))
         
        for(const participant of winLossMap.get('win')){
            returnList.push((
                <ParticipantContent 
                    participant={participant}
                    router={router}
                    patchVersion={patchVersion}
                    highestDmg={highestDmg}
                    mostGold={mostGold}
                    SummonerSpellsMap={SummonerSpellsMap}
                />
            ))
        }

        // Header
        returnList.push((
            <HeaderRow victor={false}/>
        ))

        for(const participant of winLossMap.get('loss')){
            returnList.push((
                <ParticipantContent 
                    participant={participant}
                    router={router}
                    patchVersion={patchVersion}
                    highestDmg={highestDmg}
                    mostGold={mostGold}
                    SummonerSpellsMap={SummonerSpellsMap}
                />
            ))
        }

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
                sx={styles['match-card']}
                className={`${currSummMatchWon === true ? matchStyles['victorious'] : matchStyles['defeated'] }`}
            >
                <CardContent className={`${matchStyles['card-content']}`}>
                    <p>Champion played</p>
                    <CardMedia
                        component="img"
                        image={`http://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${currSummonerChamp}.png`}
                        sx={{ width: '2rem', height: '2rem' }}
                        alt="Champion Picture"
                    />

                    <p>{currSummonerChamp}</p>

                    <p></p>

                    <IconButton
                        onClick={() => setOpen(!open)}
                        size="small"
                    >
                        {open ? <KeyboardArrowUpIcon className="text-white"/> : <KeyboardArrowDownIcon className="text-white"/>}
                    </IconButton>
                </CardContent>
            </Card>

            {/* Expanded Card Content */}
            <Collapse in={open}>
                <Card className={`${matchStyles['card-stack']}`}>
                    <CardContent>
                        {
                            completedDataRetrieval && processTableContent()
                        }
                    </CardContent>
                </Card>   
            </Collapse>
        </Card>
    )

}