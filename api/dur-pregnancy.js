const https = require("https");

const DRUG_API_KEY =
  "e835ddcab3e3dbd67e7e6f7c61e075587bf71f15f9a0935a24cf77fd06195d1b";

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { itemName = "" } = req.query;
  if (!itemName.trim()) {
    return res.status(400).json({ error: "itemName required" });
  }

  // getDurPrdlstInfoList03: TYPE_NAME 필드에 "임부금기" 포함 여부로 임부금기 판단
  const url =
    `https://apis.data.go.kr/1471000/DURPrdlstInfoService03/getDurPrdlstInfoList03` +
    `?serviceKey=${DRUG_API_KEY}&itemName=${encodeURIComponent(itemName.trim())}&type=json&numOfRows=10&pageNo=1`;

  https
    .get(url, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => (data += chunk));
      apiRes.on("end", () => {
        res.setHeader("Content-Type", "application/json");
        res.send(data);
      });
    })
    .on("error", (err) => {
      res.status(500).json({ error: err.message });
    });
};
