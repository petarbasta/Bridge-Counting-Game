/* 
numberDelay = Time between displaying numbers
problemDelay = Time between displaying problems
timeForPoints = Point distribution based on time (i.e timeForPoints[0] = time to get 10 points)
Note: anything over timeForPoints[8] will result in 1 point
*/

let config = {
    "numberDelay": 300,
    "problemDelay": 1500,
    "timeForPoints": [100, 300, 500, 750, 1000, 1500, 2000, 2500, 3000]
}

export {config}