const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Living in the mud',
    author: 'Fiona Sherek',
    url: 'http://www.fullstack.com',
    likes: 12,
  },
  {
    title: 'Html is Full',
    author: 'Amaro Brando',
    url: 'http://www.internet.com',
    likes: 2,
  },
];

// nonExistingId. que pode ser utilizada para criar um objeto ID de banco de dados que não pertence a nenhum objeto blog no banco de dados.
const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

// blogsInDb que pode ser utilizada para checar as notas armazenadas no banco de dados.
const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
