let settings = null

class Food {
  constructor (clientSettings) {
    settings = clientSettings
    this.x = Math.floor(Math.random() * settings.width)
    this.y = Math.floor(Math.random() * settings.height)
    this.area = settings.food.area
  }

  reset () {
    this.x = Math.floor(Math.random() * settings.width)
    this.y = Math.floor(Math.random() * settings.height)
  }

  update () {}
}

export default Food
