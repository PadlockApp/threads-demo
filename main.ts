; (global as any).WebSocket = require('isomorphic-ws')
import { KeyInfo, ThreadID, Identity } from '@textile/hub'
import { Database, Collection, JSONSchema } from "@textile/threads-database"
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

interface Message {
    _id: string
    author: string
    text: string
}

const messageSchema: JSONSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {
        ChatBasic: {
            title: 'ChatBasic',
            type: 'object',
            properties: {
                _id: {
                    type: 'string',
                },
                text: {
                    type: 'string',
                },
                author: {
                    type: 'string',
                },
            },
            required: ['text', 'author', '_id'],
        },
    },
}

const newCollection = async (db: Database, roomName: string): Promise<Collection<Message>> => {
    const chat = await db.newCollection<Message>(roomName, messageSchema)
    return chat
}

const addListener = async (db: Database, name: string) => {
    const filter = `${name}.*.0` // filter to our chat room collection
    db.emitter.on(filter, (values: any, type: any) => {
        //console.log(values)
        const message: Message = values.event.patch;
        console.log(message)
    })
}

const send = async (collection: Collection<Message>, text: string, author: string) => {
    const message: Message = {
        _id: '',
        author: author,
        text: text,
    }
    await collection.insert(message)
}

const example = async () => {
    const keyInfo: KeyInfo = {
        // Using insecure keys
        key: process.env.USER_API_KEY,
        secret: '',
        // @ts-ignore
        type: 1,
    }
    const threadID = ThreadID.fromRandom()
    const db = await init(keyInfo, threadID)
    const identity = await Libp2pCryptoIdentity.fromRandom()
    const thread = await startThread(db, db.threadID, identity)

    await addListener(db, 'room101')

    const chat = await newCollection(db, 'room101')


    setTimeout(() => {
        send(chat, 'hello', 'Ahmed')
    }, 2000)
}

example()