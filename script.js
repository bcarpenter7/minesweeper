const mine = `<img class='hidden' src='https://www.giantbomb.com/a/uploads/scale_medium/8/87790/3216800-icon_mine.png' height='100%'>`


const PICTURES = {
    null: '',
    mine: mine,
    1: `<p class='hidden numbers'>1</p>`,
    2: `<p class='hidden numbers'>2</p>`,
    3: `<p class='hidden numbers'>3</p>`,
    4: `<p class='hidden numbers'>4</p>`,
    5: `<p class='hidden numbers'>5</p>`,
    6: `<p class='hidden numbers'>6</p>`,
    7: `<p class='hidden numbers'>7</p>`,
    8: `<p class='hidden numbers'>8</p>`,
}


let board;
let bombLocations;
let val;
let state;
let counter;

///Cached elements
const reset = document.getElementById('reset')
const boardLayout = document.getElementById('boardLayout')
const message = document.querySelector('h2')
const boxStyle = document.querySelector('.box')

//// Event listeners
reset.addEventListener('click', init)
boardLayout.addEventListener('click', handleClick)



function handleLoss(){
message.innerText = 'You Lose!'

}

function handleWin(){
message.innerText = 'You win!'
}


function handleMessage(){
    if(state === 'playing') return
    if(state === 'winner') handleWin()
    if(state === 'loss') handleLoss()
}



function handleClick(e){
if(state === 'loss' || state === 'winner') return
console.log('magicNumber', (counter === board.flat().length - bombLocations.length))
let choiceId = e.target;
console.log(choiceId, 'choiceID')
choiceId.classList.remove('hidden');
counter++
choiceId.style.backgroundColor = 'lightgrey';

if(e.target.tagName === 'IMG'){
    state = 'loss'
    handleMessage()
}

if(counter === board.flat().length - bombLocations.length) {
    state = 'winner'
    handleWin()
}

// if(e.target.classList.contains('.nullConnected'))

if(e.target.tagName === 'DIV'){
    handleNULL(choiceId)
}

console.log(e.target.classList.contains('box'), 'CONTAINS IT')

}



////////FUNCTIONS



function init(){
counter = 0;
board = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
]
state = 'playing'
document.querySelectorAll('.box').forEach(e => e.style.backgroundColor = 'gray')
message.innerText = 'Sweep them mines!'
render()
}

init()



function render(){
    renderBoard()
}





function renderBoard(){
    handleBombLocations()

    for(let i = 0; i <= board.flat().length - 1; i++){
      let val = document.querySelector(`#boardLayout :nth-child(${i + 1})`)

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
}




function handleNULL(e) {
    let newBoard = board.flat()
    console.log(e, 'HANDLENULL', newBoard)
    let idx = Number(e.id);
    console.log(e, idx, newBoard[idx], 'WHERE DID I CLICK')



//Left fill
for(let i = 1; i < newBoard.length; i++){
let edgeNums = [21, 16, 11, 6, 1]
    if(newBoard[idx - i] !== null || edgeNums.indexOf(idx) > -1){
    break;
    } else {
        document.getElementById(`${idx - i + 1}`).style.backgroundColor = 'lightgrey'
    }

}
console.log(e, idx, newBoard[idx], 'WHERE DID I CLICK')

//Right fill
for(let i = 0; i < newBoard.length; i++){
let edgeNums = [25, 20, 15, 10, 5]
    if(newBoard[idx + i] !== null || edgeNums.indexOf(idx) > -1){
    break;
    } else {
        document.getElementById(`${idx + i + 1}`).style.backgroundColor = 'lightgrey'
    }

}


///Have to subtract one everywhere but when getting element because id of elements are not zero indexed whereas the newBoard is
//Top fill  
for(let i = 1; i < 5; i++){
    console.log(idx, newBoard[idx - (5 * i) - 1])
    if(newBoard[idx - (5 * i) - 1] !== null){
    break;
    } else if (newBoard[idx - (5 * i) - 1] === null){
        document.getElementById(`${idx - (5 * i)}`).style.backgroundColor = 'lightgrey'
    }

}

//Top Right fill
for(let i = 1; i < 5; i++){
let edgeNums = [25, 20, 15, 10, 5]
    if(newBoard[idx - (5 * i)] !== null  || edgeNums.indexOf(idx) > -1){
    break;
    } else if (newBoard[idx - (5 * i)] === null){
        document.getElementById(`${idx - (5 * i) + 1}`).style.backgroundColor = 'lightgrey'
    }

}

//Top Left fill
for(let i = 1; i < 5; i++){
    
let edgeNums = [21, 16, 11, 6, 1]
console.log(idx, edgeNums.indexOf(idx) > 0)
    if(newBoard[idx - (5 * i) - 2] !== null || edgeNums.indexOf(idx) > -1){
    break;
    } else if (newBoard[idx - (5 * i) - 2] === null){
        document.getElementById(`${idx - (5 * i) - 1}`).style.backgroundColor = 'lightgrey'
    }

}


//Bottom fill
for(let i = 1; i < 5; i++){
    console.log('TRYING', i)
    if(newBoard[idx + (5 * i) - 1] !== null){
    break;
    } else if (newBoard[idx + (5 * i) - 1] === null){
        document.getElementById(`${idx + (5 * i)}`).style.backgroundColor = 'lightgrey'
    }
}

//Bottom Left Dia fill
for(let i = 1; i < 5; i++){
    let edgeNums = [21, 16, 11, 6, 1]
    console.log('TRYING', i)
    if(newBoard[idx + (5 * i) - 2] !== null || edgeNums.indexOf(idx) > -1){
    break;
    } else if (newBoard[idx + (5 * i) - 2] === null){
        document.getElementById(`${idx + (5 * i) - 1}`).style.backgroundColor = 'lightgrey'
    }
}

//Bottom Right Dia fill
for(let i = 1; i < 5; i++){
    let edgeNums = [25, 20, 15, 10, 5]
    console.log('TRYING', i)
    if(newBoard[idx + (5 * i)] !== null || edgeNums.indexOf(idx) > -1){
    break;
    } else if (newBoard[idx + (5 * i)] === null){
        document.getElementById(`${idx + (5 * i) + 1}`).style.backgroundColor = 'lightgrey'
    }
}



}









function handleBombLocations(){
getBombLocations()

let newBoard = board.flat()
let final = [];
let innerArr = [];

bombLocations.forEach(e => newBoard[e] = 'mine')

while(newBoard.length){
    console.log('works')
    innerArr.push(newBoard.shift())
    console.log(innerArr)
    if(innerArr.length === 5){
        final.push(innerArr)
        innerArr = []
    }
}

board = final


for(let i = 0; i< board.length; i++){
    for(let j = 0; j< board.length; j++){

        //// Left of Mine
    if(board[i][j] === 'mine' && j > 0){
        if(board[i][j - 1] !== 'mine'){
            if(board[i][j - 1] === null){
                board[i][j - 1] = 1
            } else {
                board[i][j - 1]++
            }
        }

    }

        /// Right of Mine
    if(board[i][j] === 'mine' && j < 4){
        if(board[i][j + 1] !== 'mine'){
            if(board[i][j + 1] === null){
                board[i][j + 1] = 1
            } else {
                board[i][j + 1]++
            }
        }

    }

        /// Top of Mine
    if(board[i][j] === 'mine' && i > 0){
            if(board[i - 1][j] !== 'mine'){
                if(board[i - 1][j] === null){
                    board[i - 1][j] = 1
                } else {
                    board[i - 1][j]++
                }
            }
    
    }

    /// Right Top Dia
    if(board[i][j] === 'mine' && i > 0 && j < 4){
        if(board[i - 1][j + 1] !== 'mine'){
            if(board[i - 1][j + 1] === null){
                board[i - 1][j + 1] = 1
            } else {
                board[i - 1][j + 1]++
            }
        }
    }

     /// Right Left Dia
     if(board[i][j] === 'mine' && i > 0 && j > 0){
        if(board[i - 1][j - 1] !== 'mine'){
            if(board[i - 1][j - 1] === null){
                board[i - 1][j - 1] = 1
            } else {
                board[i - 1][j - 1]++
            }
        }
    }

     /// Below Mine
     if(board[i][j] === 'mine' && i < 4){
        if(board[i + 1][j] !== 'mine'){
            if(board[i + 1][j] === null){
                board[i + 1][j] = 1
            } else {
                board[i + 1][j]++
            }
        }

    /// Below Mine Right
    if(board[i][j] === 'mine' && i < 4 && j < 4){
        if(board[i + 1][j + 1] !== 'mine'){
            if(board[i + 1][j + 1] === null){
                board[i + 1][j + 1] = 1
            } else {
                board[i + 1][j + 1]++
            }
        }
    }

    // /// Below Mine Left
    if(board[i][j] === 'mine' && i < 4 && j > 0){
        if(board[i + 1][j - 1] !== 'mine'){
            if(board[i + 1][j - 1] === null){
                board[i + 1][j - 1] = 1
            } else {
                board[i + 1][j - 1]++
            }
        }
    }

    

}
    
  
}
}

}