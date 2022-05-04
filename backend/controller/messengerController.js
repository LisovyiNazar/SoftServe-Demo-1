const formidable = require("formidable")
const fs = require("fs")
const User = require("../models/authModel")
const messageModel = require("../models/messageModel")
const Serializer = require("sequelize-to-json")

module.exports.getFriends = async (req, res) => { 
    const myId = req.myId
    try {
        const friendsGet = await User.findAll().then((friendsGet) => { 
            const friendsGetJson = Serializer.serializeMany(friendsGet, User)
            const friendsGetJsonFilter = friendsGetJson.filter(d => d.id !== myId)
            res.status(200).json({success: true, friends: friendsGetJsonFilter})
        })
    } catch (error) {
        res.status(500).json({error:{errorMessage: "Internal server error"}})
    }
} 

module.exports.messageUploadDB = async (req, res) => {
    const {senderName, reseverId, message} = req.body
    const senderId = req.myId

    try {
        const insertMessage = await messageModel.create({
            senderId: senderId,
            senderName: senderName,
            reseverId: reseverId,
            message: message,
            image: ""
        })
        res.status(200).json({
            success: true, 
            message: {
                senderId: senderId,
                senderName: senderName,
                reseverId: reseverId,
                message: message,
                image: ""
            }
        })
    } catch (error) {
        res.status(500).json({error:{errorMessage: "Internal server error"}})
    }
}

module.exports.messageGet = async (req, res) => {
    const myId = req.myId
    const fdId = req.params.id
    try {
        const getAllMessage = await messageModel.findAll()
        const allMessageJson = Serializer.serializeMany(getAllMessage, messageModel)
        const myMessageJson = allMessageJson.filter(m => m.senderId === `${myId}` && m.reseverId === `${fdId}`)
        const fdMessageJson = allMessageJson.filter((m => m.senderId === `${fdId}` &&  m.reseverId === `${myId}`)) 
        const getAllMessageJsonFilter = myMessageJson.concat(fdMessageJson).sort(function(a, b) {return (a.id - b.id)})
        res.status(200).json({success: true, message: getAllMessageJsonFilter})
    } catch (error) {
        res.status(500).json({error:{errorMessage: "Internal server error"}})
    }
}

module.exports.imageMessageSend = async (req, res) => {
    const form = formidable()

    form.parse(req, async (err,fields,files) => { 
        const senderId = req.myId
        const { senderName, reseverId, imageName } = fields

        const newPath = __dirname + `../../../frontend/public/image/${imageName}`

        files.image.name = imageName

        try {
            fs.copyFile(files.image.filepath, newPath, async (err) => {
                if(err) {
                    res.status(500).json({error:{errorMessage: "Image upload fail"}})
                } else {
                    const insertMessage = await messageModel.create({
                        senderId: senderId,
                        senderName: senderName,
                        reseverId: reseverId,
                        message: "",
                        image: files.image.name
                    })
                    res.status(201).json({
                        success: true,
                        message: {
                            senderId: senderId,
                            senderName: senderName,
                            reseverId: reseverId,
                            message: "",
                            image: files.image.name
                        }
                    })
                }
            })
        } catch (error) {
            res.status(500).json({error:{errorMessage: "Internal server error"}})
        }
    })
}