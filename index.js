const express = require('express');
const connectDb = require('./config/db');
const { userRouter } = require('./router/userRoutes');
const cors = require('cors');
const { feedRouter } = require('./router/feedRoutes');
const { postRouter } = require('./router/postRoutes');
const http = require('http');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const { messageRouter } = require('./router/messageRoutes');
const { initSocket } = require('./socket/socket');

// ✅ Create HTTP server from Express app
const server = http.createServer(app);

// ✅ Init socket on this server
initSocket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true,
  })
);

// Routes
app.use('/api', userRouter);
app.use('/api', feedRouter);
app.use("/api", postRouter);
app.use("/api", messageRouter);

// ✅ Connect DB and start server
connectDb().then(() => {
  server.listen(PORT, () => { // 🔹 app.listen → server.listen
    console.log("✅ DB connected");
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
