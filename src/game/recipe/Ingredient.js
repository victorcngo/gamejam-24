import { v4 as uuidv4 } from "uuid"
import { Game } from "@/game/Game"
import PixiSprite from "@/game/pixi/PixiSprite"
import TextureLoader from "@/game/TextureLoader"
export default class Ingredient {
	#id
	#name
	#canMove
	#action
	#isCooked
	#inCooking = false
	#speed = .3
	#nbOfFrames = 0
	#game

	constructor(
		ref,
		name,
		size,
		x,
		canMove = true,
		action,
		isCooked = false
	) {
		this.#game = new Game()
		this.#id = uuidv4()
		this.#name = name
		this.#action = action
		this.#canMove = canMove
		this.#isCooked = isCooked

		this.ref = ref
		this.x = x
		this.size = size
		this.tl = new TextureLoader()
		this.textureData = this.tl.assetArray[ this.#name ]
	}

	setAnimatedSpriteFrame(frame) {
		this.pixiSprite.gotoAndStop(frame)
	}

	initPixiSprite() {
		this.pixiSprite = new PixiSprite({
			x: this.x,
			y: 0,
			size: this.size,
			action: this.#action,
			animationName: this.#name,
			zIndex: 0
		}, this.textureData)

		this.addInputOnA()
	}

	create() {
		try {
			this.ref.addIngredient(this)
			this.initPixiSprite()
		} catch (error) {
			console.error("Error creating ingredient:", error)
		}
	}

	update(dt) {
		this.updateGravity(dt)
	}

	updateGravity(dt) {
		if (this.pixiSprite) {
			this.pixiSprite.sprite.position.y += dt * this.#speed

			if (this.pixiSprite.sprite.position.y > window.innerHeight) {
				this.destroy()
				this.ref.removeIngredient(this)
			}
		}
	}

	addInputOnA() {
		const inputSet1 = this.#game.player1.inputSet
		inputSet1.addEvent("a", this.checkCanInteract, this)

		const inputSet2 = this.#game.player2.inputSet
		inputSet2.addEvent("a", this.checkCanInteract, this)
	}

	checkCanInteract(e) {
		const player = e.id === 1 ? this.#game.player1 : this.#game.player2
		if (this.#canMove && !this.#inCooking && this.pixiSprite) {
			if (player && PixiSprite.checkOverlap(player.pixiSprite.sprite, this.pixiSprite)) {
				player.holdIngredient(this)
			}
		}
	}

	destroy() {
		this.ref.removeIngredient(this)
		this.pixiSprite.sprite.destroy()
		this.pixiSprite = null
	}

	getId() {
		return this.#id
	}

	setName(name) {
		this.#name = name
	}

	getName() {
		return this.#name
	}

	setCanMove(canMove) {
		this.#canMove = canMove
	}

	getCanMove() {
		return this.#canMove
	}

	setAction(action) {
		this.#action = action
	}

	getAction() {
		return this.#action
	}

	setIsCooked(isCooked) {
		this.#isCooked = isCooked
	}

	getIsCooked() {
		return this.#isCooked
	}
}
