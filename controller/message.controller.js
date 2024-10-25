import { conversationModel } from "../models/converstaion.model.js";
import { messageModel } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const { id: receiverId } = req.params;
    const senderId = (req?.user?._id).toString();
    console.log(senderId);
    console.log(receiverId);

    let conversation = await conversationModel.findOne({
      participants: { $all: [receiverId, senderId] },
    });

    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [receiverId, senderId],
      });
    }
    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      conversation.messages.push(newMessage?._id);
    }

    await conversation.save();
    await newMessage.save();

    res.status(200).json({ newMessage });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: useToChatWith } = req.params;
    const senderId = req.user?._id;

    const conversation = await conversationModel.findOne({
      participants: { $all: [senderId, useToChatWith] },
    }).populate("messages");

    res.status(200).json({ status: true, conversation:conversation.messages});
  } catch (error) {
    console.log(error);

    res.status(500).json({ status: false, message: "internal server error" });
  }
};
