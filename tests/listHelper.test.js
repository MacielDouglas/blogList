const listHelper = require('../utils/list_helper');
const blogs = require('../utils/blogLIst');
const blogsList = blogs.blogList;

// 4.3
test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

// 4.4
describe('totalLikes', () => {
  test('veremos o totalLikes', () => {
    expect(listHelper.totalLikes(blogsList)).toBe(36);
  });
});

//4.5
describe('favoriteBlog', () => {
  test('discover the blog with the most likes', () => {
    const bigLike = listHelper.favoriteBlog(blogsList);

    expect(bigLike).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    });
  });
});

// 4.6

describe('mostBlogs', () => {
  test('returns the author with the most blogs', () => {
    const mostBlog = listHelper.mostBlog(blogsList);
  });
});
