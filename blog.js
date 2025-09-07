const STORAGE_KEY = 'tradestone_blog';

const defaultData = {
  posts: [
    {
      id: 'p1',
      title: 'Welcome to the TradeStone Blog',
      content: 'This is a demo post about using hammers.',
      hammerCount: 0,
      comments: [
        { id: 'c1', text: 'Nice post!', hammerCount: 0 }
      ]
    },
    {
      id: 'p2',
      title: 'Second Post',
      content: 'Another sample post to show the blog working.',
      hammerCount: 0,
      comments: []
    }
  ]
};

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      // fall through to default
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function createPost(userId, title, content) {
  const data = loadData();
  const id = Date.now().toString();
  data.posts.unshift({ id, title, content, hammerCount: 0, comments: [] });
  saveData(data);
  return id;
}

export async function getPosts() {
  const data = loadData();
  return data.posts;
}

export async function getPost(id) {
  const data = loadData();
  return data.posts.find(p => p.id === id) || null;
}

export async function addComment(postId, userId, text) {
  const data = loadData();
  const post = data.posts.find(p => p.id === postId);
  if (post) {
    post.comments.push({ id: Date.now().toString(), text, hammerCount: 0 });
    saveData(data);
  }
}

export async function getComments(postId) {
  const post = await getPost(postId);
  return post ? post.comments : [];
}

export async function toggleHammer(postId) {
  const data = loadData();
  const post = data.posts.find(p => p.id === postId);
  if (post) {
    post.hammerCount = (post.hammerCount || 0) + 1;
    saveData(data);
  }
}

export async function toggleCommentHammer(postId, commentId) {
  const data = loadData();
  const post = data.posts.find(p => p.id === postId);
  if (post) {
    const comment = post.comments.find(c => c.id === commentId);
    if (comment) {
      comment.hammerCount = (comment.hammerCount || 0) + 1;
      saveData(data);
    }
  }
}
