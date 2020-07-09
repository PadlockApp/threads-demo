import { KeyInfo, ThreadID, Identity } from '@textile/hub'
import { Database } from "@textile/threads-database"
import { Libp2pCryptoIdentity } from '@textile/threads-core'
import { config } from 'dotenv'

// Load your .env into process.env
config()

const init = (keyInfo: KeyInfo, threadID: ThreadID) => {
    const db = Database.withKeyInfo(keyInfo, threadID.toString())
    return db
}

const startThread = async (db: Database, threadID: ThreadID, identity: Identity) => {
    await db.start(identity, { threadID: threadID })
    return threadID
}

const example = async () => {
    const keyInfo: KeyInfo = {
        // Using insecure keys
        key: process.env.USER_API_KEY,
        secret: '',
        // @ts-ignore
        type: 1,
    }
    const threadID = ThreadID.fromString('bafkr5u42tlm553spyrchiu6g44hzxi2l6bzmsl3wiibn5r7vlq3ccvq')
    const db = await init(keyInfo, threadID)
    const identity = await Libp2pCryptoIdentity.fromRandom()
    const thread = await startThread(db, threadID, identity)
}


example()