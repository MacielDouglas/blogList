const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) =>
  blogs.reduce((total, like) => total + like.likes, 0);

const favoriteBlog = (blogs) => {
  const bigger = Math.max.apply(
    null,
    blogs.map((res) => res.likes)
  );
  const liked = blogs.filter((like) => like.likes === bigger);
  return {
    title: liked[0].title,
    author: liked[0].author,
    likes: liked[0].likes,
  };
};

const mostBlog = (blogs) => {
  console.log(blogs);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlog,
};
