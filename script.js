




const mine = `<img src='https://www.giantbomb.com/a/uploads/scale_medium/8/87790/3216800-icon_mine.png' height='100%'>`


const PICTURES = {
    null: '',
    mine: mine,
    1: `<p>1</p>`,
    2: `<p>2</p>`,
    3: `<p>3</p>`,
    4: `<p>4</p>`,
    5: `<p>5</p>`,
    6: `<p>6</p>`,
    7: `<p>7</p>`,
    8: `<p>8</p>`,
}


let board;
let bombLocations;
let val;


///Cached elements
const reset = document.getElementById('reset')


//// Event listeners
reset.addEventListener('click', init)








////////FUNCTIONS
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

///////////////// FOR LOOP THAT HANDLES BEFORE OR AFTER
// for(let i =0; i< newBoard.length; i++){
// if(newBoard[i] === 'mine'){
//     if(newBoard[i - 1] !== 'mine'){
//         if(newBoard[i - 1] === null){
//             newBoard[i - 1] = 1
//         } else {
//             newBoard[i - 1]++
//         }
//     }
// }

// if(newBoard[i] === 'mine'){
//     if(newBoard[i + 1] !== 'mine'){
//         if(newBoard[i + 1] === null){
//             newBoard[i + 1] = 1
//         } else {
//             newBoard[i + 1]++
//         }
//     }
// }
// }
///////////////// FOR LOOP THAT HANDLES BEFORE OR AFTER

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


    console.log(board, 'after', i, j)
    
  
}
}

}