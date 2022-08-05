const canvas = document.querySelector('canvas')

canvas.width = 1080
canvas.height = 720
const c = canvas.getContext('2d')

const collisionsMap = []

for (let i = 0; i < collisions.length; i += 90) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

const boundaries = []
const offset = {
  x: -1050,
  y: -100,
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        }),
      )
  })
})

const image = new Image()
image.src = './assets/img/elvenForestMap.png'

const playerDownImage = new Image()
playerDownImage.src = './assets/img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './assets/img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './assets/img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './assets/img/playerRight.png'

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
})

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 316, //!позиция основного спрайта относительно канваса
    y: canvas.height / 2 + 50, //!позиция основного спрайта относительно канваса
  },
  image: playerDownImage,
  frames: {
    max: 4,
  },
  sprites: {
    down: playerDownImage,
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
  },
})

const keys = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

const movables = [background, ...boundaries]

function rectangularCollision({ rect1, rect2 }) {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y + rect1.height >= rect2.position.y &&
    rect1.position.y <= rect2.position.y + rect2.height
  )
}

function animate() {
  background.drow()
  boundaries.forEach((boundary) => {
    boundary.draw()
  })
  player.drow()

  window.requestAnimationFrame(animate)
  let moving = true
  player.moving = false
  if (keys.w.pressed && lastKey === 'w') {
    player.moving = true
    player.image = player.sprites.up
    for (let i = 0; i < boundaries.length; i++) {
      let boundary = boundaries[i]
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false
        console.log('bam')
      }
    }
    if (moving) {
      movables.forEach((movable) => (movable.position.y += 3))
    }
  }
  if (keys.s.pressed && lastKey === 's') {
    player.moving = true
    player.image = player.sprites.down
    for (let i = 0; i < boundaries.length; i++) {
      let boundary = boundaries[i]
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false
      }
    }
    if (moving) {
      movables.forEach((movable) => (movable.position.y -= 3))
    }
  }
  if (keys.a.pressed && lastKey === 'a') {
    player.moving = true
    player.image = player.sprites.left
    for (let i = 0; i < boundaries.length; i++) {
      let boundary = boundaries[i]
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false
        console.log('bam')
      }
    }
    if (moving) {
      movables.forEach((movable) => (movable.position.x += 3))
    }
  }
  if (keys.d.pressed && lastKey === 'd') {
    player.moving = true
    player.image = player.sprites.right
    for (let i = 0; i < boundaries.length; i++) {
      let boundary = boundaries[i]
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false
        console.log('bam')
      }
    }
    if (moving) {
      movables.forEach((movable) => (movable.position.x -= 3))
    }
  }
}

animate()

let lastKey = ''

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      lastKey = 'w'
      keys.w.pressed = true
      break
    case 's':
      lastKey = 's'
      keys.s.pressed = true
      break
    case 'a':
      lastKey = 'a'
      keys.a.pressed = true
      break
    case 'd':
      lastKey = 'd'
      keys.d.pressed = true
      break
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
})
