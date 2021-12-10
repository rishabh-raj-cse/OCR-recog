// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nextConnect from 'next-connect';
import upload from "../../lib/multer"
import { createWorker, createScheduler } from "tesseract.js"
const app = nextConnect({
  onError(err, req, res) {
    res.json({ error: err.message });
  },
  onNoMatch(req, res) {
    res.status(404).send('Not found');
  }
})


app.use(upload.array("file"));




app.post(async (req, res) => {

  const id = req.body.id;
  const files = req.files;

  let index = 0;
  const scheduler = createScheduler();
  const result = [];

  await (async () => {
    for (var i = 0; i < 3; i++) {
      const w = createWorker();
      await w.load();
      await w.loadLanguage('eng');
      await w.initialize('eng');
      scheduler.addWorker(w);
    }
    const rets = await Promise.all(files.map((file) => (
      scheduler.addJob('recognize', `./public/${file.filename}`)
    )));

    console.log(rets.map(({ data: { text } }) => text));
    result.push(rets.map(({ data: { text } }) => text));
    await scheduler.terminate();
  })();



  index++;


  res.json(result);



})
export default app;

export const config = {
  api: {
    bodyParser: false
  }
}