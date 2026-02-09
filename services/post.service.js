const { default: mongoose } = require("mongoose");
const feedModel = require("../models/feeds.model");
const axios = require("axios")
require('dotenv').config();


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mongoose model for caching news (create this in your models)
const newsCacheSchema = new mongoose.Schema({
  query: { type: String, unique: true },
  articles: { type: [Object], default: [] }, // Ensure articles is always an array
  lastUpdated: { type: Date, default: Date.now },
});
const NewsCache = mongoose.model('NewsCache', newsCacheSchema);

exports.postService = async (req) => {
  const { caption, media, likes, comments, share, visibility } = req.body;
  if (!caption) {
    throw new Error("Caption is required");
  } else if (!media) {
    throw new Error("Media is required");
  }

  // console.log(req.user , "user kya hai")
  const post = new feedModel({
    caption: caption,
    media: media,
    likes,
    comments,
    visibility,
    user: req.userId,
  });

  await post.save();

  console.log(post, "post jua ai")

  return post;
};


exports.getAllPostByAllUsersService = async () => {
  // 1. Fetch local posts
  const posts = await feedModel.find({}).populate("user");
  if (!posts || posts.length === 0) {
    throw new Error("No Post is found");
  }

  // 2. Fetch news (with caching + pagination)
  const cacheExpiration = 60 * 60 * 1000; // 1 hour
  const cacheKey = "us_top_news";

  let news = [];
  const cache = await NewsCache.findOne({ query: cacheKey });

  if (cache && cache.lastUpdated > new Date(Date.now() - cacheExpiration)) {
    news = cache.articles;
    console.log(`Using ${cache.articles.length} cached news articles`);
  } else {
    try {
      const apiKey =
        process.env.NEWSDATA_API_KEY ||
        "pub_bad855fec0014cae818f01dbbb95b529";
      const baseUrl = "https://newsdata.io/api/1/latest";

      let nextPage = null;
      let fetchedNews = [];

      do {
        const response = await axios.get(baseUrl, {
          params: {
            apikey: apiKey,
            country: "us",
            prioritydomain: "top",
            page: nextPage || undefined,
          },
        });

        if (response.data.status === "success") {
          const results = response.data.results || [];
          fetchedNews.push(...results);
          console.log(
            `Fetched ${results.length} news articles. Total so far: ${fetchedNews.length}`
          );

          nextPage = response.data.nextPage;
        } else {
          console.error("API error:", response.data.message);
          break;
        }
      } while (nextPage);

      news = fetchedNews;

      // cache save/update
      await NewsCache.updateOne(
        { query: cacheKey },
        { articles: news, lastUpdated: new Date() },
        { upsert: true }
      );
    } catch (err) {
      console.error("Error fetching news:", err.message);
    }
  }

  // 3. Merge posts + news
  const combinedData = [
    ...posts.map((p) => ({
      type: "post",
      _id: p._id,
      content: p.content,
      user: p.user,
      caption: p.caption,
      media: p.media,
      likes: p.likes,
      comments: p.comments,
      shares: p.shares,
      visibility: p.visibility,
      createdAt: p.createdAt,
    })),
    ...news.map((n) => ({
      type: "news",
      article_id: n.article_id,
      title: n.title,
      link: n.link,
      creator: n.creator,
      source_icon: n.source_icon,
      source_name: n.source_name,
      description: n.description,
      source: n.source_id,
      image_url: n.image_url,
      pubDate: n.pubDate,
    })),
  ];

  // 4. Remove duplicates
  const seenIds = new Set();
  const uniqueData = combinedData.filter((item) => {
    const id = item.type === "post" ? item._id.toString() : item.link; // link for news uniqueness
    if (seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });

  // 5. Sort by date
  uniqueData.sort(
    (a, b) =>
      new Date(b.createdAt || b.pubDate) - new Date(a.createdAt || a.pubDate)
  );

  return uniqueData;
};



exports.getAllPostService = async (data) => {
  const id = data.userId;
  const posts = await feedModel.find({ user: id });
  if (!posts) {
    throw new Error(" No Post is found");
  }

  return posts;
};

exports.getPostByIdService = async (id) => {


  const post = await feedModel.findById(id);
  if (!post) {
    throw new Error(" Post is not found");
  }

  return post;
};

exports.updatePostService = async (updatedData, id) => {
  if (!id) {
    throw new Error("Id is required");
  }

  const postUpdate = await feedModel.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!postUpdate) {
    throw new Error("Post is not found");
  }

  return postUpdate;
};


