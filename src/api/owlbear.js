import OBR from '@owlbear-rodeo/sdk'

let isReady = false

function ensureReady() {
  return new Promise((resolve) => {
    if (isReady) {
      resolve()
    } else {
      OBR.onReady(() => {
        isReady = true
        // Add a small delay to ensure everything is truly ready
        setTimeout(resolve, 100)
      })
    }
  })
}

export async function initializeOBR() {
  await ensureReady()
  console.log('Owlbear Rodeo SDK initialized')
}

async function wrapOBRCall(fn) {
  await ensureReady()
  return fn()
}

export function getPlayerName() {
  return wrapOBRCall(() => OBR.player.getName())
}

export function getPlayerId() {
  return wrapOBRCall(() => OBR.player.getId())
}

export function getRoomId() {
  return wrapOBRCall(() => OBR.room.getId())
}

export function isGM() {
  return wrapOBRCall(() => OBR.player.isGM())
}

export function onCharacterUpdate(callback) {
  return wrapOBRCall(() =>
    OBR.room.onMetadataChange((metadata) => {
      if (metadata.characterSheets) {
        callback(metadata.characterSheets)
      }
    })
  )
}

export async function updateCharacter(character) {
  return wrapOBRCall(async () => {
    const metadata = await OBR.room.getMetadata()
    const updatedMetadata = {
      ...metadata,
      characterSheets: {
        ...metadata.characterSheets,
        [character.id]: character.toPlainObject()
      }
    }
    await OBR.room.setMetadata(updatedMetadata)
  })
}

export function getCharacters() {
  return wrapOBRCall(async () => {
    const metadata = await OBR.room.getMetadata()
    return metadata.characterSheets || {}
  })
}