import client from "./client.js";

async function init() {
    // await client.set("msg:4", "i am fine");
    await client.expire("msg:4", 5);
    const result = await client.get("msg:4");
    console.log("Result -> ", result);
}

init();