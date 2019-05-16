const fs = require("fs"),
  es = require("event-stream"),
  path = require("path"),
  db = require("./database/database"),
  { getInfoListUid, getInfoUid } = require("./services/get-uids"),
  { getToken } = require("./utils/get-token-live-utils"),
  BASE_PATH = "Data/uidphone",
  RESULT_FILE = "result.json",
  ERROR_FILE = "error.txt",
  MAX_UID_LENGTH = 200;

function walk(currentDirPath, callback) {
  fs.readdir(currentDirPath, function(err, files) {
    if (err) {
      throw new Error("Cant read dir:" + currentDirPath);
    }
    files.forEach(function(name) {
      const filePath = path.join(currentDirPath, name);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        callback(filePath, stat);
      } else if (stat.isDirectory()) {
        walk(filePath, callback);
      }
    });
  });
}
async function ReadFile(file) {
  let totalLines = 0;
  let listUID = [];
  const s = fs
    .createReadStream(file)
    .pipe(es.split())
    .pipe(
      es
        .mapSync(function(line) {
          s.pause();
          if (line) {
            totalLines++;

            const data = line.split("\n");
            Promise.all(
              data.map(async tmp => {
                tmp = tmp.split("\t");
                listUID.push(tmp[1]);
              })
            );
          }
          s.resume();
        })
        .on("error", function(err) {
          console.log("Error while reading file. ", err);
        })
        .on("end", async function() {
          let flag = 0;
          let split700UID = [];
          for (let i = 0; i < listUID.length; i++) {
            let arr = [];
            if (i % MAX_UID_LENGTH === 0) {
              arr = listUID.slice(flag, i + 1);
              flag = i + 1;
              split700UID.push(arr);
            }
          }
          if (listUID.length + 1 !== flag) {
            split700UID.push(listUID.slice(flag, listUID.length));
          }
          for (let i = 0; i < split700UID.length; i++) {
            await fs.writeFile(ERROR_FILE, JSON.stringify(file), err => {
              if (err) throw err;
            });

            // Get token để chạy
            let token = await getToken();
            console.log("Running with token: ", token);
            if (!token) {
              console.log("File ", file, " đang chạy! ");
              return;
            }

            let info = await getInfoListUid(split700UID[i], token);
            if (info.error) {
              if (!info.error && !info.error.message) {
                Promise.all(
                  split700UID[i].map(async uid => {
                    let a = await getInfoUid(uid, token);
                    if (!a.error) {
                      let infoJSON = JSON.stringify(a) + "\n";
                      // File muốn write vào
                      await fs.appendFile(RESULT_FILE, infoJSON, err => {
                        if (err) throw err;
                      });
                    }
                  })
                );
              }
            }
            for (let property in info) {
              if (info.hasOwnProperty(property)) {
                let abc = info[property];
                let abcd = JSON.stringify(abc) + "\n";
                // File muốn write vào
                await fs.appendFile(RESULT_FILE, abcd, err => {
                  if (err) throw err;
                });
              }
            }
          }
          console.log("Done file :", file);
        })
    );
}

db.connect("mongodb://127.0.0.1:27017/datagrin").then(async msg => {
  console.log(msg);
  walk(BASE_PATH, async function(filePath) {
    await ReadFile(filePath);
  });
});
