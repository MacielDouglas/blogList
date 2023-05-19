const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// O teste importa a aplicação Express do módulo app.js e o envolve com a função supertest em um objeto chamado superagent. Esse objeto é atribuído à variável api, usada nos testes para fazer requisições HTTP para o backend.
const api = supertest(app);

const Blog = require('../models/blog');
// const blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe('blog list tests', () => {
  //teste a deletar depois, apenas seguindo os passos vvvvv
  // 4.8
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/blogs');

    const titles = response.body.map((t) => t.title);
    expect(titles).toContain('Living in the mud');
  });

  // 4.9
  test('checks that the property for the unique identifier of the blog posts has the name of id', async () => {
    const response = await api.get('/api/blogs');
    for (blog of response.body) {
      expect(blog.id).toBeDefined();
    }
  });

  // 4.10
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

  // 4.11
  test('verifies that if the likes property is missing from the request', async () => {
    const newPost = {
      title: 'Locking the drawer with the key inside.',
      author: 'Carlos de la Vega',
      url: 'www.locking.com',
    };

    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    const like = response.body.map((l) => l.likes);
    expect(like).toContain(0);
  });

  // 4.12
  // Teste que verifica se um blog esta sem conteúdo e não o salva
  test('blog without title is not add', async () => {
    const newBlog = {
      author: 'Carlos de la Vega',
      url: 'www.locking.com',
      likes: 11,
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe('Delete and update a blog', () => {
  // 4.13
  test(' deleting a single blog post resource', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((t) => t.title);

    expect(titles).not.toContain(blogToDelete.title);
  });

  // 4.14
  test('updating a blog', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const updateBlog = blogsAtStart[0];

    await api
      .put(`/api/blogs/${updateBlog.id}`)
      .send({ likes: 21 })
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const blogUpdated = blogsAtEnd[0];
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    expect(blogUpdated.likes).toBe(21);
  });
});

// Teste que busca e apaga um blog individual
test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb();

  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(resultBlog.body).toEqual(blogToView);
});
// Testes acima deletar ^^^^^^

// Testes do usuario
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'juslv',
      name: 'Juca Silva',
      password: 'silvajuca',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
});

// encerrar a conexao usada pelo Mongoose
afterAll(async () => {
  await mongoose.connection.close();
});
