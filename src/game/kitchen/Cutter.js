import { CookingStation } from "./CookingStation"

export class Cutter extends CookingStation {
	currentClicks = 0
	progress = -1
	inCutter = false

	constructor({ ...props }) {
		super({ ...props })
		this.timeLimit = 5000
		this.addInputCounterIn()
	}

	onPressButtonInteract(e) {
		const player = e.id === 1 ? this.game.player1 : this.game.player2
		const ingredient = player.ingredientHold
		if (player && ingredient && this.checkCanInteractWithIngredient(player, ingredient) && !this.inMixer) {
			ingredient.onInteractionCounterIn()
			player.onPlayerInteractCounter(false)
			this.player = player
			this.ingredient = ingredient
			this.inCutter = true
			console.log("dans le cutter")
		}
	}

	onPressButtonCut(e) {
		if (this.inCutter) {
			//Cutter
			this.progress += 1
			if (this.progress === this.ingredient.pixiSprite.sprite.totalFrames) {
				console.log("leaving the station")

				this.player.onPlayerInteractCounter(true)
				this.ingredient.onInteractionCounterEnd()
				this.inCutter = false
				this.player = null
				this.ingredient = null
				this.progress = 0

				// this.ingredient.pixiSprite.sprite.x = this.pixiSprite.sprite.x
			}
		}
	}

	addInputCounterIn() {
		const inputSet1 = this.game.player1.inputSet
		inputSet1.addEvent("i", this.onPressButtonInteract, this)
		inputSet1.addEvent("i", this.onPressButtonCut, this)

		const inputSet2 = this.game.player2.inputSet
		inputSet2.addEvent("i", this.onPressButtonInteract, this)
		inputSet2.addEvent("i", this.onPressButtonCut, this)
	}
}
