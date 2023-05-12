const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');

// O teste importa a aplicação Express do módulo app.js e o envolve com a função supertest em um objeto chamado superagent. Esse objeto é atribuído à variável api, usada nos testes para fazer requisições HTTP para o backend.
const api = supertest(app);

const Blog = require('../models/blog');

// const initialBlogs = [
//   {
//     title: 'Living in the mud',
//     author: 'Fiona Sherek',
//     url: 'http://www.fullstack.com',
//     likes: 12,
//   },
//   {
//     title: 'Html is Full',
//     author: 'Amaro Brando',
//     url: 'http://www.internet.com',
//     likes: 2,
//   },
// ];

beforeEach(async () => {
  await Blog.deleteMany({});
  // await Blog.insertMany(helper.i)
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

//teste a deletar depois, apenas seguindo os passos vvvvv
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/blogs');

  const titles = response.body.map((t) => t.title);
  expect(titles).toContain('Living in the mud');
});

// adiciona um blog novo e verifica se o numero de blogs aumenta
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'A new experience among species.',
    author: 'The albino cat',
    url: 'http://www.cat_albin.com',
    likes: 11,
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((t) => t.title);
  expect(titles).toContain('A new experience among species.');
});

// Teste que verifica se um blog esta sem conteúdo e não o salva
test('blog without title is not add', async () => {
  const newBlog = {
    author: 'The albino cat',
    url: 'http://www.cat_albin.com',
    likes: 11,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});
// Testes acima deletar ^^^^^^

describe('when there is initially some blogs saved', () => {
  // 4.8
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 100000);

  // 4.9
  test('checks that the property for the unique identifier of the blog posts has the name of id', async () => {
    const response = await api.get('/api/blogs');

    const ids = response.body.map((blog) => blog._id);

    for (const id of ids) {
      expect(id).toBeDefined();
    }
  });

  // 4.10
  test('a new post is created by making an HTTP POST request', async () => {
    const post = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
    };

    await api
      .post('api/blogs')
      .send(post)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain('First class tests');
  });
});
// encerrar a conexao usada pelo Mongoose
afterAll(async () => {
  await mongoose.connection.close();
});
