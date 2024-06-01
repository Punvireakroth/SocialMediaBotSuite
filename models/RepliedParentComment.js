// Schema for replied parent comments
const RepliedParentCommentSchema = new mongoose.Schema({
    parentId: { type: String, required: true, unique: true }
});

const RepliedParentComment = mongoose.model('RepliedParentComment', RepliedParentCommentSchema);

module.exports = RepliedParentComment;