import { Howl } from 'howler'

export const sounds = {
    tap: new Howl({ src: ['/sounds/tap.mp3'], volume: 0.3 }),
    plop: new Howl({ src: ['/sounds/plop.mp3'], volume: 0.4 }),
    success: new Howl({ src: ['/sounds/success.mp3'], volume: 0.5 }),
    save: new Howl({ src: ['/sounds/save.mp3'], volume: 0.4 })
}

// Play on ingredient select, button click, payment success
