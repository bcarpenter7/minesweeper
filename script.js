




// const COLORS = {
//     null: 'blue',
//     mine: 'gray',
//     blank: 'yellow'
// }



const mine = `<img src='https://www.giantbomb.com/a/uploads/scale_medium/8/87790/3216800-icon_mine.png' height='100%'>`


const PICTURES = {
    null: '',
    mine: mine,
    number: `<p>3</p>`
}


let board;
let bombLocations;
let val;



init()



function init(){

board = [
    [null, 'number', null, null, null],
    [null, 'mine', null, null, null],
    [null, null, null, null, null],
    [null, null, null, 'mine', null],
    [null, null, null, null, null],
]

render()
}




function render(){
    renderBoard()
}





function renderBoard(){
    
    for(let i = 0; i <= board.flat().length - 1; i++){
      let val = document.querySelector(`#board :nth-child(${i + 1})`)

        val.innerHTML = PICTURES[board.flat()[i]]
 
    }
}






function getBombLocations(){
bombLocations = []
    while(bombLocations.length < 10){
        let rando = Math.floor(Math.random() * 25)
    if(!bombLocations.includes(rando)){
        bombLocations.push(rando)
    }
}
    console.log(bombLocations.sort((a,b) => a - b), 'bombLocations')
}

getBombLocations()