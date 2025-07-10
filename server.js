// Memanggil library json-server
const jsonServer = require('json-server');

// Membuat server baru
const server = jsonServer.create();

// Mengarahkan router ke file db.json yang ada di folder yang sama
const router = jsonServer.router('db.json');

// Menggunakan middleware standar (logger, cors, dll.)
const middlewares = jsonServer.defaults();

// Menambahkan middleware untuk membaca body dari request (penting untuk login)
server.use(jsonServer.bodyParser);

server.use(middlewares);

// Rute custom untuk proses login
server.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = router.db; // referensi ke database lowdb
  const user = db.get('users').find({ username: username, password: password }).value();

  if (user) {
    // Jika user ditemukan, kirim respons sukses
    res.status(200).json({ message: 'Login berhasil!', user: { id: user.id, username: user.username } });
  } else {
    // Jika user tidak ditemukan, kirim respons error
    res.status(401).json({ message: 'Username atau password salah' });
  }
});

// Gunakan router json-server standar setelah rute custom
server.use(router);

// Ekspor server untuk Vercel
module.exports = server;
