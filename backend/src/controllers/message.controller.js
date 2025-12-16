import User from "../models/User.js";
import Message from "../models/Message.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedIn = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedIn} });
        res.status(200).json(filteredUsers);
    } catch(error) {
        console.log("Error in message controller - getAllContacts");
        res.status(500).json({message: "Internal server error"});
    } 
}

export const sendMessage = async (req, res) => {
    try {
        const {id: receiverId} = req.params;
        const {text} = req.body;
        const message = new Message(
            {
                senderId: req.user._id,
                receiverId,
                text,

            }
        )
       await message.save();
       // TODO: Implement sending msg in real time
       res.status(201).json(message);
            
    } catch(error) {
        console.log("Error in message controller - sendMessage");
        res.status(500).json({message: "Internal server error"});
    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const {id: userToChatId} = req.params;
        const messages = await Message.find({
            $or: [
                {
                    senderId:  myId, receiverId: userToChatId,
                },
                {
                    senderId: userToChatId, receiverId: myId,
                }
            ]
        });
        res.status(200).json(messages);
    } catch(error) {
        console.log("Error in message controller - getMessagesByUserId");
        res.status(500).json({message: "Internal server error"});
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedIn = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId: loggedIn},{receiverId: loggedIn},
            ]
        })
        
        const chatPartnerIds = messages.map((msg) => {
           return msg.senderId.toString() === loggedIn ? msg.receiverId.toString() : msg.senderId.toString();

        })
        const uniqueChatPartnerIds = [...new Set(chatPartnerIds)];
        const chatPartners = await User.find({ _id: { $in: uniqueChatPartnerIds } }).select("-password");
        res.status(200).json(chatPartners);
    
    } catch(error) {
        console.log("Error in message controller - getChatPartners");
        res.status(500).json({message: "Internal server error"});
    }
}

