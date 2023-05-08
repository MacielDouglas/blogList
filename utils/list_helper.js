const _ = require('lodash');

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
  const arr = Object.entries(_.countBy(blogs, 'author')).map(
    ([author, blogs]) => ({
      author,
      blogs,
    })
  );

  return [...arr].pop();
};

const mostLikes = (blogs) => {
  const manyLikes = _(blogs)
    .groupBy('author')
    .map((objs, key) => ({
      author: key,
      likes: _.sumBy(objs, 'likes'),
    }))
    .value();

  return manyLikes.reduce((a, b) => {
    return a.likes > b.likes ? a : b;
  });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlog,
  mostLikes,
};
