const RegisteredUser = require("./RegisteredUser");
const Post = require("./Post");
const Comment = require("./Comment");

RegisteredUser.hasMany(Post, {
  foreignKey: "registered_user_id",
});

RegisteredUser.hasMany(Comment, {
  foreignKey: "registered_user_id",
});

Post.belongsTo(RegisteredUser, {
  foreignKey: "registered_user_id",
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
});
Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

Comment.belongsTo(RegisteredUser, {
  foreignKey: "registered_user_id",
});
RegisteredUser.hasMany(Comment, {
  foreignKey: "registered_user_id",
});

module.exports = { Post, RegisteredUser, Comment };
