import mongoose from "mongoose";

const eventSchema= new mongoose.Schema({
    session_id:{
        type:String,
        required:true,
        index: true,
        
    },
    event_type:{
        type:String,
        required:true,
        enum:["page_view","click"],
    },
    page_url:{
        type:String,
        required:true,
        index: true
    },
 
    click_coordinates:{
        x: {
            type: Number,
            required: function () {
              return this.event_type === "click";
            }
          },
          y: {
            type: Number, 
            required: function () {
              return this.event_type === "click";
            }
          }
    },
    timestamp:{
        type:Date,
        default: Date.now,

    },

},  {
    timestamps: true,
    strict: "throw"  
}
)



export default mongoose.model("Event", eventSchema);
