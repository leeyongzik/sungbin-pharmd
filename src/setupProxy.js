const https = require("https");

const DRUG_API_KEY =
  "e835ddcab3e3dbd67e7e6f7c61e075587bf71f15f9a0935a24cf77fd06195d1b";

function proxy(url, res) {
  https
    .get(url, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => (data += chunk));
      apiRes.on("end", () => {
        res.setHeader("Content-Type", "application/json");
        res.send(data);
      });
    })
    .on("error", (err) => res.status(500).json({ error: err.message }));
}

module.exports = function (app) {
  app.get("/api/drug-info", (req, res) => {
    const itemName = req.query.itemName || "";
    proxy(
      `https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList` +
        `?serviceKey=${DRUG_API_KEY}&itemName=${encodeURIComponent(itemName)}&type=json&numOfRows=5`,
      res
    );
  });

  app.get("/api/dur-pregnancy", (req, res) => {
    const itemName = req.query.itemName || "";
    proxy(
      `https://apis.data.go.kr/1471000/DURPrdlstInfoService03/getDurPrdlstInfoList03` +
        `?serviceKey=${DRUG_API_KEY}&itemName=${encodeURIComponent(itemName)}&type=json&numOfRows=10&pageNo=1`,
      res
    );
  });

  app.get("/api/dur-ingredient", (req, res) => {
    const ingdtName = req.query.ingdtName || "";
    proxy(
      `https://apis.data.go.kr/1471000/DURIrdntInfoService03/getDurIrdntInfoList03` +
        `?serviceKey=${DRUG_API_KEY}&ingdtName=${encodeURIComponent(ingdtName)}&type=json&numOfRows=10&pageNo=1`,
      res
    );
  });
};
