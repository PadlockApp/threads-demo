import { KeyInfo, ThreadID } from '@textile/hub'
import { Database } from "@textile/threads-database"
import { config } from 'dotenv'

// Load your .env into process.env
config()

const init = (keyInfo: KeyInfo, threadID: ThreadID) => {
    const db = Database.withKeyInfo(keyInfo, threadID.toString())
    return db
}

const example = async () => {
    const keyInfo: KeyInfo = {
        // Using insecure keys
        key: process.env.USER_API_KEY,
        secret: '',
        // @ts-ignore
        type: 1,
    }
    const id = ThreadID.fromString('bafkr5u42tlm553spyrchiu6g44hzxi2l6bzmsl3wiibn5r7vlq3ccvq')

    const db = await init(keyInfo, id)

}


example()