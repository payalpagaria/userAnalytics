import { eventSchema } from "../validators/eventValidator.js";

export const validateEvent=(req,res,next)=>{
    try {
        req.body=eventSchema.parse(req.body)
        next()
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.errors
          });
    }
}