const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')
let indxShooter=562
let width = 25
let direction = 1
let invdsID
let goingRight = true
let invdsRemoved = []
let results = 0

for(let i=0; i < 625; i++){
    const sqr = document.createElement('div')
    grid.appendChild(sqr)
}

const sqrs = Array.from(document.querySelectorAll('.grid div'))

const invds = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    25, 26, 27, 28 ,29 , 30 ,31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
    75, 76, 77 ,78, 79 , 80, 81, 82, 83, 84 , 85 , 86, 87, 88, 89, 90
]

function draw() {
    for(let i=0; i<invds.length; i++){
        if(!invdsRemoved.includes(i)){
            sqrs[invds[i]].classList.add('invader')
        }
    }
}

draw()

function remove() {
    for(let i=0; i<invds.length; i++){
        sqrs[invds[i]].classList.remove('invader')
    }
}

sqrs[indxShooter].classList.add('shooter')

function moveShoot(e){
    sqrs[indxShooter].classList.remove('shooter')
    switch(e.key){
        case 'ArrowLeft':
            if(indxShooter % width !== 0) indxShooter -= 1
            break
        case 'ArrowRight':
            if(indxShooter % width < width -1) indxShooter += 1 
            break
    }
    sqrs[indxShooter].classList.add('shooter')
}

window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code)) {
        e.preventDefault();
    }
}, false);
document.addEventListener('keydown', moveShoot)

function moveInvds(){
    const leftEdge = invds[0] % width === 0
    const rightEdge = invds[invds.length -1] % width === width -1
    remove()

    if(rightEdge && goingRight) {
        for (let i=0; i < invds.length; i++){
            invds[i] += width + 1
            direction = -1
            goingRight = false
        }
    }

    if(leftEdge && !goingRight) {
        for (let i=0; i < invds.length; i++){
            invds[i] += width - 1
            direction = 1
            goingRight = true
        }
    }

    for(let i = 0; i < invds.length; i++){
        invds[i] += direction
    }

    draw()

    if(sqrs[indxShooter].classList.contains('invader' , 'shooter')){
        resultsDisplay.innerHTML = 'GAME OVER!'
        clearInterval(invdsID)
    }

    for(let i = 0; i < invds.length; i++){
        if(invds[i] > sqrs.length) {
            resultsDisplay.innerHTML = 'GAME OVER!'
            clearInterval(invdsID)
        }
    }
    
    if(invdsRemoved.length === invds.length){
        resultsDisplay.innerHTML = 'YOU GOT THEM ALL! WINNER!'
        clearInterval(invdsID)
    }
}

invdsID = setInterval(moveInvds, 300)

function shoot(e) {
    let laserID
    let laserIndx = indxShooter
    function moveLaser(){
        sqrs[laserIndx].classList.remove('laser')
        laserIndx -= width
        sqrs[laserIndx].classList.add('laser')

        if(sqrs[laserIndx].classList.contains('invader')){
            sqrs[laserIndx].classList.remove('laser')
            sqrs[laserIndx].classList.remove('invader')
            sqrs[laserIndx].classList.add('boom')

            setTimeout(() => sqrs[laserIndx].classList.remove('boom'), 300)
            clearInterval(laserID)

            const invdRemoved = invds.indexOf(laserIndx)
            invdsRemoved.push(invdRemoved)
            results++
            resultsDisplay.innerHTML = results
            console.log(invdsRemoved)
        }
    }

    switch(e.key){
        case 'ArrowUp':
            laserID=setInterval(moveLaser, 100)
    }
}


document.addEventListener('keydown', shoot)
