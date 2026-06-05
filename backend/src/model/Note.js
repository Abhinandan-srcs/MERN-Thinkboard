import mongoose from "mongoose";

// 1st create a scheme
// 2nd model based off of that schema

const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },

    content:{
        type:String,
        required:true,
    },

},
{
    timestamps:true //createdAt, updatedAt
}
);

const Note = mongoose.model("Note", noteSchema)

export default Note