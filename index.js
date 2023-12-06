const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


  const uri = "mongodb+srv://donation:kqCX2COcOZyts6VM@cluster0.dxfaq4m.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const donationData = client.db("donation").collection("donationData");
    const cartData = client.db("donation").collection("cartData");
    const reviewData = client.db("donation").collection("Reviews");
    const paymentData = client.db("donation").collection("payments");

    //donation data
    app.get("/data", async (req, res) => {
      const cursor = donationData.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/data/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await donationData.findOne(query)
      res.send(result);
    });


    //cart
    app.post('/cart', async(req, res)=>{
      const { _id, ...cart } = req.body;
      const result = await cartData.insertOne(cart)
      res.send(result)
    })
    app.get("/cart", async (req, res) => {
      const cursor = cartData.find();
      const result = await cursor.toArray();

      res.send(result);
    });
    app.delete('/cart/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await cartData.deleteOne(query)
      res.send(result)
    })

    // reviews
    app.get('/reviews', async(req, res)=>{
      const cursor = reviewData.find()
      const result = await cursor.toArray()
      res.send(result)

    })
    
    app.post('/reviews', async(req, res)=>{
      const review = req.body
      const result = await reviewData.insertOne(review)
      res.send(result)
    })

    //payment
    app.post('/payment', async(req, res)=>{
      const payment = req.body
      const result = await paymentData.insertOne(payment)
      res.send(result)
    })
    // Send a ping to confirm a successful connectionnode
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the cnlient will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Donation Server Is Running");
});

app.listen(port, () => {
  console.log(`Donation Server Is Running On PORT: ${port}`);
});
