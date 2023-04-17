/* 
numberDelay = Time between displaying numbers
problemDelay = Time between displaying problems
gracePeriod = Time before score starts to decay
decayPeriod = Time it takes for score to decay to 1000 from 100,000
*/

let GameConfig = {
    "numberDelay": 300,
    "problemDelay": 1500,
    "gracePeriod": 50,
    "decayPeriod": 3000,
    "minScore": 10000,
    "maxScore": 100000
}

export {GameConfig}