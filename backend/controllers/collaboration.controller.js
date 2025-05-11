import { User } from "../models/user.model";
import generateNextQuestion from "../utils/gemini";

export const selectUserType = async (req, res) => {
    try {
        const { userType } = req.body;
        const userId = req.id;

        if (!userType) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        user.collaboratorProfile.userType = userType;
        await user.save();

        return res.status(200).json({
            message: "User type updated successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

export const startCollaboration = async (req, res) => {
    try {
        const userId = req.id;
        const { lastAnswer } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }
        if (!user.collaboratorProfile || !user.collaboratorProfile.userType) {
          user.collaboratorProfile = {
            userType: user?.userType,
            progress: "started",
            response: [],
            rating: null,
            lastUpdated: new Date(),
          };
        }
        const previousAnswers = user.collaboratorProfile.response.map(
          (item) => ({
            question: item.question,
            response: item.response,
          })
        );

        // If lastAnswer is provided (means user just answered the previous question)
        if (lastAnswer && previousAnswers.length > 0) {
          // Add last question and last response
          const lastQuestion =
            previousAnswers[previousAnswers.length - 1].question;
          user.collaboratorProfile.response[previousAnswers.length - 1].response =
            lastAnswer;
        }

        // Generate next question dynamically
        const nextQuestion = await generateNextQuestion(previousAnswers);

        // Save nextQuestion as a new object with empty response initially
        user.collaboratorProfile.response.push({
          question: nextQuestion,
          response: "", // Will be filled after user answers
        });

        // Update progress
        user.collaboratorProfile.progress = "in_progress";
        user.collaboratorProfile.lastUpdated = new Date();

        await user.save();

        return res.status(200).json({
          message: "Collaboration updated",
          success: true,
          nextQuestion,
        });
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}