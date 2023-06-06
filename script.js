const mine = `<img class='' id='mine' src='https://www.giantbomb.com/a/uploads/scale_medium/8/87790/3216800-icon_mine.png' height='70vmin'>`
// const flag = `<img id='number' src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Minesweeper_flag.svg/2048px-Minesweeper_flag.svg.png' height='70vmin'>`
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
let clickedSquareIndexes;
let bombLocations;
let state;
let choiceOfItem;
let firstClickLocation;
let firstMineLocation;
let copyOfClicked;

///Cached elements
const reset = document.getElementById('reset')
const boardLayout = document.getElementById('boardLayout')
const message = document.querySelector('h2')
const boxStyle = document.querySelector('.box')
const choiceShovelDiv = document.getElementById('choiceShovel')
const choiceFlagDiv = document.getElementById('choiceFlag')

//// Event listeners
reset.addEventListener('click', init)
boardLayout.addEventListener('click', handleClickChoice)
choiceShovelDiv.addEventListener('click', handleShovelClick)
choiceFlagDiv.addEventListener('click', handleFlagClick)


    
////////FUNCTIONS


init()

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
message.innerText = 'Avoid digging the hidden mines!'
clickedSquareIndexes = [];
copyOfClicked = undefined;
choiceOfItem = 'shovel';
firstClickLocation = [];
render()
}

function render(){
    renderBoard()
}


function renderBoard(){
    handleBombLocations()

    for(let i = 0; i <= board.flat().length - 1; i++){
       
      let boardLocations = document.querySelector(`#boardLayout :nth-child(${i + 1})`)
        boardLocations.innerHTML = PICTURES[board.flat()[i]]
    }
}


function renderItemIcon(){
    choiceFlagDiv.classList.remove('notChoice')
    choiceFlagDiv.classList.remove('currentChoice')
    choiceShovelDiv.classList.remove('notChoice')
    choiceShovelDiv.classList.remove('currentChoice')
    if(choiceOfItem === 'shovel'){
        choiceFlagDiv.classList.add('notChoice')
        choiceShovelDiv.classList.add('currentChoice')
    } else if (choiceOfItem === 'flag'){
        choiceShovelDiv.classList.add('notChoice')
        choiceFlagDiv.classList.add('currentChoice')
    }

}


function handleClickChoice(e){
    if(choiceOfItem === 'shovel'){
         handleClickShovel(e) 
    } else if(choiceOfItem === 'flag') { 
        handleClickFlag(e)
    }
}



function handleClickShovel(e){
    let choiceId = e.target
    if(state === 'loss' || state === 'winner') return
    if(choiceId.src === 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Minesweeper_flag.svg/2048px-Minesweeper_flag.svg.png') return
    if(choiceOfItem === 'flag') return
    /// If a bomb is chosen on the first turn, the board is rerendered and then the target is changed to match the target of that current location now
    if(choiceId.id === 'mine' && firstClickLocation.length < 1){
        firstMineLocation = choiceId.parentNode.id
        render()
        console.log(firstMineLocation, 'firstMineLocation')
        choiceId = document.getElementById(firstMineLocation)
        console.log(choiceId, 'choiceID')
    }
    firstClickLocation = choiceId.parentNode.id
    choiceId.classList.remove('hidden');
    choiceId.style.backgroundColor = 'lightgrey';
    
    //// If a shovel hits a mine
    if(choiceId.id === 'mine'){
        state = 'loss'
        handleMessage()
    }

    /// If a shovel hits a blank space
    // When clicked the second time, after a bomb hit. You can have a div with a 'numberTwo' or any number class. In this case, the number value has to be added
    // to that div's innerText, ALSO handleNULL cannot be called because it will cause random null spaces to be linked to this numbered div to 'flood'
   if(choiceId.tagName === 'DIV' && choiceId.classList[1] !== undefined){
        choiceId.innerText = board.flat()[firstMineLocation - 1]
    } else if(choiceId.tagName === 'DIV'){
        handleNULL(choiceId)
        if(clickedSquareIndexes.indexOf(Number(choiceId.id)) < 0){
            clickedSquareIndexes.push(Number(choiceId.id))
        }
        
    } 

    /// If a shovel hits a number space
    if(choiceId.tagName === 'P'){
        choiceId.style.backgroundColor = 'lightgrey';
        console.log(clickedSquareIndexes.length, 'clickedSquareIndexes', Number(choiceId.parentNode.id), 'checkHere')
        if(clickedSquareIndexes.indexOf(Number(choiceId.parentNode.id)) < 0){
            clickedSquareIndexes.push(Number(choiceId.parentNode.id))
        }
    }
    /// If the clicked space results in the 20 nonmine spaces being clicked
    if(clickedSquareIndexes.length === 20) {
        state = 'winner'
        handleWin()
    }
    }


function handleClickFlag(e){
    if(state === 'loss' || state === 'winner') return
    if(choiceOfItem === 'shovel') return
    /// Handles unclick of flag
    if(e.target.src === 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Minesweeper_flag.svg/2048px-Minesweeper_flag.svg.png'){
        if(e.target.id === 'mine'){
            e.target.src = 'https://www.giantbomb.com/a/uploads/scale_medium/8/87790/3216800-icon_mine.png'
            e.target.classList.add('hidden')
            return
        } else if (e.target.id === 'number') {
                // attaches to the parentNode (e.target's classList which stores the old value for that square (ex: 2), PICTURES uses that value to replace the lost html)
            e.target.parentNode.innerHTML = PICTURES[e.target.classList[0]]
            return
        } else if (e.target.classList[0] === 'box'){
            e.target.parentNode.innerHTML =  `<div id=${e.target.id} class="box" style='background-color:gray;'></div>`
            return
        }
}

/// Handles first click
if(e.target.style.backgroundColor === 'lightgrey') return //// if it has already been clicked before
        /// if first click on img
    e.target.classList.remove('hidden');
    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Minesweeper_flag.svg/2048px-Minesweeper_flag.svg.png'
        /// if first click on number and then first click on blank space
    if(e.target.tagName === 'P'){
        e.target.parentNode.innerHTML = `<img id='number' class='${e.target.innerText}'src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Minesweeper_flag.svg/2048px-Minesweeper_flag.svg.png' height='70vmin'>`
    } else if (e.target.tagName === 'DIV' && e.target.style.backgroundColor === 'gray'){
        e.target.innerHTML = `<img id='${e.target.id}' class='${e.target.classList[0]}'src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Minesweeper_flag.svg/2048px-Minesweeper_flag.svg.png' >`
    }
    }


function handleLoss(){
message.innerText = 'You Lose!'
/// Reveals bombs after loss
document.querySelectorAll('.hidden').forEach(e => e.classList.remove('hidden'))
}


function handleWin(){
message.innerText = 'You win!'
}



function handleMessage(){
    if(state === 'playing') return
    if(state === 'winner') handleWin()
    if(state === 'loss') handleLoss()
}

/// Changes item to shovel and renders box around it
function handleShovelClick(){
choiceOfItem = 'shovel'
renderItemIcon()
}
/// Changes item to flag and renders box around it
function handleFlagClick(){
choiceOfItem = 'flag'
renderItemIcon()
}


function getBombLocations(){
bombLocations = []
    while(bombLocations.length < 5){
        let rando = Math.floor(Math.random() * 25)
    if(!bombLocations.includes(rando) && rando !== firstMineLocation - 1){
        bombLocations.push(rando)
    }
}
}


function handleNULL(e) {
    console.log(copyOfClicked)
    console.log('CURRENT IDX', e, Number(e.id))
    let newBoard = board.flat()
    // console.log(e, 'HANDLENULL', newBoard)
    let idx = Number(e.id) ? Number(e.id) : e
    console.log(idx, e, 'what is dis')
    // console.log(e, idx, newBoard[idx], 'WHERE DID I CLICK')



//Left fill
for(let i = 1; i < newBoard.length; i++){
// let edgeNums = [21, 16, 11, 6, 1]
// let edgeNums = [25, 20, 15, 10]
let edgeNums = [-1]
// console.log((idx - i) + 1, (idx - i), idx, edgeNums.indexOf(idx - i), edgeNums.indexOf(idx + 1) > -1, 'What im looking at')
    if(newBoard[idx - i] !== null || edgeNums.indexOf(idx - i + 1) > -1 || idx - 1 < 0){
    break;
    } else {
        document.getElementById(`${idx - i + 1}`).style.backgroundColor = 'lightgrey'
        if(clickedSquareIndexes.indexOf(Number(idx - i + 1)) < 0){
        clickedSquareIndexes.push(Number(idx - i + 1))
        console.log(clickedSquareIndexes, 'leftfill')
        }
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
        console.log(idx + i + 1, idx + 1, 'indexds')
        if(clickedSquareIndexes.indexOf(idx + i + 1) < 0){
            clickedSquareIndexes.push(Number(idx + i + 1))
            console.log(clickedSquareIndexes, 'rightfill')
            }
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
        if(clickedSquareIndexes.indexOf(Number(idx - (5 * i))) < 0){
            clickedSquareIndexes.push(Number(idx - (5 * i)))
            console.log(clickedSquareIndexes, 'clickedSquareIndexes')
            }
        console.log(clickedSquareIndexes, 'topfill')
    }

}

//Top Right fill
for(let i = 1; i < 5; i++){
let edgeNums = [25, 20, 15, 10, 5]
    if(newBoard[idx - (5 * i)] !== null  || edgeNums.indexOf(idx) > -1){
    break;
    } else if (newBoard[idx - (5 * i)] === null){
        document.getElementById(`${idx - (5 * i) + 1}`).style.backgroundColor = 'lightgrey'
        if(clickedSquareIndexes.indexOf(Number(idx - (5 * i) + 1)) < 0){
            clickedSquareIndexes.push(Number(idx - (5 * i) + 1))
            console.log(clickedSquareIndexes, 'top right dia')
            }
        console.log(clickedSquareIndexes.length, 'clickedSquareIndexes')
    }

}

//Top left fill
for(let i = 1; i < 5; i++){
    
let edgeNums = [21, 16, 11, 6, 1]
console.log(idx, edgeNums.indexOf(idx) > 0)
    if(newBoard[idx - (5 * i) - 2] !== null || edgeNums.indexOf(idx) > -1){
    break;
    } else if (newBoard[idx - (5 * i) - 2] === null){
        document.getElementById(`${idx - (5 * i) - 1}`).style.backgroundColor = 'lightgrey'
        if(clickedSquareIndexes.indexOf(Number(idx - (5 * i) - 1)) < 0){
            clickedSquareIndexes.push(Number(idx - (5 * i) - 1))
            console.log(clickedSquareIndexes, 'top left dia')
            }
    }

}


//Bottom fill
for(let i = 1; i < 5; i++){
    if(newBoard[idx + (5 * i) - 1] !== null){
    break;
    } else if (newBoard[idx + (5 * i) - 1] === null){
        document.getElementById(`${idx + (5 * i)}`).style.backgroundColor = 'lightgrey'
        if(clickedSquareIndexes.indexOf(Number(idx + (5 * i))) < 0){
            clickedSquareIndexes.push(Number(idx + (5 * i)))
            console.log(clickedSquareIndexes, 'bottom fill')
            }

    }
}

//Bottom Left Dia fill
for(let i = 1; i < 5; i++){
    let edgeNums = [21, 16, 11, 6, 1]
    if(newBoard[idx + (5 * i) - 2] !== null || edgeNums.indexOf(idx) > -1){
    break;
    } else if (newBoard[idx + (5 * i) - 2] === null){
        document.getElementById(`${idx + (5 * i) - 1}`).style.backgroundColor = 'lightgrey'
        if(clickedSquareIndexes.indexOf(Number(idx + (5 * i) - 1)) < 0){
            clickedSquareIndexes.push(Number(idx + (5 * i) - 1))
            console.log(clickedSquareIndexes, 'bottom left dia fill')
            }
    }
}

//Bottom Right Dia fill
for(let i = 1; i < 5; i++){
    let edgeNums = [25, 20, 15, 10, 5]
    if(newBoard[idx + (5 * i)] !== null || edgeNums.indexOf(idx) > -1){
    break;
    } else if (newBoard[idx + (5 * i)] === null){
        document.getElementById(`${idx + (5 * i) + 1}`).style.backgroundColor = 'lightgrey'
        if(clickedSquareIndexes.indexOf(Number(idx + (5 * i) + 1)) < 0){
            clickedSquareIndexes.push(Number(idx + (5 * i) + 1))
            console.log(clickedSquareIndexes, 'bottom right dia')
            }
        console.log(clickedSquareIndexes.length, 'clickedSquareIndexes')
    }
}

if(clickedSquareIndexes.length >= 20) {
    state = 'winner'
    handleWin()
}

console.log(copyOfClicked, 'COPDSYDF')

if(copyOfClicked === undefined){
copyOfClicked = clickedSquareIndexes.slice(0)
handleNULL(copyOfClicked[0])
} else if(copyOfClicked === []){
    return
} else {
    console.log(copyOfClicked, 'COPY OF CLICKED')
    copyOfClicked.shift()
}

if(copyOfClicked.length){
    console.log('works')
    handleNULL(copyOfClicked[0])
    
} else {
    console.log('end IT', 'length')
    return
}


// handleNULL(copyOfClicked[0])


}









function handleBombLocations(){
getBombLocations()

/// board is redeclared here in case of a bomb on first click. Automatically allows a redo on the board organization to avoid 10 bombs
board = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
]

let newBoard = board.flat()
let final = [];
let innerArr = [];

bombLocations.forEach(e => newBoard[e] = 'mine')

while(newBoard.length){
    innerArr.push(newBoard.shift())
    // console.log(innerArr)
    if(innerArr.length === 5){
        final.push(innerArr)
        innerArr = []
    }
}

board = final


for(let i = 0; i< board.length; i++){
    for(let j = 0; j< board.length; j++){

        //// clickedSquareIndexes of Mine
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

     /// Right clickedSquareIndexes Dia
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

    // /// Below Mine clickedSquareIndexes
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
console.log('flattendBoard', board.flat().length, board.flat())
renderNumberColor(board.flat())
}


function renderNumberColor(flattenedBoard){

    /// Clears old classlist
    for(let i = 0; i< flattenedBoard.length; i++){
        if(flattenedBoard[i] || flattenedBoard[i]=== null){
            document.getElementById(i + 1).classList.remove('numberOne')
            document.getElementById(i + 1).classList.remove('numberTwo')
            document.getElementById(i + 1).classList.remove('numberThree')
            document.getElementById(i + 1).classList.remove('numberFour')
            document.getElementById(i + 1).classList.remove('numberFive')
            document.getElementById(i + 1).classList.remove('numberSix')
            document.getElementById(i + 1).classList.remove('numberSeven')
            document.getElementById(i + 1).classList.remove('numberEight')
            
            }
    }
    
    /// Adds color based on numbers
    for(let i = 0; i < flattenedBoard.length; i++){
        if(flattenedBoard[i] === 1){
            document.getElementById(i + 1).classList.add('numberOne')
        }
        if(flattenedBoard[i] === 2){
            document.getElementById(i + 1).classList.add('numberTwo')
        }
        if(flattenedBoard[i] === 3){
            document.getElementById(i + 1).classList.add('numberThree')
        }
        if(flattenedBoard[i] === 4){
            document.getElementById(i + 1).classList.add('numberFour')
        }
        if(flattenedBoard[i] === 5){
            document.getElementById(i + 1).classList.add('numberFive')
        }
        if(flattenedBoard[i] === 6){
            document.getElementById(i + 1).classList.add('numberSix')
        }
        if(flattenedBoard[i] === 7){
            document.getElementById(i + 1).classList.add('numberSeven')
        }
        if(flattenedBoard[i] === 8){
            document.getElementById(i + 1).classList.add('numberEight')
        }

    }

    

}