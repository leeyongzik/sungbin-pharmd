const https = require("https");

const DRUG_API_KEY =
  "e835ddcab3e3dbd67e7e6f7c61e075587bf71f15f9a0935a24cf77fd06195d1b";

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { ingdtName = "" } = req.query;
  if (!ingdtName.trim()) {
    return res.status(400).json({ error: "ingdtName required" });
  }

  const url =
    `https://apis.data.go.kr/1471000/DURIrdntInfoService03/getDurIrdntInfoList03` +
    `?serviceKey=${DRUG_API_KEY}&ingdtName=${encodeURIComponent(ingdtName.trim())}&type=json&numOfRows=10&pageNo=1`;

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
