




const mine = `<img src='https://www.giantbomb.com/a/uploads/scale_medium/8/87790/3216800-icon_mine.png' height='100%'>`


const PICTURES = {
    null: '',
    mine: mine,
    1: `<p>1</p>`,
    2: `<p>2</p>`,
    3: `<p>3</p>`,
}


let board;
let bombLocations;
let val;



init()



function init(){

board = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
]

render()
}




function render(){
    renderBoard()
}





function renderBoard(){
    handleBombLocations()

    for(let i = 0; i <= board.flat().length - 1; i++){
      let val = document.querySelector(`#board :nth-child(${i + 1})`)

        val.innerHTML = PICTURES[board.flat()[i]]
 
    }
}






function getBombLocations(){
bombLocations = []
    while(bombLocations.length < 5){
        let rando = Math.floor(Math.random() * 25)
    if(!bombLocations.includes(rando)){
        bombLocations.push(rando)
    }
}
    console.log(bombLocations.sort((a,b) => a - b), 'bombLocations')
}



function handleBombLocations(){
getBombLocations()

let newBoard = board.flat()
let final = [];
let innerArr = [];

// for(let i =0; i<= bombLocations.length; i++){
//     newBoard[bombLocations[i]] = 'mine'
// }

bombLocations.forEach(e => newBoard[e] = 'mine')

for(let i =0; i< newBoard.length; i++){
if(newBoard[i] === 'mine'){
    if(newBoard[i - 1] !== 'mine'){
        if(newBoard[i - 1] === null){
            newBoard[i - 1] = 1
        } else {
            newBoard[i - 1]++
        }
    }
}
}

console.log(newBoard, 'newBoard')

while(newBoard.length){
    console.log('works')
    innerArr.push(newBoard.shift())
    console.log(innerArr)
    if(innerArr.length === 5){
        final.push(innerArr)
        innerArr = []
    }

}

console.log(final, 'final')
board = final
console.log(board, 'board')

}