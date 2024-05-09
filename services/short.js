const UrlMapping = require("../models/UrlMapping");
const {
  digitToCharMap,
  shortUrlLengthConstant,
  KEY_EXPIRY,
} = require("../Constant");
const { client } = require("../services/redisClient");

const shortenUrl = async (req, res) => {
  const longUrl = req.body.longUrl;
  const longUrlExists = await UrlMapping.findOne({ where: { longUrl } });

  if (longUrlExists) {
    return res.status(200).json({
      success: "true",
      data: {
        longUrl: longUrlExists.longUrl,
        shortUrl: process.env.DOMAIN + "/" + longUrlExists.shortUrl,
        createdAt: longUrlExists.createdAt,
      },
    });
  }

  let urlMapping = await UrlMapping.create({ longUrl });

  const uniqueId = urlMapping.id;
  let uniqueNumber = uniqueId;
  let shortUrl = "";

  while (uniqueNumber > 0) {
    let remainder = uniqueNumber % 62;
    shortUrl += digitToCharMap.get(remainder);
    uniqueNumber = Math.floor(uniqueNumber / 62);
  }

  while (shortUrl.length < shortUrlLengthConstant) {
    shortUrl += "=";
  }

  shortUrl = shortUrl.split("").reverse().join("");

  urlMapping.shortUrl = shortUrl;
  urlMapping = await urlMapping.save();

  res.status(200).json({
    success: "true",
    data: {
      longUrl: urlMapping.longUrl,
      shortUrl: req.headers.host + "/" + urlMapping.shortUrl,
      createdAt: urlMapping.createdAt,
    },
  });
};

const getUrl = async (req, res) => {
  const { shortenUrl } = req.params;

  const cachedData = await client.get(shortenUrl);

  if (cachedData) {
    return res.redirect(JSON.parse(cachedData));
  }

  const urlMapping = await UrlMapping.findOne({
    where: { shortUrl: shortenUrl },
  });

  if (!urlMapping) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  await client.set(shortenUrl, JSON.stringify(urlMapping.longUrl), {
    EX: KEY_EXPIRY,
  });
  res.redirect(urlMapping.longUrl);
};

module.exports = { shortenUrl, getUrl };
