const mongoose = require('mongoose')
const authorModel = require('../Models/authorModel')
const blogsModel = require('../Models/blogsModel')
const date = new Date();
const dateStr = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`

///////////////////////////////////////////////createBlogs//////////////////////////////////////////////////////////////

const createBlog = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!requestBody) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide blog details",
      });
    }

    //Extract params
    const { title, body, authorId, tags, category } = requestBody;

    // Validation starts
    if (!title) {
      return res
        .status(400)
        .send({ status: false, message: "Blog Title is required" });
    }
    if (!body) {
      return res
        .status(400)
        .send({ status: false, message: "Blog body is required" });
    }
    if (!authorId) {
      return res
        .status(400)
        .send({ status: false, message: "Author id is required" });
    }
    if (!tags) {
      return res.status(400).send({
        status: false,
        message: " tags are not valid",
      });
    }
    if (!category) {
      return res
        .status(400)
        .send({ status: false, message: "Blog category is required" });
    }
    const findAuthor = await authorModel.findById(authorId);
    if (!findAuthor) {
      return res
        .status(400)
        .send({ status: false, message: `Author does not exists.` });
    }
    const createdata = await blogsModel.create(requestBody)
    console.log(createdata)
    res.status(201).send({ status: true, data: createdata })
  }
  catch (error) {
    console.log(error)
    res.status(500).send({ msg: error.message })
  }
}

/////////////////////////////////////////Update Api/////////////////////////////////////////////////

const updateBlog = async function (req, res) {
  try {
     let title = req.body.title
     let body = req.body.body
     let tags = req.body.tags
     let subcategory = req.body.subcategory
    let blogId = req.params.blogId
   
    if (!blogId) { res.status(400).send({ status: false, msg: "BlogId should present" }) }
    if (!title) { res.status(400).send({ status: false, msg: "title should present" }) }
    if (!body) { res.status(400).send({ status: false, msg: "body should present" }) }
    if (!tags) { res.status(400).send({ status: false, msg: "tags should present" }) }
    if (!subcategory) { res.status(400).send({ status: false, msg: "subcategory should present" }) }
    // if (!publishedAt) { res.status(400).send({ status: false, msg: "publishedAt should present" }) }


    const chkid = await blogsModel.findById({"_id": blogId })
    if (!chkid) {
      res.status(400).send({ status: false, msg: "blog isn't available please check blog Id" })
    }
    if(chkid.isDeleted==true)
    {
      res.status(400).send({status:false,msg:"The document is deleted"})
    }
    const updatblog = await blogsModel.updateOne(
      { "_id": blogId },
      { $set:{ "title": title , "body": body, "tags": tags ,"subcategory": subcategory , "isPublished": true, "publishedAt": dateStr }},
      { new: true })
    res.status(201).send({ Status: true, msg: updatblog })
  }
catch(err) {
    res.status(500).send({ msg: err.message })
  }
}

//////////////////// Delete Api ///////////////////////////////////////////
//1...
const deleteblog = async function (req, res) {

  try {
    let BlogId = req.params.BlogId;
    let Blog = await blogsModel.findById(BlogId);
    if (!Blog) {
      return res.status(404).send({ status: false, msg: "Does not exists" });
    }

    let deletedblog = await blogsModel.findOneAndUpdate(
      { _id: BlogId },
      { $set: { isDeleted: true } },
      { new: true },
    );

    res.status(200).send({ status: true, data: deletedblog });
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  };
}

//2...

let deletedByQueryParams = async function (req, res) {
  try {
    let data = req.query;

    if (data) {
      let deletedBlogsFinal = await blogsModel.updateMany(
        { $in: data },
        { $set: { isDeleted: true }, deletedAt: Date.now() },
        { new: true }
      );

      res.status(200).send({ status: true, result: deletedBlogsFinal });
    } else {
      res.status(400).send({ ERROR: "BAD REQUEST" });
    }
  } catch (err) {
    res.status(500).send({ ERROR: err.message });
  }
};


module.exports.createBlog = createBlog
module.exports.deleteblog = deleteblog
module.exports.deletedByQueryParams = deletedByQueryParams
module.exports.updateBlog = updateBlog

